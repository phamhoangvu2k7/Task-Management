const express = require("express");
const router = express.Router();
const controller = require("../controller/task_controller");

router.get("/api/v1/tasks", controller.index);

router.get("/api/v1/tasks/detail/:id", controller.detail);

module.exports = router;