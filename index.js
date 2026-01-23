const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const database = require("./config/database");
const cookieParser = require("cookie-parser");

require("dotenv").config();

database.connect();

const route = require("./api/v1/routes/index_route");
const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});