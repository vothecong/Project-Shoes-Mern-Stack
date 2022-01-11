require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 4000;
const {
    auth,
    category,
    product,
    order,
    cart,
    review,
} = require("./routes/index");

const strConn = "mongodb://localhost/DBShoes";
mongoose.connect(
    strConn,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    },
    (err) => {
        if (err) {
            console.log(`Connect error: ${err}`);
        } else {
            console.log("Connect success!!");
        }
    }
);

mongoose.Promise = global.Promise;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cors()); //
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.use("/api", auth);
app.use("/api/category", category);
app.use("/api/product", product);
app.use("/api/order", order);
app.use("/api/cart", cart);
app.use("/api/review", review);

app.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "Server is running!!",
    });
});

app.use((req, res, next) => {
    const error = new Error("Not found!!!");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        message: error.message,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running with http://localhost:${PORT}`);
});
