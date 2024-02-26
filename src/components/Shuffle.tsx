import { Button } from "./ui/button"
import axios from "axios"
import { queryClient } from "@/Providers"
import { useState } from "react"
import { dataFromBackend } from "@/types/RecipeData"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function Shuffle() {
  const [randomRecipe, setRandomRecipe] = useState([])
  const handleShuffle = async () => {
    const data = await queryClient.fetchQuery({
      queryKey: ["randomRecipes"],
      queryFn: async () => {
        const res = await axios.get("/.netlify/functions/shuffle")
        return res.data
      },
    })
    setRandomRecipe(data)
  }
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      {randomRecipe.length <= 1 ? (
        <p className="text-xl">
          Not sure what to eat? Let the computer pick one for you!
        </p>
      ) : (
        <div className="mb-4">
          {randomRecipe.map((recipe: dataFromBackend) => (
            <Card className="w-[350px]" key={recipe._id}>
              <CardHeader>
                <CardTitle>{recipe.dish_name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      <Button className="px-10 mt-5" onClick={handleShuffle}>
        Shuffle
      </Button>
    </div>
  )
}
