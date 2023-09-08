const router = require("express").Router();
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageController");
const auth = require("../middellware/auth-middlware");

router.get("/:chatId", [auth], allMessages);

router.post("/", [auth], sendMessage);

module.exports = router;
