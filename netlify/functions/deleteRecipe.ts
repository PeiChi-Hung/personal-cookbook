import { MongoClient, ObjectId } from "mongodb"
import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const uri = process.env.DATABASE_URL
  const url = new URL(req.url)
  const searchParams = url.searchParams.get("_id") as string
  const user_id = url.pathname.split("/")[3]

  if (uri) {
    const client = new MongoClient(uri)
    try {
      await client.connect()
      const database = client.db("Recipe")
      const collection = database.collection(user_id)
      if (collection) {
        const recipe = await collection.deleteOne({
          _id: new ObjectId(searchParams),
        })
        return Response.json(recipe)
      }
      const newCollection = await database.createCollection(user_id)
      const recipe = await newCollection.deleteOne({
        _id: new ObjectId(searchParams),
      })
      return Response.json(recipe)
    } catch (error) {
      console.log("Error from updating recipe:", error)
    }
  }
}
