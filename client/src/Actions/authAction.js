/* eslint-disable no-unused-vars */
import { ADD_CART_BY_SIGNIN, CLEAR_CART } from "../Constants/CartConstant";

const {
    REGISTER_REQUEST,
    REGISTER_ERROR,
    REGISTER_SUCCESS,
    SIGNIN_REQUEST,
    SIGNIN_SUCCESS,
    SIGNIN_ERROR,
    USER_LOGOUT,
    UPDATE_INFO_CUSTOMMER_REQUEST,
    UPDATE_INFO_CUSTOMMER_SUCCESS,
    UPDATE_INFO_CUSTOMMER_ERROR,
    UPDATE_AVATAR_REQUEST,
    UPDATE_AVATAR_ERROR,
    UPDATE_AVATAR_SUCCESS,
    GET_ORDER_BY_CUSOMER_REQUEST,
    GET_ORDER_BY_CUSOMER_SUCCESS,
    GET_ORDER_BY_CUSOMER_ERROR,
    LOGIN_GOOGLE_ERROR,
    LOGIN_GOOGLE_REQUEST,
    LOGIN_GOOGLE_SUCCESS,
    LOGIN_FACEBOOK_REQUEST,
    LOGIN_FACEBOOK_SUCCESS,
    LOGIN_FACEBOOK_ERROR,
} = require("../Constants/AuthConstant");

const signupAction = (name, email, password) => {
    return (dispatch) => {
        dispatch({ type: REGISTER_REQUEST });
        fetch("/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const { message, error, token, user } = result;
                if (error) {
                    dispatch({ type: REGISTER_ERROR, payload: error });
                }
                if (message) {
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("token", token);
                    dispatch({
                        type: REGISTER_SUCCESS,
                        payload: { message, user, token },
                    });
                }
            })
            .catch((err) => {
                dispatch({ type: REGISTER_ERROR, payload: err });
            });
    };
};

const comparer = (orderArray) => {
    return function (y) {
        return (
            orderArray.filter((x) => {
                return (
                    x._id.toString() === y._id.toString() &&
                    x.nameSize.toString() === y.nameSize.toString()
                );
            }).length === 0
        );
    };
};

const signinAction = (email, password, cartLocal, history) => {
    return (dispatch) => {
        dispatch({ type: SIGNIN_REQUEST });
        fetch("/api/user/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const { user, token, cart, message, error, success } = result;
                if (Object.is(success, true)) {
                    let arr = [];
                    if (cart.length > 0 && cart[0].cartItems) {
                        cart[0].cartItems.forEach((item) => {
                            arr.push({
                                categoryID: item.productID.categoryID,
                                images: item.productID.images,
                                name: item.productID.name,
                                nameSize: item.nameSize,
                                price: item.productID.price,
                                quantity: item.quantity,
                                slug: item.productID.slug,
                                _id: item.productID._id,
                            });
                        });
                    }
             
                    cartLocal.forEach((x) => {
                        const index = arr.findIndex(
                            (y) =>
                                y._id.toString === x._id.toString() &&
                                y.nameSize.toString() === x.nameSize.toString()
                        );
                        if (index !== -1) {
                            arr[index].quantity = x.quantity;
                        }
                    });
                    
                    var onlyInB = cartLocal.filter(comparer(arr));
                    const result = arr.concat(onlyInB);

                    let cartItems = cart.length !== 0 ? result : [];

                    localStorage.setItem("cart", JSON.stringify(cartItems));
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("token", token);
                    dispatch({
                        type: SIGNIN_SUCCESS,
                        payload: { message, user, token },
                    });
                    dispatch({ type: ADD_CART_BY_SIGNIN, payload: cartItems });
                    history.push("/tai-khoan");
                }
                if (Object.is(success, false)) {
                    dispatch({ type: SIGNIN_ERROR, payload: error });
                }
            })
            .catch((err) => {
                dispatch({ type: SIGNIN_ERROR, payload: err });
            });
    };
};

const isUserSigninAction = () => {
    return (dispatch) => {
        const token = localStorage.getItem("token");
        if (token) {
            const user = JSON.parse(localStorage.getItem("user"));
            dispatch({ type: SIGNIN_SUCCESS, payload: { user, token } });
        }
    };
};

const logoutAction = (cart) => {
    const cartItem = [];
    return (dispatch) => {
        fetch("/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
                cart,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const { message, success } = result;
                if (Object.is(success, true)) {
                    localStorage.clear();
                    localStorage.setItem("cart", JSON.stringify(cartItem));
                    dispatch({ type: CLEAR_CART, payload: cartItem });
                    dispatch({ type: USER_LOGOUT });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

const updateInfoCusAction = (phone, newAddress) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_INFO_CUSTOMMER_REQUEST });
        fetch("/api/update-info-customer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
                phone,
                address: newAddress,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const { message, user, success } = result;
                if (Object.is(success, true)) {
                    localStorage.setItem("user", JSON.stringify(user));
                    dispatch({
                        type: UPDATE_INFO_CUSTOMMER_SUCCESS,
                        payload: { message, user },
                    });
                }
            })
            .catch((err) => {
                dispatch({ type: UPDATE_INFO_CUSTOMMER_ERROR, payload: err });
            });
    };
};

const updateAvatarAction = (img) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_AVATAR_REQUEST });
        fetch("/api/user/update-avatar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
                img,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                dispatch({ type: UPDATE_AVATAR_SUCCESS, payload: result });
                localStorage.setItem("user", JSON.stringify(result));
            })
            .catch((err) => {
                dispatch({ type: UPDATE_AVATAR_ERROR, payload: err });
            });
    };
};

const getOrderByCustomerAction = () => {
    return (dispatch) => {
        dispatch({ type: GET_ORDER_BY_CUSOMER_REQUEST });
        fetch("/api/user/get-order-by-cusomer", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                dispatch({ type: GET_ORDER_BY_CUSOMER_SUCCESS, payload: result });
            })
            .catch((err) => {
                dispatch({ type: GET_ORDER_BY_CUSOMER_ERROR, payload: err });
            });
    };
};

const signinGoogleAction = (data, history) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_GOOGLE_REQUEST });
        fetch("/api/signin-google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tokenId: data,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const { user, token, message, error, success } = result;
                if (Object.is(success, false)) {
                    dispatch({ type: LOGIN_GOOGLE_ERROR, payload: error });
                }
                if (Object.is(success, true)) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    dispatch({
                        type: LOGIN_GOOGLE_SUCCESS,
                        payload: { message, user, token },
                    });
                    history.push("/tai-khoan");
                }
            })
            .catch((err) => {
                dispatch({ type: LOGIN_GOOGLE_ERROR, payload: err });
            });
    };
};

const signinFacebookAction = (accessToken, userID, history) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_FACEBOOK_REQUEST });
        fetch("/api/signin-facebook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken,
                userID,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const { user, token, message, error, success } = result;
                if (Object.is(success, false)) {
                    dispatch({ type: LOGIN_FACEBOOK_ERROR, payload: error });
                }
                if (Object.is(success, true)) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    history.push("/tai-khoan");
                    dispatch({
                        type: LOGIN_FACEBOOK_SUCCESS,
                        payload: { message, user, token },
                    });
                }
            })
            .catch((err) => {
                dispatch({ type: LOGIN_FACEBOOK_ERROR, payload: err });
            });
    };
};

export {
    signupAction,
    signinAction,
    isUserSigninAction,
    logoutAction,
    updateInfoCusAction,
    updateAvatarAction,
    getOrderByCustomerAction,
    signinGoogleAction,
    signinFacebookAction,
};
