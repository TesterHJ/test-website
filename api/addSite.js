import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB"); // DB 이름
    const collection = db.collection("sites"); // 컬렉션 이름

    const { siteName, siteUrl } = req.body;
    await collection.insertOne({ name: siteName, url: siteUrl });

    res.status(200).json({ message: "사이트 추가 완료" });
  } catch (error) {
    res.status(500).json({ error: "DB 저장 실패" });
  }
}
