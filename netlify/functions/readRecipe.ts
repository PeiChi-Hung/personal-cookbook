import { MongoClient } from "mongodb"
import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const uri = process.env.DATABASE_URL
  if (uri) {
    const client = new MongoClient(uri)

    try {
      await client.connect()
      const database = client.db("Recipe")
      const collection = database.collection("dishes")
      const result = await collection.find({}).toArray()
      return Response.json(result)
    } catch (error) {
      console.log("Unable to connect to database, reason being", error)
    }
  }
}
