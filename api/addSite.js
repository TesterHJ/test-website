import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB"); // DB 이름
    const collection = db.collection("sites"); // DB 컬렉션 이름

    const { siteName, siteUrl, siteCategory } = req.body;

    if (!siteName || !siteUrl || !siteCategory) {
      return res.status(400).json({ error: "사이트 이름, 주소, 카테고리를 모두 입력해주세요." });
    }

    await collection.insertOne({
      name: siteName,
      url: siteUrl,
      category: siteCategory
    });

    res.status(200).json({ message: "사이트 추가 완료" });
  } catch (error) {
    res.status(500).json({ error: "DB 저장 실패" });
  }
}
