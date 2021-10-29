/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from "react";
import "./Signin.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import isEmail from "validator/lib/isEmail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import {
    signinAction,
    signinFacebookAction,
    signinGoogleAction,
} from "../../Actions/authAction";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { useHistory } from "react-router-dom";
window.$ = $;

const REGEX_PASS = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const Signin = (props) => {
    const history = useHistory();
    const [email, setEmail] = useState("luutrudulieuhoc1505@gmail.com");
    const [password, setPassword] = useState("123456AbS!");
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart.items);

    const { errorFB, errorGG, errorLocal } = auth;
    // eslint-disable-next-line no-unused-vars

    const handleError = () => {
        let flag = true;

        if (email.length === 0 || !isEmail(email)) {
            $("#error_email").show();
            $("#error_email").text(
                "Email không được để trống hoặc không chính xác!!!"
            );
            flag = false;
        } else {
            $("#error_email").hide();
        }

        if (password.length === 0 || !REGEX_PASS.test(password)) {
            $("#error_password").show();
            $("#error_password").text(
                "Mật khẩu tối thiểu 6 ký tự và có ký tự đặt biệt hoặc hoa thường!!!"
            );
            flag = false;
        } else {
            $("#error_password").hide();
        }
        return flag;
    };
    console.log("cart in Signin", cart);
    const handleSignIn = () => {
        if (handleError()) {
            dispatch(signinAction(email, password, cart, props.history));
        }
    };

    useEffect(() => {
        if (!Object.is(errorFB, undefined)) {
            toast.error(errorFB, {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!Object.is(errorGG, undefined)) {
            toast.error(errorGG, {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!Object.is(errorLocal, undefined)) {
            toast.error(errorLocal, {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
    }, [errorFB, errorGG, errorLocal]);

    const handleLoginGoogleSuccess = (e) => {
        dispatch(signinGoogleAction(e.tokenId, history));
    };

    const handleResponseFacebook = (res) => {
        dispatch(signinFacebookAction(res.accessToken, res.userID, history));
    };

    return (
        <div className="_loginRegister">
            <ToastContainer />
            <h1>Đăng nhập</h1>
            <div className="form-control">
                <label htmlFor="email" >Email:</label>
                <input
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="Enter your email"
                />
                <p id="error_email" />
            </div>
            <div className="form-control">
                <label htmlFor="password">Mật khẩu:</label>
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                />
                <p id="error_password" />
            </div>

            <div className="form-control">
                <button
                    onClick={() => handleSignIn()}
                    type="submit"
                    style={{
                        fontSize: "20px",
                        textTransform: "capitalize",
                    }}
                >
                    đăng nhập{""}
                </button>
            </div>
            <div className="_navBtn">
                <Button>
                    <Link
                        to="/dang-ky"
                        style={{
                            color: "white",
                            hover: "#008B8B",
                            textDecoration: "none",
                            fontSize: "20px",
                            textTransform: "capitalize",
                        }}
                    >
                        đăng ký{""}
                    </Link>
                </Button>
            </div>
            <div className="_navBtn" style={{ marginTop: "5px" }}>
                <GoogleLogin
                    clientId="1046614447632-i3hsc5liq1scjj818s6kfdj74hihu4oj.apps.googleusercontent.com"
                    buttonText="Đăng nhập Google"
                    render={(renderProps) => (
                        <button
                            onClick={renderProps.onClick}
                            style={{
                                backgroundColor: "#d73d32", fontSize: "20px",
                                textTransform: "capitalize",
                            }}
                        >
                            Đăng nhập google
                        </button>
                    )}
                    onSuccess={(e) => handleLoginGoogleSuccess(e)}
                    cookiePolicy={"single_host_origin"}
                    className="login-google"
                />
            </div>
            <div className="_navBtn" style={{ marginTop: "5px" }}>
                <FacebookLogin
                    appId="2868148466752374"
                    autoLoad={false}
                    callback={(e) => handleResponseFacebook(e)}
                    cssClass="css_facebook"
                />
            </div>
        </div>
    );
};

export default Signin;