const Cart = require("../models/CartModel");

const postCart = async (req, res, next) => {
    try {
        const { cart } = req.body;
        let result = await Cart.findOne({ userID: req.user._id });
        const cartItems = [];
        if (!Object.is(result, null)) {
            //lấy phần tử chung của 2 mảng
            const eleSame = cart.filter((x) => {
                return result.cartItems.filter((y) => {
                    return (
                        y.productID.toString() === x._id.toString() &&
                        y.nameSize.toString() == x.nameSize.toString()
                    );
                });
            });

            eleSame.map((item) =>
                cartItems.push({
                    productID: item._id,
                    nameSize: item.nameSize,
                    quantity: item.quantity,
                })
            );

            const data = await result.deleteOne();

            const newCart = new Cart({
                cartItems: cartItems,
                userID: req.user._id,
            });

            if (Object.keys(data).length > 0) {
                await newCart.save();
                return res.status(201).json({
                    success: true,
                    message: "Đăng xuất thành công!!!",
                });
            }
        }
        if (Object.is(result, null)) {
            if (cart.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "Đăng xuất thành công!!",
                });
            }
            cart.map((item) =>
                cartItems.push({
                    productID: item._id,
                    nameSize: item.nameSize,
                    quantity: item.quantity,
                })
            );
            const newCart = new Cart({
                cartItems: cartItems,
                userID: req.user._id,
            });
            await newCart.save();
            return res.status(200).json({
                success: true,
                message: "Đăng xuất thành công!!!",
            });
        }
    } catch (error) {
        next(error);
    }
};

const getCarts = async (req, res, next) => {
    try {
        const carts = await Cart.find();
        return res.status(200).json({ carts });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    postCart,
    getCarts
};
