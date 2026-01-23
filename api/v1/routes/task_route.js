const express = require("express");
const router = express.Router();
const controller = require("../controller/task_controller");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change_status/:id", controller.changeStatus);

router.patch("/change_multi", controller.changeMulti);

router.post("/create", controller.create);

router.patch("/edit/:id", controller.edit);

router.delete("/delete/:id", controller.delete);

module.exports = router;