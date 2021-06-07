const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

//Post Routes
//get all
router.get("/", (req, res) => {
  const result = Post.find();
  if (!result) res.status(404).send("No data found");
  res.status(200).json(result);
});

//create
router.post("/", async (req, res) => {
  const Postname = req.body.name;
  console.log(`recieved input: ${Postname}`);
  const newPost = new Post({name : Postname});
  if(!newPost) res.status(400).send("bad request")
  await newPost.save((err) => {
    if (err){
      console.log(err)
      res.status(400).send("couldnt save to db");
    }
    res.send("Post saved");
  });
});

//get one
router.get("/:id", async (req, response) => {
  await Post.findById(req.params.id,(err,res)=>{
    if(err || !res){
      return response.send("no data found"+err).status(404)
    }
    return response.send(res).status(200)
  })
});

//delete one
router.get("/delete/:id", async (req, response) => {
  await Post.findByIdAndDelete(req.params.id,(err,res)=>{
    if(err){
      return response.send(err).status(404)
    }
    return response.send("document deleted").status(200)
  })
});

//update
router.put("/put/:id", async (req, response) => {
  await Post.findByIdAndUpdate(req.params.id,{name : req.body.name},(err,res)=>{
    if(err){
      return response.send(err).status(404)
    }
    return response.send("document updated").status(200)
  })
});


module.exports = router;
