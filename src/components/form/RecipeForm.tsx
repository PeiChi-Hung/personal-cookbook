import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { RecipeFormValues, recipeFormSchema } from "@/types/RecipeData"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export default function RecipeForm({
  id,
  onClose,
}: {
  id?: string
  onClose: () => void
}) {
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      dish_name: "",
      ingredients: [{ ingredient: "" }],
      seasonings: [{ seasoning: "" }],
      //   method: "",
    },
  })

  const { fields: ingredientFields, append: ingredientAppend } = useFieldArray({
    name: "ingredients",
    control: form.control,
  })

  const { fields: seasoningFields, append: seasoningAppend } = useFieldArray({
    name: "seasonings",
    control: form.control,
  })

  function onSubmit(recipe: RecipeFormValues) {
    return id ? updateRecipe(id, recipe) : createRecipe(recipe)
  }

  const createRecipeMutation = useMutation({
    mutationFn: (recipe: RecipeFormValues) =>
      axios.post("/.netlify/functions/createRecipe", recipe),
    onSuccess: () => onClose(),
  })

  function createRecipe(recipe: RecipeFormValues) {
    try {
      createRecipeMutation.mutate(recipe)
    } catch (error) {
      console.log(error)
    }
  }

  function updateRecipe(recipe_id: string, recipe: RecipeFormValues) {
    console.log(
      "Updating recipe with recipe id",
      recipe_id,
      "with data",
      recipe
    )
    onClose()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="dish_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {ingredientFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`ingredients.${index}.ingredient`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Ingredient
                  </FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => ingredientAppend({ ingredient: "" })}
          >
            Add ingredient
          </Button>
        </div>
        <div>
          {seasoningFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`seasonings.${index}.seasoning`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Seasoning
                  </FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => seasoningAppend({ seasoning: "" })}
          >
            Add seasoning
          </Button>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
