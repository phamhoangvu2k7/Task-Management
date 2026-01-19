const express = require("express");
const database = require("./config/database");
require("dotenv").config();

database.connect();

const Task = require("./model/task_model");

const app = express();
const port = process.env.PORT;

app.get("/task", async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });

    res.json(tasks);
});

app.get("/task/detail/:id", async (req, res) => {
    const id = req.params.id;

    const task = await Task.findOne({
        _id: id,
        deleted: false
    });

    res.json(task);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});