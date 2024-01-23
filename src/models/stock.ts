import mongoose from "mongoose";
import toJSON from "../application/toJSON";

const stockSchema = new mongoose.Schema(
    {
        ingredients: [
            {
                ingredient: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Ingredient",
                    require: true
                },
                currentQuantity: {
                    type: Number,
                    require: true
                },
                minimalQuantity: {
                    type: Number,
                    require: true
                },
                dateAddedToStock: {
                    type: String
                },
                dateLastModified: {
                    type: String
                }
            }
        ]
    },
    {
        private: true,
        toJSON: { virtuals: true }
    }
)

stockSchema.plugin(toJSON)

export default mongoose.models.Stock || mongoose.model("Stock", stockSchema);