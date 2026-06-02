import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB"); // DB 이름
    const sitescollection = db.collection("sites"); // DB 컬렉션 이름

    const { siteId } = req.body;
    await sitescollection.deleteOne({ _id: new ObjectId(siteId) });

    res.status(200).json({ message: "사이트 삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: "DB 삭제 실패" });
  }
}
