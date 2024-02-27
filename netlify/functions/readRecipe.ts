import { MongoClient } from "mongodb"
import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const uri = process.env.DATABASE_URL
  const url = new URL(req.url)
  const user_id = url.pathname.split("/")[3]

  if (uri) {
    const client = new MongoClient(uri)
    try {
      const collection = client.db("recipe").collection(user_id)
      if (collection) {
        const result = await collection.find({}).toArray()
        return Response.json(result)
      }
      await client.db("recipe").createCollection(user_id)
      return Response.json([])
    } catch (error) {
      console.log("Unable to connect to database, reason being", error)
    }
  }
}
