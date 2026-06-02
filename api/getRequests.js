import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("myAdminDB");
    const requestsCollection = db.collection("requests");

    // page와 limit 파라미터 받기
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const requests = await requestsCollection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await requestsCollection.countDocuments();

    res.status(200).json({
      requests,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "요청 목록 불러오기 실패" });
  }
}
