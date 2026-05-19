import { MongoClient } from "mongodb";

let client;
if (!global._mongoClientPromise) {
  client = new MongoClient(process.env.MONGODB_URI);
  global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("myAdminDB");
    const collection = db.collection("sites");

    const sites = await collection.find({}).toArray();
    res.status(200).json(sites);
  } catch (error) {
    res.status(500).json({ error: "DB 연결 실패", detail: error.message });
  }
}
