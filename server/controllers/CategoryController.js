const Category = require("../models/CategoryModel");
const slugify = require("slugify");
const { removeAccents } = require("../configs/CONFIGS");
const Product = require("../models/ProductModel");

const getCategories = (req, res, next) => {
    try {
        const result = await Category.find().exec();
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const postCategory = (req, res, next) => {
    if (req.user.role === "admin") {
        const { name, image } = req.body;
        Category.findOne({ slug: slugify(removeAccents(name)) })
            .then((result) => {
                if (result) {
                    return res.status(404).json({
                        error: "Tên sản phẩm đã tồn tại!!!",
                    });
                } else {
                    const newCategory = new Category({
                        name,
                        slug: slugify(removeAccents(name)),
                        image: image,
                    });
                    newCategory
                        .save()
                        .then((data) => {
                            return res.status(201).json({
                                success: true,
                                data,
                            });
                        })
                        .catch((err) => {
                            res.status(500).json({
                                error: err,
                            });
                        });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    error: err,
                });
            });
    }
};

const getCategory = (req, res, next) => {
    try {
        const result = await Category.findById({ _id: req.params.id });
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        if (!Object.is(req.user.role, "admin")) {
            return res.status(404).json({
                error: "Không tìm thấy tài khoản!!",
                success: false,
            });
        }
        if (Object.is(req.user.role, "admin")) {
            try {
                const { id } = req.params;
                const category = await Category.findOne({ _id: id });
                if (!category) {
                    return res.status(404).json({
                        error: "Đã xảy ra lỗi hoặc không tìm thấy loại sản phẩm!!",
                    });
                }
                let result = await category.deleteOne();
                let data = await Product.deleteMany({ categoryID: result._id });
                if (!data) {
                    return res.status(404).json({
                        error: "Đã xảy ra lỗi hoặc không tìm thấy sản phẩm!!",
                    });
                }
                return res.status(200).json(result);
            } catch (error) {
                return res.status(500).json({
                    error: err,
                });
            }
        }
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    const { name, image } = req.body;
    try {
        if (req.user.role === "admin") {
            const result = await Category.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        name: name,
                        slug: slugify(removeAccents(name)),
                        image: image,
                    },
                },
                { new: true }
            );
            return res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
};

const search = async (req, res, next) => {
    const { search } = req.body;
    try {
        let result = await Category.find({
            name: { $regex: search, $options: "$i" },
        });
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    postCategory,
    getCategory,
    deleteCategory,
    updateCategory,
    search,
};
