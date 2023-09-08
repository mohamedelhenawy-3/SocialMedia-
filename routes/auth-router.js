const router = require("express").Router();
const User = require("../models/user-model");

const Joi = require("joi"); //val
const bcrypt = require("bcrypt");
const ErrorResponse = require("../utils/errorResponse");

router.post("/login", async (req, res) => {
  const { error } = validateAgainstErrors(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse(`cant find this user`));
  }
  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) {
    return next(new ErrorResponse(`emai or password invalid`));
  }
  res.send(user.generateAuthToken());
});

function validateAgainstErrors(user) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{5,}$")),
  });

  return schema.validate(user);
}
module.exports = router;
