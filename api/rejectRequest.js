// 요청 거절 API
const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// POST /api/rejectRequest
router.post("/", async (req, res) => {
  try {
    const { siteName } = req.body;

    const request = await Request.findOne({ siteName, status: "pending" });
    if (!request) return res.status(404).json({ message: "요청을 찾을 수 없습니다." });

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "요청이 거절되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "요청 거절 실패" });
  }
});

module.exports = router;
