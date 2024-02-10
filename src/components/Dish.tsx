import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function Dish() {
  const useRecipe = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await axios.get("/.netlify/functions/mogo")
      return response.data
    },
  })

  console.log(useRecipe.data)

  return (
    <Card className="w-[350px] m-10">
      <CardHeader>
        <CardTitle>蔥鹽雞胸肉</CardTitle>
      </CardHeader>
      <CardContent>
        <p>食材</p>
      </CardContent>
      <CardFooter>
        <p>調料</p>
      </CardFooter>
    </Card>
  )
}
