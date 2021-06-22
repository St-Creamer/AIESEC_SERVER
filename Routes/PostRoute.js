const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

//Post Routes
//get all
router.get("/", async (req, res) => {
  try {
    await Post.find().then((data) => {
      if(!data)  return res.status(404).send("no data or bad request \n" + err);
      return res.send(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send("no data or bad request \n" + err);
  } 
});

//create
router.post("/", async (req, res) => {
  const post = {
    title: req.body.title,
    disc: req.body.disc,
    category: req.body.category,
    imgLink: req.body.imgLink,
  };
  console.log(post);
  const newPost = new Post(post);
  if (!newPost) res.status(400).send("bad request");
  await newPost.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send("couldnt save to db"+err);
    }
    res.send("Post saved");
  });
});

//get by category
router.get("/post/:category", async (req, response) => {
  const cat = req.params.category
  console.log(cat)
  await Post.find({category:cat}, (err, res) => {
    if (err || !res) {
      return response.send("no data found" + err).status(404);
    }
    return response.send(res).status(200);
  });
});

//get one
router.get("/:id", async (req, response) => {
  await Post.findById(req.params.id, (err, res) => {
    if (err || !res) {
      return response.send("no data found" + err).status(404);
    }
    return response.send(res).status(200);
  });
});



//delete one
router.get("/delete/:id", async (req, response) => {
  await Post.findByIdAndDelete(req.params.id, (err, res) => {
    if (err) {
      return response.send(err).status(404);
    }
    return response.send("document deleted").status(200);
  });
});

//update
router.put("/put/:id", async (req, response) => {
  await Post.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    (err, res) => {
      if (err) {
        return response.send(err).status(404);
      }
      return response.send("document updated").status(200);
    }
  );
});

module.exports = router;
