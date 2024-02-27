import { MongoClient, ObjectId } from "mongodb"
import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const uri = process.env.DATABASE_URL
  const url = new URL(req.url)
  const user_id = url.pathname.split("/")[3]
  const id = url.pathname.split("/")[4]
  console.log(id)
  const body = await new Response(req.body).text()
  if (uri) {
    const client = new MongoClient(uri)
    try {
      const collection = client.db("recipe").collection(user_id)
      if (collection) {
        const updatedRecipe = JSON.parse(body)
        await collection.replaceOne({ _id: new ObjectId(id) }, updatedRecipe)
      }
      const newCollection = await client.db("recipe").createCollection(user_id)
      const updatedRecipe = JSON.parse(body)
      await newCollection.replaceOne({ _id: new ObjectId(id) }, updatedRecipe)
    } catch (error) {
      console.log("Error from updating recipe:", error)
    }
  }
}
