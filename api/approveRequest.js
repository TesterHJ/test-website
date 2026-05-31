// 요청 승인 API
const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const Site = require("../models/Site"); // 기존 사이트 컬렉션

// POST /api/approveRequest
router.post("/", async (req, res) => {
  try {
    const { siteName } = req.body;

    const request = await Request.findOne({ siteName, status: "pending" });
    if (!request) return res.status(404).json({ message: "요청을 찾을 수 없습니다." });

    // 요청 승인 → 사이트 컬렉션에 추가
    const newSite = new Site({
      name: request.siteName,
      url: request.url,
      category: request.category,
      icon: "fa-solid fa-globe" // 기본 아이콘
    });
    await newSite.save();

    // 요청 상태 업데이트
    request.status = "approved";
    await request.save();

    res.status(200).json({ message: "요청이 승인되어 사이트에 추가되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "요청 승인 실패" });
  }
});

module.exports = router;
