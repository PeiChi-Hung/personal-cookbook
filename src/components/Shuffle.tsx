import { Button } from "./ui/button"
import axios from "axios"
import { queryClient } from "@/Providers"
import { useState } from "react"
import { dataFromBackend } from "@/types/RecipeData"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@clerk/clerk-react"

export default function Shuffle({ totalRecipe }: { totalRecipe: number }) {
  const [randomRecipe, setRandomRecipe] = useState([])
  const { user } = useUser()
  const user_id = user?.id as string
  const handleShuffle = async () => {
    const data = await queryClient.fetchQuery({
      queryKey: ["randomRecipes"],
      queryFn: async () => {
        const res = await axios.get(`/api/shuffle/${user_id}`)
        return res.data
      },
    })
    setRandomRecipe(data)
  }

  // if there are more than 2 recipes in the dataset and user has tried the shuffle function
  // and would like to shuffle again
  if (randomRecipe.length > 0)
    return (
      <div className="flex flex-col items-center justify-center pt-10">
        <div className="mb-4">
          {randomRecipe.map((recipe: dataFromBackend) => (
            <Card className="w-[350px]" key={recipe._id}>
              <CardHeader>
                <CardTitle>{recipe.dish_name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Button className="px-10 mt-5" onClick={handleShuffle}>
          Shuffle Again
        </Button>
      </div>
    )

  // if there are more than 2 recipes in the dataset and user has never shuffle
  if (totalRecipe > 2 && randomRecipe.length == 0)
    return (
      <div className="flex flex-col items-center justify-center pt-10">
        <p className="text-xl">
          Not sure what to eat? Let the computer pick one for you!
        </p>
        <Button className="px-10 mt-5" onClick={handleShuffle}>
          Shuffle
        </Button>
      </div>
    )
}
