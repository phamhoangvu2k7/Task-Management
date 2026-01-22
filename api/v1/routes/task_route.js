const express = require("express");
const router = express.Router();
const controller = require("../controller/task_controller");

router.get("/api/v1/tasks", controller.index);

router.get("/api/v1/tasks/detail/:id", controller.detail);

router.patch("/api/v1/tasks/change_status/:id", controller.changeStatus);

router.patch("/api/v1/tasks/change_multi", controller.changeMulti);

router.post("/api/v1/tasks/create", controller.create);

router.patch("/api/v1/tasks/edit/:id", controller.edit);

router.delete("/api/v1/tasks/delete/:id", controller.delete);

module.exports = router;