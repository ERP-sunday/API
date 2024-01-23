import mongoose from "mongoose";
import toJSON from "../application/toJSON";
import IngredientCategory from "../application/enum/ingredientCategory";

const ingredientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            require: true
        },
        allergenes: [
            {
                type: String,
                trim: true
            }
        ],
        image: {
            type: String
        },
        description: {
            type: String,
            trim: true
        },
        category: {
            type: IngredientCategory,
            require: true
        }
    },
    {
        private: true,
        toJSON: { virtuals: true }
    }
)

ingredientSchema.plugin(toJSON)

export default mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientSchema);