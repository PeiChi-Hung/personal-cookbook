import {
  Card,
  CardContent,
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
        <p>食材</p>
      </CardContent>
      <CardFooter>
        <p>調料</p>
      </CardFooter>
    </Card>
  )
}
