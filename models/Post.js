const mongoose = require("mongoose");

//Post Model Schema
const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 6,
  },
  disc:{
    type:String,
    required:true
  },
  category:{
    enum:["volunteer","teacher","intern"],
    type:String,
    default:"volunteer",
    required:true
  },
  imgLink:{
    type:String,
    required:true,
    min:6
  }
});

const Post = mongoose.model("Post", Schema);
module.exports = Post;