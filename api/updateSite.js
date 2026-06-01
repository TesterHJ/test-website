import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB");
    const sitescollection = db.collection("sites");

    const { id, name, url, siteCategory, icon } = req.body;

    if (!id || !name || !url || !siteCategory || !icon) {
      return res.status(400).json({ error: "필수 값이 누락되었습니다." });
    }

    await sitescollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, url, category: siteCategory, icon } }
    );

    res.status(200).json({ message: "사이트 수정 완료" });
  } catch (error) {
    res.status(500).json({ error: "DB 수정 실패" });
  }
}
