const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    star: { type: Number, required: true },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    avatar: {
        type: String,
        default:
            "https://res.cloudinary.com/kh-ng-c/image/upload/v1606721476/otu2p250wlojafvges8z.png",
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('review', reviewSchema);