const router = require("express").Router();
const User= require('../models/user-model');
const bcrypt = require("bcrypt");
const Joi=require('joi')

router.post("/signup", async (req, res) => {
    const { error } = validateAgainstErrors(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      birthofDate:req.body.birthofDate,
      city: req.body.city,
      from:req.body.from
    });
    //save data and response
    x=await user.save();
    res
    .header("x-auth-token", user.generateAuthToken())
    .status(200)
    .send(x);


});
router.post("/login", async (req, res) => {
   
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.send("email not found");
  }
  const validpassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validpassword) {
    res.send("invalid password");
  }
  res.send(user.generateAuthToken());
});

function validateAgainstErrors(user) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().min(1).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
    city: Joi.string().max(255).required(),
    from:Joi.string().max(255).required(),
    birthofDate:Joi.date().optional(),
  });

  return schema.validate(user);
}
module.exports = router;
