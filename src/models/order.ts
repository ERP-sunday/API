import mongoose from "mongoose";
import toJSON from "../application/toJSON";
import OrderStatus from "../application/enum/orderStatus";

const orderSchema = new mongoose.Schema(
    {
        tableNumber: {
            type: Number,
            require: true
        },
        dishes: [
            {
                dish: { type: mongoose.Schema.ObjectId, ref: "Dish" },
                isPaid: { type: Boolean, default: false }
            }
        ],
        status: {
            type: OrderStatus
        },
        totalPrice: {
            type: Number,
            require: true
        },
        tips: {
            type: Number
        },
        date: {
            type: String
        }
    },
    {
        private: true,
        toJSON: { virtuals: true }
    }
)

orderSchema.plugin(toJSON)

export default mongoose.models.Order  || mongoose.model("Order", orderSchema);