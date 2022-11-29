const router = require("express").Router();
const bcrypt = require("bcrypt");
const admin = require("../middellware/Admin-Middellware");
const User = require("../models/user-model.js");

router.get("/allusers", async (req, res) => {
  const allusers = await User.find();
  if (!allusers) return res.send("no users");
  res.status(200).json({ allusers });
});
//get userone user
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.send("not found that user");
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});
router.put("/update", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      //$set for set all thing req.body
      const UpdatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      const Upadteduser = UpdatedUser.save();
      res.send(Upadteduser);
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("plz update your fucken account mother fucker");
  }
});
//follow user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentuser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        //push id in somw users
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentuser.update({ $push: { followwing: req.params.id } });
        res.send("user has been followed");
      } else {
        res.send("you already follow this user");
      }
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("you cant follow your self");
  }
});
router.put("/id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentuser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        //push id in somw users
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentuser.update({ $pull: { followwing: req.params.id } });
        res.send("user has been unfollowed");
      } else {
        res.send(" unfollow this user");
      }
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("you cant unfollow your self");
  }
});
router.delete("/delete/:id", [admin], async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.send("user not found");
    res.json({ message: "user removed success" });
  } catch (error) {
    res.send(error);
  }
});
//delete user

module.exports = router;
