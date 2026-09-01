import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "pvcshowpiecebazar";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // During build time or when MONGODB_URI is not set, provide a dummy
  // The API routes will check and return empty arrays
  clientPromise = Promise.reject(new Error("MONGODB_URI not set"));
} else if (process.env.NODE_ENV === "development") {
  const globalWithMongo = globalThis as unknown as {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const c = await clientPromise;
  return c.db(dbName);
}

export async function isMongoConfigured(): Promise<boolean> {
  try {
    await getDb();
    return true;
  } catch {
    return false;
  }
}

export default clientPromise;
