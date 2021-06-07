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
    enum:["cat1","cat2","cat3"],
    type:String,
    default:"cat1",
    required:true
  },
  imgLink:{
    type:String,
    required:true,
    min:6
  }
});

module.exports = mongoose.model("Post", Schema);
