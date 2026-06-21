import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db("myAdminDB");
        const sitescollection = db.collection("sites");

        const { siteId } = req.body;
        await sitescollection.deleteOne({ _id: new ObjectId(siteId) });

        res.status(200).json({ message: "사이트 삭제 완료" });
    } catch (error) {
        res.status(500).json({ error: "사이트 삭제 처리 실패" });
    }
}
