import { MongoClient } from "mongodb"
import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const uri = process.env.DATABASE_URL
  const body = await new Response(req.body).text()
  if (uri) {
    const client = new MongoClient(uri)

    try {
      await client.connect()
      const database = client.db("Recipe")
      const collection = database.collection("dishes")
      const recipeObject = JSON.parse(body)
      await collection.insertOne(recipeObject)
      console.log(body)
    } catch (error) {
      console.log(error)
    }
  }
}
