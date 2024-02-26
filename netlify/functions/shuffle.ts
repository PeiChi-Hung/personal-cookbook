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
      const res = await collection
        .aggregate([{ $sample: { size: 1 } }])
        .toArray()
      return Response.json(res)
    } catch (error) {
      console.log("Random generation was unsuccess,", error)
    }
  }
}
