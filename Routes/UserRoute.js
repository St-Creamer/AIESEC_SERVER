const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const isLoggedIn = require("../AuthCheck")

//validation schema
const schema = Joi.object({
  name: Joi.string()
    .min(6)
    .required()
    .error(() => {
      return { message: "name required" };
    }),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("Super", "Admin", "Guest"),
});

//User Routes
//get all
router.get("/",async (req, res) => {
  try {
    await User.find().then((data) => {
      return res.send(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send("no data or bad request \n" + err);
  }
});

//get current user
router.post("/me",isLoggedIn,async (req,res)=>{
  try {
    await User.findById(req.body.id).then((data) => {
        console.log(data)
        let info = {
          role: data.role,
          name: data.name,
          email:data.email
        }
        return res.send(info);
    });
    } catch (err) {
    console.log(err);
    return res.status(404).send("no data or bad request \n" + err);
}
})


//get one
router.get("/:id", async (req, res) => {
    try {
        await User.findById(req.params.id).then((data) => {
            return res.send(data);
        });
        } catch (err) {
        console.log(err);
        return res.status(404).send("no data or bad request \n" + err);
    }
});


//delete one
router.delete("/:id", async (req, response) => {
  await Project.findByIdAndDelete(req.params.id, (err, res) => {
    if (err) {
      return response.status(404).send(err);
    }
    return response.status(200).send("document deleted");
  });
});

//update
router.put("/:id", async (req, response) => {
  //hash pwd
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
  };
  //validate
  const validation = schema.validate(user);
  if (validation.error) {
    return res.status(401).send(validation.error.details[0].message);
  }
  //update
  await User.findByIdAndUpdate(req.params.id, user, (err, res) => {
    if (err) {
      return response.status(404).send(err);
    }
    return response.status(200).send("document updated");
  });
});


module.exports = router;