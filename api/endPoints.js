const express = require('express');
const router = express.Router();

const { sendMessage } = require("../controller/messageController");
const { index } = require("../controller/indexController")

router.post("/v1/message/send",sendMessage)
router.get("/",index)

module.exports = router
