import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
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

const recipeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Dish Name must have at least 1 character",
  }),
  ingredients: z.array(z.object({ value: z.string() })),
  seasonings: z.array(z.object({ value: z.string() })),
  //   method: z.string().min(10),
})

type RecipeFormValues = z.infer<typeof recipeFormSchema>

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
      name: "",
      ingredients: [{ value: "" }],
      seasonings: [{ value: "" }],
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

  function createRecipe(recipe: RecipeFormValues) {
    console.log("Creating new recipe:", recipe)
    onClose()
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
          name="name"
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
              name={`ingredients.${index}.value`}
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
            onClick={() => ingredientAppend({ value: "" })}
          >
            Add ingredient
          </Button>
        </div>
        <div>
          {seasoningFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`seasonings.${index}.value`}
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
            onClick={() => seasoningAppend({ value: "" })}
          >
            Add seasoning
          </Button>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
