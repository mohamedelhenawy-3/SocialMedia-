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
    profileimg: {
      public_id: {
        //
        type: String,
        default: " ",
      },
      url: {
        type: String,
        default: " ",
      },
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
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
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

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required().min(1).max(255),
    city: Joi.string(),
    from: Joi.string(),
    birthdate: Joi.date().required(),
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    //assword must contain at least one letter ([A-Za-z]) and one digit (\\d), and must be at least 5 characters long ({5,}).
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{5,}$")),

    cloudinary_id: Joi.string(),
    url: Joi.string(),
    isAdmin: Joi.boolean(),
    resetPasswordToken: Joi.string(),
    resetPasswordExpires: Joi.date(),
    createdAt: Joi.date(),
  });

  return schema.validate(user);
};

UserSchema.methods.generateAuthToken = function () {
  //return token idd and when admin it will return id and isAdmin:true
  return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, "privateKey"); //returns token
};

module.exports = {
  User: mongoose.model("User", userSchema),
  validateUser: validateUser,
};
