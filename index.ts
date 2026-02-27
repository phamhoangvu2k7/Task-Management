import express, { Express } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import mainV1Routes from "./api/v1/routes/index_route";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
database.connect();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.use(cors());

app.use(cookieParser());

app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));

mainV1Routes(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});