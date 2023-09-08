const router = require("express").Router();
const bcrypt = require("bcrypt");
const admin = require("../middellware/Admin-Middellware");
const {User,validateUser} = require("../models/user-model.js");
const Upload = require("../utils/multer");
const Cloudinary = require("../utils/cloudinary");
const auth = require("../middellware/auth-middlware");
const bcrypt = require("bcrypt");


router.post("/signup", async (req, res) => {
    const { error } = validateUser(req.body);
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
router.get("/allusers", [admin], async (req, res) => {
  const allusers = await User.find();
  if (!allusers) return res.send("no users");
  res.status(200).json({ allusers });
});
//get userone user
router.get("/userprofile/:id", [auth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.send("not found that user");
    if (req.user.id == user._id) {
      res.status(200).json(user);
    }
  } catch (error) {
    res.send(error);
  }
});
router.put("/updateprofiledata", [auth], async (req, res, next) => {
  try {
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
      res.send("has fault in this update");
    }
  } catch (err) {
    next(err);
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
router.put(
  "/updateProfile/:userId",
  [auth],
  Upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);

      const cloudinaryOptions = {
        folder: `/usersProfiles/${user._id}`,
        quality: "auto:low", // Set the quality to low
        transformation: [
          { width: 300, height: 300, crop: "limit" }, // Resize the image to a smaller size
        ],
      };

      const cloudinaryResponse = await Cloudinary.uploader.upload(
        req.file.path,
        cloudinaryOptions
      );

      console.log(req.file);

      const updateUser = user;
      if (updateUser.profileimg) {
        updateUser.profileimg.public_id = cloudinaryResponse.public_id;
        updateUser.profileimg.url = cloudinaryResponse.url;
      } else {
        updateUser.profileimg = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.url,
        };
      }

      await updateUser.save();
      res.status(200).json({
        message: "Profile image updated successfully",
      });
    } catch (err) {
      next(err);
    }
  }
);
router.get("/followers/:userId", [auth], async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("followers");
    if (!user.followwing) {
      return res.status(404).json({ error: "no followers" });
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

router.get("/following/:userId", [auth], async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("followwings");
    if (!user.followwing)
      return res.status(404).json({ error: "no followings" });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
