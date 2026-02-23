import express, { Express, Request, Response } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import Task from "./api/v1/model/task_model";

dotenv.config();
database.connect();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.get("/task", async (req: Request, res: Response) => {
    const tasks = await Task.find({
        deleted: false
    });

    res.json(tasks);
});

app.get("/task/detail/:id", async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const task = await Task.findOne({
        _id: id,    
        deleted: false,
    });

    res.json(task);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});