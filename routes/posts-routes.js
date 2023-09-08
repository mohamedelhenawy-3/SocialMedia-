const router = require("express").Router();
const Post = require("../models/posts-model");

const User = require("../models/user-model");
const auth = require("../middellware/auth-middlware");
const ErrorResponse = require("../utils/errorResponse");
//router.get allm posts for one user
router.get("/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId).populate({
    path: "posts",
    populate: {
      path: "images",
      model: "Images",
    },
  });
  res.status(200).json(user);
});
//get a post
router.get("/:postId/:userId", [auth], async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: "posts",
      populate: {
        path: "images",
        model: "Images",
      },
    });
    const post = user.posts.map((pos) => {
      if (pos._id == req.params.postId) return pos;
    });
    if (!post) {
      return next(new ErrorResponse(`cant find this post`));
    }

    return res.send(post);
  } catch (err) {
    next(err);
  }
});

//post posts
router.post("/post/:userId", [auth], async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const post = new Post({
      content: req.body.content,
      creator: user.name,
    });
    const uploadPost = await post.save();
    await user.save();
    res.send(uploadPost);
  } catch (err) {
    next(err);
  }
});
//update the post
router.put("/:id", [auth], async (req, res) => {
  const { error } = validateAgainstErrors(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId).populate("posts");
  const agiza = user.posts.filter(async (post) => {
    if (req.params.id == post._id) return post;
    // console.log('gfuck agiza')
    //   await Post.findByIdAndUpdate(req.params.id,{$set:req.body});
    //  return res.status(200).json({message :'Update successfully '})
  });
  const updatePosts = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!agiza) {
    return next(new ErrorResponse(`cant update this post`));
  }
  res.send(updatePosts);
});
//delete posts
router.delete("/:id", [auth], async (req, res) => {
  const post = await Post.findById(req.params.id).populate("images");
  if (post.userId === req.body.userId) {
    await post.deleteOne();
    res.status(200).json({ message: "delete successfully " });
  } else {
    res.send("cant delete the  post ");
  }
});
//like a post...............
router.put("/:id/like", [auth], async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).send("like");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).send("dislike");
    }
  } catch (err) {
    next(err);
  }
});

//get likes
router.get("/likess/:Id", [auth], async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.Id);
    if (!post.likes) {
      return res.status(200).json({ message: "0" });
    }
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
});
//get a timeline
router.get("/timeline/all", [auth], async (req, res) => {
  const currentuser = await User.findById(req.body.userId);
  const userposts = await Post.find({ userId: currentuser._id });
  console.log(userposts);
  //all post from my friends
  //i will make promies
  const friendposts = await Promise.all(
    //map for all
    currentuser.followwing.map((friendId) => {
      Post.find({ userId: friendId });
    })
  );
  res.send(userposts.concat(...friendposts));
});

module.exports = router;
