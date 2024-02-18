import { z } from "zod"
export interface dataFromBackend {
  _id: string
  category: string
  dish_name: string
  // preparation_time: string
  seasonings: { seasoning: string }[]
  ingredients: { ingredient: string }[]
  dish_type: string
}

export const recipeFormSchema = z.object({
  dish_name: z.string().min(2, {
    message: "Dish Name must have at least 1 character",
  }),
  ingredients: z.array(z.object({ ingredient: z.string() })),
  seasonings: z.array(z.object({ seasoning: z.string() })),
  dish_type: z.string(),
  //   method: z.string().min(10),
})

export type RecipeFormValues = z.infer<typeof recipeFormSchema>
