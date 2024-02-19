import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import axios from "axios"

export default function Delete({ recipe_id }: { recipe_id: string }) {
  const queryClient = useQueryClient()

  const deleteRecipeMutation = useMutation({
    mutationFn: (recipe_id: string) => {
      return axios.delete(`/.netlify/functions/deleteRecipe?_id=${recipe_id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }),
  })

  function deleteRecipe(recipe_id: string) {
    try {
      deleteRecipeMutation.mutate(recipe_id)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete the selected recipe</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you would like to cancel the order?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteRecipe(recipe_id)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
