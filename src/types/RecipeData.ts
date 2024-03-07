import { z } from "zod"
export interface dataFromBackend {
  _id: string
  category: string
  dish_name: string
  marinade_seasonings: { marinade: string }[]
  sauce_seasonings: { sauce: string }[]
  ingredients: { ingredient: string }[]
  method: string
  link: string
}

export const recipeFormSchema = z.object({
  dish_name: z.string().min(2, {
    message: "Dish Name must have at least 1 character",
  }),
  ingredients: z.array(z.object({ ingredient: z.string() })),
  marinade_seasonings: z.array(z.object({ marinade: z.string() })),
  sauce_seasonings: z.array(z.object({ sauce: z.string() })),
  method: z.string(),
  link: z.string(),
})

export type RecipeFormValues = z.infer<typeof recipeFormSchema>
