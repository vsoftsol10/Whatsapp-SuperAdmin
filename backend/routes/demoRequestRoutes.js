const express = require("express");
const router = express.Router();

const {
  createDemoRequest,
} = require("../controllers/demoRequestController");

router.post("/", createDemoRequest);

module.exports = router;