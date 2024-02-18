import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dataFromBackend } from "@/types/RecipeData"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Update from "./Update"
import Delete from "./Delete"

export default function Dish() {
  const useRecipe = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const res = await axios.get("/.netlify/functions/readRecipe")
      return res.data
    },
  })

  if (useRecipe.isLoading) return "Loading"

  const recipeArray = useRecipe.data as dataFromBackend[]

  return (
    <div className="flex flex-row h-[450px] ">
      {recipeArray.map((recipe, index) => (
        <Card className="w-[350px] m-10 relative" key={index}>
          <CardHeader>
            <CardTitle>{recipe.dish_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">食材</p>
            {recipe.ingredients.map((ing, index) => (
              <ul key={index}>{ing.ingredient}</ul>
            ))}
            <br />
            <p className="font-semibold">調料</p>
            {recipe.seasonings.map((sea, index) => (
              <ul key={index}>{sea.seasoning}</ul>
            ))}
            <br />
            <p className="font-semibold">類別</p>
            {recipe.dish_type}
          </CardContent>
          <div className="grid grid-cols-2 absolute bottom-3 space-x-1 px-3 w-full">
            <Update recipe_id={recipe._id} />
            <Delete recipe_id={recipe._id} />
          </div>
        </Card>
      ))}
    </div>
  )
}
