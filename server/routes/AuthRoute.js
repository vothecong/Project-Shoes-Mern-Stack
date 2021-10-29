const router = require("express").Router();
const { auth } = require("../controllers/index");
const passport = require("passport");
const passportConfig = require("../middlewares/Passport");
const fetch = require('node-fetch');

router.post('/check-email-exist', async (req, res, next) => {
    const KEY_CONFIRM_EMAIL = '0v9StzSEJL0XfcGu76M7ATKZoAH523TPakrSoVKqJnMMgoi4z3';
    const result = await fetch(`https://app.verify-email.org/api/v1/${KEY_CONFIRM_EMAIL}/verify/${req.body.email}`).then(res => res.json());
    const { status, smtp_code, status_description, email } = result;
    console.log("result", result);
    // return res.json(result);
});
const {
    validateRegister,
    validateSignin,
} = require("../middlewares/Validation");


router.route("/admin/register").post(validateRegister(), auth.signupAdmin);

router
    .route("/admin/signin")
    .post(
        validateSignin(),
        passport.authenticate("local", { session: false }),
        auth.signinAdmin
    );

router.route('/admin/get-account')
    .get(
        passport.authenticate("jwt", { session: false }),
        auth.getAccountAdmin
    )

router
    .route("/admin/update-info-admin")
    .post(
        passport.authenticate("jwt", { session: false }),
        auth.updateAccountAdmin
    );

router.route("/user/register").post(validateRegister(), auth.signupUser);

router
    .route("/update-info-customer")
    .post(
        passport.authenticate("jwt", { session: false }),
        auth.updateInfoCustomer
    );

router
    .route("/user/update-avatar")
    .post(
        passport.authenticate("jwt", { session: false }),
        auth.updateAvatar
    );

router.route("/user/get-order-by-cusomer")
    .get(
        passport.authenticate("jwt", { session: false }),
        auth.getOrderByCustomer
    )

router
    .route("/user/signin")
    .post(
        validateSignin(),
        passport.authenticate("local", { session: false }),
        auth.signinUser
    );

router.route('/admin/home').get(auth.homeAccount);

router.route('/signin-google').post(auth.siginGoogle);

router.route('/signin-facebook').post(auth.siginFacebook);

module.exports = router;