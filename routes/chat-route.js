const router = require("express").Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const auth = require("../middellware/auth-middlware");

router.post("/", [auth], accessChat);
router.get("/", [auth], fetchChats);
router.post("/group", [auth], createGroupChat);
router.put("/rename", [auth], renameGroup);
router.put("/groupremove", [auth], removeFromGroup);
router.put("/groupadd", [auth], addToGroup);

module.exports = router;
// router.post("/:docId", [auth], postCourse);
