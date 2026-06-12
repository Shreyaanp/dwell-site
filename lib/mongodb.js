import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "dwell";

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._dwellMongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._dwellMongoClientPromise = client.connect();
    }

    clientPromise = global._dwellMongoClientPromise;
  } else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export function hasMongoConfig() {
  return Boolean(uri);
}

export async function getDatabase() {
  if (!clientPromise) {
    throw new Error("Missing MONGODB_URI. Add it to your environment before using database routes.");
  }

  const client = await clientPromise;
  return client.db(dbName);
}
