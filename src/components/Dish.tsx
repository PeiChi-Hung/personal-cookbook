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
    queryKey: ["recipes"],
    queryFn: async () => {
      const res = await axios.get(`/api/readRecipe/${user_id}`)
      return res.data
    },
  })

  if (useRecipe.isLoading) return "Loading"

  const recipeArray = useRecipe.data as dataFromBackend[]

  if (recipeArray.length == 0)
    return (
      <h1 className="font-bold flex justify-center items-center h-screen">
        Start by adding some recipe you like!
      </h1>
    )
  return (
    <div className="flex flex-row flex-wrap gap-5">
      {recipeArray.map((recipe, index) => (
        <Card className="w-[400px]" key={index}>
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
            {recipe.marinade_seasonings.map((sea, index) => (
              <ul key={index}>{sea.marinade}</ul>
            ))}
            <br />
            <p className="font-semibold">Category</p>
            {recipe.sauce_seasonings.map((sea, index) => (
              <ul key={index}>{sea.sauce}</ul>
            ))}
            <br />
            <p className="font-semibold">Method Steps</p>
            {recipe.method}
          </CardContent>
          <div className="grid grid-cols-2 p-3 space-x-1 w-full">
            <Update recipe_id={recipe.id} />
            <Delete recipe_id={recipe.id} />
          </div>
        </Card>
      ))}
    </div>
  )
}
