import { Types } from "mongoose"
import { DishCategory } from "src/mongo/models/dish.model"

export class DishDTO {
    name: string
    ingredients: DishIngredientDTO[]
    price: number
    image: string
    description: string
    category: DishCategory
    timeCook?: number
    isAvailable: boolean
}

class DishIngredientDTO {
    id: string
    quantity: number
}