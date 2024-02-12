import { z } from "zod"
export interface dataFromBackend {
  _id: string
  category: string
  dish_name: string
  preparation_time: string
  seasonings: string
  tags: string
  ingredients: string
}

export const recipeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Dish Name must have at least 1 character",
  }),
  ingredients: z.array(z.object({ value: z.string() })),
  seasonings: z.array(z.object({ value: z.string() })),
  //   method: z.string().min(10),
})

export type RecipeFormValues = z.infer<typeof recipeFormSchema>
