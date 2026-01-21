const express = require("express");
const bodyParser = require("body-parser");
const database = require("./config/database");

require("dotenv").config();

database.connect();

const route = require("./api/v1/routes/index_route");
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});