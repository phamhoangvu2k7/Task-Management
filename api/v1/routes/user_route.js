const express = require("express");
const router = express.Router();
const controller = require("../controller/user_controller");
const middleware = require("../middlewares/auth_middleware");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

router.get("/detail", middleware.requireAuth, controller.detail);

router.get("/list", middleware.requireAuth, controller.list);

module.exports = router;