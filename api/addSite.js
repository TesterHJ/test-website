import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB");
    const sitescollection = db.collection("sites");

    const { siteName, siteUrl, siteCategory, icon } = req.body;

    if (!siteName || !siteUrl || !siteCategory || !icon) {
      return res.status(400).json({ error: "사이트 이름, 주소, 카테고리, 아이콘을 모두 입력해주세요." });
    }

    await sitescollection.insertOne({
      name: siteName,
      url: siteUrl,
      category: siteCategory,
      icon: icon
    });

    res.status(200).json({ message: "사이트 추가 완료" });
  } catch (error) {
    res.status(500).json({ error: "DB 저장 실패" });
  }
}
