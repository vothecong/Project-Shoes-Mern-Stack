const Product = require("../models/ProductModel");
const Review = require("../models/ReviewModel");
const { removeAccents } = require("../configs/CONFIGS");
const slugify = require("slugify");

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({})
            .populate("categoryID", "_id name image slug")
            .sort({ createdAt: -1 });

        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

const postProduct = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({
            msg: "Unauthorized",
        });
    }
    const { name, sizes, price, pictures, categoryById } = req.body;
    try {
        const product = await Product.findOne({
            slug: slugify(removeAccents(name)),
        });
        if (product) {
            return res.status(400).json({
                error: "Sản phẩm đã tồn tại!!!",
            });
        }
        const listsizes = [];
        sizes.map((item) =>
            listsizes.push({
                name: item.nameSize,
                count: parseInt(item.count, 10),
            })
        );
        let images = [];
        pictures.map((item) => {
            images.push({
                id: item.id,
                img: item.img,
            });
        });
        const newProduct = new Product({
            name,
            slug: slugify(removeAccents(name)),
            images: pictures,
            sizes: listsizes,
            price: parseInt(price, 10),
            categoryID: categoryById,
        });
        await newProduct.save();
        return res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({
            msg: "Unauthorized",
        });
    }
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({
                error: "Không tìm thấy sản phẩm!!!",
            });
        }
        const result = await product.remove();
        await Review.deleteMany({ productID: result._id });
        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById({ _id: req.params.id }).populate(
            "categoryID",
            "name"
        );
        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({
            msg: "Unauthorized",
        });
    }
    const { name, sizes, price, pictures } = req.body;
    try {
        const product = await Product.findOne({ _id: req.params.id });
        let newImages = [];
        if (pictures.length > 0) {
            pictures.forEach((x) => {
                newImages.push({
                    id: x.id,
                    img: x.img,
                });
            });
        }

        if (sizes.length > 0) {
            sizes.forEach((xx) => {
                const index = product.sizes.findIndex((xy) => xy._id == xx.nameSize);
                product.sizes[index].count = parseInt(xx.count, 10);
            });
        }

        const result = await Product.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    name: name,
                    slug: slugify(removeAccents(name)),
                    price: parseInt(price, 10),
                    sizes: result.sizes,
                    images: newImages,
                },
            },
            { new: true }
        ).populate("categoryID", "name");
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getProductByCategory = async (req, res, next) => {
    try {
        const result = await Product.find({
            categoryID: req.params.categoryID,
        }).populate("categoryID");
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const search = async (req, res, next) => {
    const { search } = req.body;
    try {
        let result = await Product.find({
            name: { $regex: search, $options: "$i" },
        });
        return res.status(200).json({ product: result, success: true });
    } catch (error) {
        next(error);
    }
};

const searchSizeProduct = async (req, res, next) => {
    const { name, id } = req.body;
    try {
        if (name === "all") {
            const result = await Product.find({
                categoryID: id,
            });
            return res.status(200).json(result);
        }
        const result = await Product.find({
            categoryID: id,
            sizes: {
                $elemMatch: {
                    name: name,
                },
            },
        });
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const sortProduct = async (req, res, next) => {
    const { parameter, value, id } = req.body;
    if (parameter === "price") {
        Product.find({ categoryID: id })
            .sort({ price: value })
            .then((result) => {
                return res.status(200).json(result);
            })
            .catch((err) => {
                res.status(500).json({
                    error: {
                        message: err.message,
                    },
                });
            });
    }
    if (parameter === "createdAt") {
        Product.find({ categoryID: id })
            .sort({ createdAt: value })
            .then((result) => {
                return res.status(200).json(result);
            })
            .catch((err) => {
                next(err);
            });
    }
};

const filterProduct = async (req, res, next) => {
    const { min, max, id } = req.body;
    try {
        if (min === "ALL") {
            const result = await Product.find({ categoryID: id }).populate(
                "categoryID",
                "name"
            );
            return res.status(200).json(result);
        }
        const result = await Product.find({
            categoryID: id,
            price: {
                $gte: parseInt(min, 10),
                $lte: parseInt(max, 10),
            },
        });
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getProductBySlug = (req, res, next) => {
    const { slug } = req.params;
    Product.findOne({ slug: slug })
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json({
                error: {
                    message: err.message,
                },
            });
        });
};

const relatedProducts = (req, res, next) => {
    const { typeById, id } = req.body;
    try {
        const product = await Product.find({
            categoryID: typeById,
            _id: { $ne: id },
        }).populate("categoryID");
        const result = product
            .sort(() => {
                return 0.5 - Math.random();
            })
            .slice(0, 4);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const homeProduct = async (req, res, next) => {
    try {
        const dataProduct = await Product.find({
            status: 2,
            createdAt: {
                $gte: new Date(getDayDT()),
                $lte: new Date(getDayCT()),
            },
        }).select("createdAt");
        return res.status(200).json(dataProduct);
    } catch (error) {
        res.status(500).json({
            error: {
                message: error.message,
            },
        });
    }
};

const getPageHomeClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Product.find({ categoryID: id });
        console.log("result", result);
        return res.status(200).json({ products: result, success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    search,
    getProducts,
    postProduct,
    deleteProduct,
    getProduct,
    updateProduct,
    getProductByCategory,
    searchSizeProduct,
    sortProduct,
    filterProduct,
    getProductBySlug,
    relatedProducts,
    homeProduct,
    getPageHomeClient,
};
