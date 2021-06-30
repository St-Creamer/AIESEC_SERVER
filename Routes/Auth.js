const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  //get input
  const credentials = { email: req.body.email, password: req.body.password };

  //attempt to find corresponding user
  await User.findOne({ email: credentials.email }, (err, doc) => {
    if (err || !doc) return res.send("password or email dont match");
    //if found we compare posswords
    bcrypt.compare(credentials.password, doc.password, (err, result) => {
      if (err) return res.send(err);
      if (result) {
        //sign JWT if everything matches
        const accessToken = jwt.sign(
          { id: doc._id, role: doc.role },
          `${process.env.JWT_SECRET_KEY}`
        );
        //send
        res.cookie("Me",doc.role)
        console.log(doc)
        res.cookie("AuthCookie", accessToken, {
          expires: new Date(Date.now() + 900000),
          httpOnly: false, //change this later
          signed:true
        });
        console.log(req.signedCookies)
        res.send(JSON.stringify({msg:`welcome back ${doc.name}`}));
      } else {
        return res.send("password or email dont match");
      }
    });
  });
});

//validation schema
const schema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required(),
  repeat_password: Joi.ref("password"),
  role: Joi.string().valid("Super", "Admin", "Guest"),
});

//create
router.post("/signup", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
  };
  //check for validation
  console.log(user)
  const validation = schema.validate(user);
  console.log(validation);
  if (validation.error) {
    return res.status(401).send(validation.error);
  }
  const newUser = new User(user);
  //check if user exists
  const search = await User.findOne({ email: user.email }).exec();
  if (search) {
    return res.status(422).send("email already exists");
  }
  try {
    //if doesnt exist we save
    await newUser.save();
    return res.status(200).send("User saved");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
