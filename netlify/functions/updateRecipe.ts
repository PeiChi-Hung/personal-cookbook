import { MongoClient, ObjectId } from "mongodb"
import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const uri = process.env.DATABASE_URL
  const url = new URL(req.url)
  const id = url.pathname.split("/")[4]
  const body = await new Response(req.body).text()
  if (uri) {
    const client = new MongoClient(uri)
    try {
      await client.connect()
      const database = client.db("Recipe")
      const collection = database.collection("dishes")
      const updatedRecipe = JSON.parse(body)
      await collection.replaceOne({ _id: new ObjectId(id) }, updatedRecipe)
    } catch (error) {
      console.log("Error from updating recipe:", error)
    }
  }
}
