import { MongoClient, ObjectId } from "mongodb"
import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const uri = process.env.DATABASE_URL
  const url = new URL(req.url)
  const user_id = url.pathname.split("/")[3]
  const searchParams = url.searchParams.get("_id") as string
  if (uri) {
    const client = new MongoClient(uri)
    try {
      const collection = client.db("recipe").collection(user_id)
      if (collection) {
        const recipe = await collection.findOne({
          _id: new ObjectId(searchParams),
        })
        return Response.json(recipe)
      }
      const newCollection = await client.db("recipe").createCollection(user_id)
      const recipe = await newCollection.findOne({
        _id: new ObjectId(searchParams),
      })
      return Response.json(recipe)
    } catch (error) {
      console.log("Error from updating recipe:", error)
    }
  }
}
