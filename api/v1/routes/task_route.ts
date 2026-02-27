import { Router } from "express";
import * as controller from "../controller/task_controller";

const router: Router = Router();

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change_status/:id", controller.changeStatus);

router.delete("/delete/:id", controller.deleteTask);

router.patch("/edit/:id", controller.edit);

router.post("/create", controller.create);

router.patch("/change_multi", controller.changeMulti);

export const taskRoutes: Router = router;