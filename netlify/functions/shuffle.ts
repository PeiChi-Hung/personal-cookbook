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
      const database = client.db("recipe")
      const collection = database.collection(user_id)
      const res = await collection
        .aggregate([{ $sample: { size: 1 } }])
        .toArray()
      return Response.json(res)
    } catch (error) {
      console.log("Random generation was unsuccess,", error)
    }
  }
}
