import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db("myAdminDB");
        const sitescollection = db.collection("sites");

        const sites = await sitescollection.find({}).toArray();
        res.status(200).json(sites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "사이트 목록 연결 실패" });
    }
}
