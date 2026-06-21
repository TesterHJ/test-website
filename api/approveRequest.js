import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db("myAdminDB");
        const requestsCollection = db.collection("requests");
        const sitesCollection = db.collection("sites");

        const { siteId, siteName, siteUrl, siteCategory, siteIcon, siteDescription } = req.body;

        if (!siteName || !siteUrl || !siteCategory) {
            return res.status(400).json({ error: "필수 값이 누락되었습니다." });
        }

        // 요청 삭제
        if (siteId) {
            await requestsCollection.deleteOne({ _id: new ObjectId(siteId) });
        }

        // sites 컬렉션에 추가
        await sitesCollection.insertOne({
            name: siteName,
            url: siteUrl,
            category: siteCategory,
            icon: siteIcon || "fa-solid fa-globe",
            description: siteDescription || ""
        });

        res.status(200).json({ message: "요청 승인 완료" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "요청 승인 처리 실패" });
    }
}
