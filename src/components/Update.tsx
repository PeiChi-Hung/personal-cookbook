import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import RecipeForm from "./form/RecipeForm"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useUser } from "@clerk/clerk-react"

export default function Update({ recipe_id }: { recipe_id: string }) {
  const [open, setOpen] = useState(false)
  const [id, setId] = useState("")
  function onSubmit() {
    setOpen(false)
  }

  const { user } = useUser()
  const user_id = user?.id as string

  const useRecipe = useQuery({
    queryKey: ["selected_recipe", id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/readSelectedRecipe/${user_id}?_id=${id}`
      )
      return response.data
    },
    // disable as long as recipe_id is empty
    enabled: !!id,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setId(recipe_id)}>Edit</Button>
      </DialogTrigger>
      {/* avoid closing dialog from closing when clicking outside */}
      <DialogContent
        className="md:max-w-screen-md overflow-y-scroll md:max-h-screen h-4/5"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogTitle>Edit the current recipe</DialogTitle>
        <RecipeForm
          onClose={onSubmit}
          recipe_id={recipe_id}
          data={useRecipe.data}
        />
      </DialogContent>
    </Dialog>
  )
}
