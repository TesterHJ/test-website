import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB");
    const sitescollection = db.collection("requests");

    const requests = await sitescollection.find({}).toArray();
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "요청 목록 불러오기 실패" });
  }
}
