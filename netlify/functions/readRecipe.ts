import { MongoClient } from "mongodb"
import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const uri = process.env.DATABASE_URL
  const url = new URL(req.url)
  const user_id = url.pathname.split("/")[3]

  if (uri) {
    const client = new MongoClient(uri)
    try {
      await client.connect()
      const database = client.db("Recipe")
      const collection = database.collection(user_id)
      if (collection) {
        const result = await collection.find({}).toArray()
        return Response.json(result)
      }
      const newCollection = await database.createCollection(user_id)
      const result = await newCollection.find({}).toArray()
      return Response.json(result)
    } catch (error) {
      console.log("Unable to connect to database, reason being", error)
    }
  }
}
