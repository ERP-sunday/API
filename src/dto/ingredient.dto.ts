import { IngredientCategory } from "src/mongo/models/ingredient.model"

export class IngredientDTO {
    name: string
    allergenes: string[]
    image?: string
    category: IngredientCategory
}