const mongoose = require("mongoose");
const vdt = require("validator");

const schema = new mongoose.Schema({
  name: {
    type: String,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  //double validation just in case but not working for now oop
  email: {
    type: String,
    validate: {
      validator: (v)=>{
        vdt.isEmail(v)
      },
      message: "not a valid email",
      isAsync: false,
    },
    unique: true,
    required: true,
  },
  role: {
    enum: ["Super", "Admin", "Guest"],
    default: "Su[er", // change this later after testing
    type: String,
  }
});

const User = mongoose.model("User", schema);
module.exports = User;