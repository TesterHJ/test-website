import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("myAdminDB");
      const sites = db.collection("sites");

      const { siteName, siteUrl } = req.body;
      await sites.insertOne({ siteName, siteUrl });

      res.status(200).json({ message: "사이트 추가 완료" });
    } catch (error) {
      res.status(500).json({ error: "DB 저장 실패", detail: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
