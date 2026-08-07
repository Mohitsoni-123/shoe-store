import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },

    discountPrice: {
        type: Number,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        enum: ["Men", "Women", "Kids", "Sports"],
    },
    sizes: {
        type: [String],
        required: true,
    },
    colors: {
        type: [String],
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    stock: {
        type: Number,
        required: true,
        min:0,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;