import { MongoClient } from "mongodb";

let client;
if (!global._mongoClientPromise) {
  client = new MongoClient(process.env.MONGODB_URI);
  global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { siteName, siteUrl } = req.body;
    if (!siteName || !siteUrl) {
      return res.status(400).json({ error: "사이트 이름과 주소를 입력하세요." });
    }

    const client = await clientPromise;
    const db = client.db("myAdminDB");
    const collection = db.collection("sites");

    await collection.insertOne({ name: siteName, url: siteUrl });
    res.status(200).json({ message: "사이트 추가 완료" });
  } catch (error) {
    res.status(500).json({ error: "DB 저장 실패", detail: error.message });
  }
}
