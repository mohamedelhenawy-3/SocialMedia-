const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const Joi = require('joi')
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      require: true,
    },
    birthofDate: {
      type: Date,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "", //empty string
    },
    followers: {
      type: Array,
      //we keeps userId in this to know people that follow you
      default: [],
    },
    followwing: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        //we keeps userId in this to know people that follow you
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  //when upate users or whatever ... that update timee stampes
  {
    timestamps: true,
  }
);

UserSchema.methods.generateAuthToken = function () {
  //return token idd and when admin it will return id and isAdmin:true
  return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, "privateKey"); //returns token
};

module.exports = mongoose.model("User", UserSchema);
