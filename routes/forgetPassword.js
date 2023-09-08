const router = require("express").Router();

const {
  postReset,
  postCheckToken,
  postResetNewPassword,
} = require("../controller/forgetPassController");

router.post("/reset", postReset);
router.post("/reset/check-token", postCheckToken);
router.post("/reset/new-password", postResetNewPassword);

module.exports = router;
