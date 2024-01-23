import mongoose from "mongoose";
import toJSON from "../application/toJSON";

const cardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            require: true,
            unique: true
        },
        dishes: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Dish",
                require: true
            }
        ],
        isActive: {
            type: Boolean,
            require: true
        },
        creationDate: {
            type: String
        }
    },
    {
        private: true,
        toJSON: { virtuals: true }
    }
)

cardSchema.plugin(toJSON)

export default mongoose.models.Card || mongoose.model("Card", cardSchema);