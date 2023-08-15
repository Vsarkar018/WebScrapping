const UserService = require("../Service/UserService");
const express = require("express");
const authMiddleware = require("../Middleware/auth");
const service = new UserService();

const router = express();

router.post("/", service.UserLogin);
router.post("/signup", service.CreateUser);
router.get("/userscrapdata", authMiddleware, service.getAllUrl);

module.exports = router;
