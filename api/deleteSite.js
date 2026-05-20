import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB"); // ✅ hj님 DB 이름
    const collection = db.collection("sites"); // ✅ hj님 컬렉션 이름

    const { id } = req.body;
    await collection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: "사이트 삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: "DB 삭제 실패" });
  }
}
