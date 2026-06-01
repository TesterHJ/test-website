import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB");
    const requestsCollection = db.collection("requests");

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "요청 ID가 필요합니다." });
    }

    const result = await requestsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "해당 요청을 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "요청 거절 완료" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "요청 거절 처리 실패" });
  }
}
