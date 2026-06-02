import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB");
    const sitescollection = db.collection("sites");

    const { siteId, siteName, siteUrl, siteCategory, siteIcon, siteDescription } = req.body;

    if (!siteId || !siteName || !siteUrl || !siteCategory || !siteIcon) {
      return res.status(400).json({ error: "필수 값이 누락되었습니다." });
    }

    await sitescollection.updateOne(
      { _id: new ObjectId(siteId) },
      { $set: { name: siteName, url: siteUrl, category: siteCategory, icon: siteIcon, description: siteDescription || ""} }
    );

    res.status(200).json({ message: "사이트 수정 완료" });
  } catch (error) {
    res.status(500).json({ error: "DB 수정 실패" });
  }
}
