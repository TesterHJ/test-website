import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB"); // DB 이름
    const sitescollection = db.collection("sites"); // DB 컬렉션 이름

    const sites = await sitescollection.find({}).toArray();
    res.status(200).json(sites);
  } catch (error) {
    res.status(500).json({ error: "DB 연결 실패" });
  }
}
