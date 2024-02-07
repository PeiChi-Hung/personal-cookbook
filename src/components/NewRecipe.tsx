import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import RecipeForm from "./form/RecipeForm"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useState } from "react"

export default function NewRecipe() {
  const [open, setOpen] = useState(false)
  function onSubmit() {
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Recipe</Button>
      </DialogTrigger>
      {/* avoid closing dialog from closing when clicking outside */}
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogTitle>Create a new recipe</DialogTitle>
        <RecipeForm onClose={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
