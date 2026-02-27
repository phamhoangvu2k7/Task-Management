import { Router } from "express";
import * as controller from "../controller/user_controller";
import * as middlewares from "../middlewares/auth_middleware";

const router: Router = Router();

router.post("/register", controller.register);

router.post("/login", controller.login);

// router.post("/password/forgot", controller.forgotPassword);

// router.post("/password/otp", controller.otpPassword);

// router.post("/password/reset", controller.resetPassword);

router.get("/detail", middlewares.requireAuth, controller.detail);

router.get("/list", middlewares.requireAuth, controller.list);

export const userRoutes: Router = router;