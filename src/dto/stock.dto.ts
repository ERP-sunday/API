export class StockDTO {
    ingredients: IngredientItemDTO[];
}

class IngredientItemDTO {
    ingredientId: string
    currentQuantity: number
    minimalQuantity: number
    dateAddedToStock: string
    dateLastModified?: string
}