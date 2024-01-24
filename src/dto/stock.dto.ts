export class StockDTO {
    ingredients: IngredientItemDTO[];
}

class IngredientItemDTO {
    ingredient: string
    currentQuantity: number
    minimalQuantity: number
    dateAddedToStock: string
    dateLastModified?: string
}