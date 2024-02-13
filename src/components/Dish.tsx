import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { dataFromBackend } from "@/types/RecipeData"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

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
  console.log(recipeArray)
  return (
    <div>
      {recipeArray.map((recipe, index) => (
        <Card className="w-[350px] m-10" key={index}>
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
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  )
}
