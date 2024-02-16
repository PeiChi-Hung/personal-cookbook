import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import RecipeForm from "./form/RecipeForm"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function Update({ recipe_id }: { recipe_id: string }) {
  const [open, setOpen] = useState(false)
  function onSubmit() {
    setOpen(false)
  }

  const useRecipe = useQuery({
    queryKey: ["update_recipe", recipe_id],
    queryFn: async () => {
      const response = await axios.get(
        `/.netlify/functions/readSelectedRecipe?_id=${recipe_id}`
      )
      console.log("data is:", response.data)
      return response.data
    },
    // disable as long as recipe_id is empty
    enabled: !!recipe_id,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      {/* avoid closing dialog from closing when clicking outside */}
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogTitle>Edit the current recipe</DialogTitle>
        <RecipeForm onClose={onSubmit} id={recipe_id} data={useRecipe.data} />
      </DialogContent>
    </Dialog>
  )
}
