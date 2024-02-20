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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  RecipeFormValues,
  dataFromBackend,
  recipeFormSchema,
} from "@/types/RecipeData"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export default function RecipeForm({
  id,
  data,
  onClose,
}: {
  id?: string
  data?: dataFromBackend
  onClose: () => void
}) {
  const recipe = data

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      dish_name: "",
      ingredients: [{ ingredient: "" }],
      seasonings: [{ seasoning: "" }],
      dish_type: "",
      //   method: "",
    },
    values: recipe,
  })

  const {
    fields: ingredientFields,
    append: ingredientAppend,
    remove: ingredientRemove,
  } = useFieldArray({
    name: "ingredients",
    control: form.control,
  })

  const {
    fields: seasoningFields,
    append: seasoningAppend,
    remove: seasoningRemove,
  } = useFieldArray({
    name: "seasonings",
    control: form.control,
  })

  function onSubmit(recipe: RecipeFormValues) {
    return id ? updateRecipe(id, recipe) : createRecipe(recipe)
  }

  const queryClient = useQueryClient()

  const createRecipeMutation = useMutation({
    mutationFn: (recipe: RecipeFormValues) => {
      return axios.post("/.netlify/functions/createRecipe", recipe)
    },
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
    },
  })

  function createRecipe(recipe: RecipeFormValues) {
    try {
      createRecipeMutation.mutate(recipe)
    } catch (error) {
      console.log(error)
    }
  }

  interface updateRecipeVariables {
    recipe_id: string
    recipe: RecipeFormValues
  }

  const updateRecipeMutation = useMutation({
    mutationFn: ({ recipe_id, recipe }: updateRecipeVariables) =>
      axios.put(`/.netlify/functions/updateRecipe/${recipe_id}`, recipe),
    onSuccess: (_data, variables) => {
      onClose()
      // queryClient.setQueryData(["recipes", variables.recipe_id], data)
      queryClient.invalidateQueries({
        queryKey: ["recipes"],
      })
      queryClient.invalidateQueries({
        queryKey: ["selected_recipe", variables.recipe_id],
      })
    },
  })

  function updateRecipe(recipe_id: string, recipe: RecipeFormValues) {
    try {
      updateRecipeMutation.mutate({ recipe_id, recipe })
    } catch (error) {
      console.log(error)
    }
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
          {ingredientFields.map((field, index, array) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`ingredients.${index}.ingredient`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Ingredient
                  </FormLabel>
                  <div className="grid grid-cols-3 items-center">
                    <FormControl
                      className={
                        array.length === 1
                          ? "w-full col-span-3"
                          : "w-full col-span-2"
                      }
                    >
                      <Input {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={
                        array.length === 1
                          ? "hidden"
                          : "align-middle ml-1 block"
                      }
                      onClick={() => ingredientRemove(index)}
                    >
                      Remove
                    </Button>
                  </div>
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
          {seasoningFields.map((field, index, array) => (
            <div>
              <FormField
                control={form.control}
                key={field.id}
                name={`seasonings.${index}.seasoning`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Seasoning
                    </FormLabel>
                    <div className="grid grid-cols-3 items-center">
                      <FormControl
                        className={
                          array.length === 1
                            ? "w-full col-span-3"
                            : "w-full col-span-2"
                        }
                      >
                        <Input {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={array.length === 1 ? "hidden" : "ml-1 block"}
                        onClick={() => seasoningRemove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
        <FormField
          control={form.control}
          name="dish_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Main dish">Main dish</SelectItem>
                  <SelectItem value="Dessert">Dessert</SelectItem>
                  <SelectItem value="Soup">Soup</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
