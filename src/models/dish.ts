import mongoose from "mongoose";
import toJSON from "../application/toJSON";
import DishCategory from "../application/enum/dishCategory";

const dishSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            require: true
        },
        ingredients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Ingredient",
                require: true
            }
        ],
        price: {
            type: Number,
            require: true
        },
        image: {
            type: String
        },
        description: {
            type: String,
            trim: true,
            require: true
        },
        category: {
            type: DishCategory,
            require: true
        },
        timeCook: {
            type: Number
        },
        isAvailable: {
            type: Boolean,
            require: true
        }
    },
    {
        private: true,
        toJSON: { virtuals: true }
    }
)

dishSchema.plugin(toJSON)

export default mongoose.models.Dish || mongoose.model("Dish", dishSchema);