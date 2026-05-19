import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env or Vercel Environment Variables");
}

if (process.env.NODE_ENV === "development") {
  // 개발 환경에서는 글로벌 변수에 캐시
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // 프로덕션에서는 그냥 새 클라이언트
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
