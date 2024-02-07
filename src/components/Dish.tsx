import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Dish() {
  return (
    <Card className="w-[350px] m-10">
      <CardHeader>
        <CardTitle>蔥鹽雞胸肉</CardTitle>
      </CardHeader>
      <CardContent>
        <h2>食材</h2>
      </CardContent>
      <CardFooter>
        <p>調料</p>
      </CardFooter>
    </Card>
  )
}
