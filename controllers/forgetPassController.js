const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");

const postReset = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found!");
    }
    const token = parseInt(Math.random() * (999999 - 100000) + 100000);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mindaplatform2023@gmail.com",
        pass: "atclecefklwnqgwz",
      },
    });
    transporter.sendMail({
      to: req.body.email,
      from: "mindaplatform2023@gmail.com",
      subject: "Password reset",
      html: `
          <p>You requested a password reset</p>
          <p>Verification code: ${token}</p>
        `,
    });

    res.status(200).json({
      success: true,
      message: "Check your email!",
    });
  } catch (err) {
    next(err);
  }
};
const postCheckToken = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).send("Invalid Token!");
    }
    return res.status(200).json({
      success: true,
      message: "Token is valid!",
    });
  } catch (err) {
    next(err);
  }
};
const postResetNewPassword = async (req, res, next) => {
  try {
    const { error } = validatePassword(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message));

    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse(`invalid token`));
    }
    user.password = await bcrypt.hash(req.body.password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postCheckToken,
  postReset,
  postResetNewPassword,
};
