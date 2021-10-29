const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, lowercase: true },
        slug: { type: String, required: true, lowercase: true, unique: true },
        images: [
            {
                id: { type: String, required: true },
                img: { type: String, required: true },
            },
        ],
        sizes: [
            {
                name: { type: String, required: true },
                count: { type: Number, required: true, default: 0 },
            },
        ],
        price: { type: Number, required: true },
        categoryID: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
        totalStar: { type: Number, default: 0 },
        totalReview: { type: Number, default: 0 }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("product", productSchema);