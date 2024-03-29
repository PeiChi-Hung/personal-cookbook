import { MongoClient } from "mongodb"
import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const uri = process.env.DATABASE_URL
  const url = new URL(req.url)
  const user_id = url.pathname.split("/")[3]
  const body = await new Response(req.body).text()
  if (uri) {
    const client = new MongoClient(uri)

    try {
      const collection = client.db("recipe").collection(user_id)
      const recipeObject = JSON.parse(body)
      if (collection) {
        await collection.insertOne(recipeObject)
      }
    } catch (error) {
      console.log("Error from creating recipe:", error)
    }
  }
}
