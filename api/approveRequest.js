import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB");
    const requestsCollection = db.collection("requests");
    const sitesCollection = db.collection("sites");

    const { _id, name, url, category, icon } = req.body;

    if (!name || !url || !category) {
      return res.status(400).json({ error: "필수 값이 누락되었습니다." });
    }

    // 요청 삭제
    if (_id) {
      await requestsCollection.deleteOne({ _id: new ObjectId(_id) });
    }

    // sites 컬렉션에 추가
    await sitesCollection.insertOne({
      name,
      url,
      category,
      icon: icon || "fa-solid fa-globe"
    });

    res.status(200).json({ message: "요청 승인 완료" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "요청 승인 처리 실패" });
  }
}
