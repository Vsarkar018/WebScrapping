const express = require("express");
const ScrappingService = require("../Service/ScrappingService");
const authMiddleware = require("../Middleware/auth");
const service = new ScrappingService();
const router = express();

router.get("/scrap", authMiddleware, service.getScrappingData);

module.exports = router;
