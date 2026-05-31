import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB");
    const collection = db.collection("requests");

    const { name, url, category, reason } = req.body;

    if (!name || !url || !category || !reason) {
      return res.status(400).json({ error: "사이트 이름, 주소, 카테고리, 요청 이유를 모두 입력해주세요." });
    }

    await collection.insertOne({
      name,
      url,
      category,
      reason,
      createdAt: new Date()
    });

    res.status(200).json({ message: "요청 제출 완료" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "DB 저장 실패" });
  }
}
