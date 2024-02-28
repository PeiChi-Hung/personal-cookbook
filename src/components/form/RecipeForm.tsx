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
import {
  RecipeFormValues,
  dataFromBackend,
  recipeFormSchema,
} from "@/types/RecipeData"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useUser } from "@clerk/clerk-react"
import { Textarea } from "../ui/textarea"
import { Separator } from "../ui/separator"

export default function RecipeForm({
  recipe_id,
  data,
  onClose,
}: {
  recipe_id?: string
  data?: dataFromBackend
  onClose: () => void
}) {
  const recipe = data
  const { user } = useUser()
  const user_id = user?.id as string

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      dish_name: "",
      ingredients: [{ ingredient: "" }],
      marinade_seasonings: [{ marinade: "" }],
      sauce_seasonings: [{ sauce: "" }],
      method: "",
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
    fields: marinadeFields,
    append: marinadeAppend,
    remove: marinadeRemove,
  } = useFieldArray({
    name: "marinade_seasonings",
    control: form.control,
  })

  const {
    fields: sauceFields,
    append: sauceAppend,
    remove: sauceRemove,
  } = useFieldArray({
    name: "sauce_seasonings",
    control: form.control,
  })

  function onSubmit(recipe: RecipeFormValues) {
    return recipe_id
      ? updateRecipe(user_id, recipe_id, recipe)
      : createRecipe(user_id, recipe)
  }

  const queryClient = useQueryClient()

  interface createRecipeVariables {
    user_id: string
    recipe: RecipeFormValues
  }

  const createRecipeMutation = useMutation({
    mutationFn: ({ user_id, recipe }: createRecipeVariables) => {
      return axios.post(`/api/createRecipe/${user_id}`, recipe)
    },
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
    },
  })

  function createRecipe(user_id: string, recipe: RecipeFormValues) {
    try {
      createRecipeMutation.mutate({ user_id, recipe })
    } catch (error) {
      console.log(error)
    }
  }

  interface updateRecipeVariables {
    user_id: string
    recipe_id: string
    recipe: RecipeFormValues
  }

  const updateRecipeMutation = useMutation({
    mutationFn: ({ user_id, recipe_id, recipe }: updateRecipeVariables) =>
      axios.put(`/api/updateRecipe/${user_id}/${recipe_id}`, recipe),
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

  function updateRecipe(
    user_id: string,
    recipe_id: string,
    recipe: RecipeFormValues
  ) {
    try {
      updateRecipeMutation.mutate({ user_id, recipe_id, recipe })
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
        <Separator />
        <p>Seasonings</p>
        <div className="space-y-4">
          <div>
            {marinadeFields.map((field, index, array) => (
              <div key={index}>
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`marinade_seasonings.${index}.marinade`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Seasoning for Marinade
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
                            array.length === 1 ? "hidden" : "ml-1 block"
                          }
                          onClick={() => marinadeRemove(index)}
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
              onClick={() => marinadeAppend({ marinade: "" })}
            >
              Add seasoning
            </Button>
          </div>
          <div>
            {sauceFields.map((field, index, array) => (
              <div key={index}>
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`sauce_seasonings.${index}.sauce`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Seasoning for sauce
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
                            array.length === 1 ? "hidden" : "ml-1 block"
                          }
                          onClick={() => sauceRemove(index)}
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
              onClick={() => sauceAppend({ sauce: "" })}
            >
              Add seasoning
            </Button>
          </div>
        </div>
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Method Steps</FormLabel>
              <Textarea {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
