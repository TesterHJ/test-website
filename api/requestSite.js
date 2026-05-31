// 새로운 사이트 요청 저장 API
const express = require("express");
const router = express.Router();
const Request = require("../models/Request"); // 요청 컬렉션 모델

// POST /api/requestSite
router.post("/", async (req, res) => {
  try {
    const { siteName, reason, category, url } = req.body;

    const newRequest = new Request({
      siteName,
      reason,
      category,
      url,
      status: "pending", // 기본 상태는 대기중
      createdAt: new Date()
    });

    await newRequest.save();
    res.status(200).json({ message: "요청이 저장되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "요청 저장 실패" });
  }
});

module.exports = router;
