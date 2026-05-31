// 요청 목록 불러오기 API
const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// GET /api/getRequests
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "요청 목록 불러오기 실패" });
  }
});

module.exports = router;
