import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dataFromBackend } from "@/types/RecipeData"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Update from "./Update"
import Delete from "./Delete"
import { useUser } from "@clerk/clerk-react"

export default function Dish() {
  const { user } = useUser()
  const user_id = user?.id as string
  const useRecipe = useQuery({
    queryKey: ["recipes", user_id],
    queryFn: async () => {
      const res = await axios.get(`/api/readRecipe/${user_id}`)
      return res.data
    },
  })

  if (useRecipe.isLoading) return "Loading"

  const recipeArray = useRecipe.data as dataFromBackend[]

  if (recipeArray.length == 0)
    return (
      <p className="font-bold text-xl flex justify-center items-center h-screen">
        Start by adding some recipe you like!
      </p>
    )
  return (
    <div className="flex flex-row flex-wrap gap-5">
      {recipeArray.map((recipe, index) => (
        <Card className="w-[350px]" key={index}>
          <CardHeader>
            <CardTitle>{recipe.dish_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">Ingredients</p>
            {recipe.ingredients.map((ing, index) => (
              <ul key={index}>{ing.ingredient}</ul>
            ))}
            <br />
            <p className="font-semibold">Seasonings</p>
            {recipe.seasonings.map((sea, index) => (
              <ul key={index}>{sea.seasoning}</ul>
            ))}
            <br />
            <p className="font-semibold">Category</p>
            {recipe.dish_type}
          </CardContent>
          <div className="grid grid-cols-2 p-3 space-x-1 w-full">
            <Update recipe_id={recipe._id} />
            <Delete recipe_id={recipe._id} />
          </div>
        </Card>
      ))}
    </div>
  )
}
