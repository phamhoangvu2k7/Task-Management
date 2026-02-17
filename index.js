const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const database = require("./config/database");
const cookieParser = require("cookie-parser");

// 1. Import thư viện Swagger (Thêm ở đầu file)
const swaggerUi = require('swagger-ui-express'); 
const YAML = require('yamljs');                  

require("dotenv").config();

database.connect();

const route = require("./api/v1/routes/index_route");
const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

// 2. Load file YAML và Cấu hình đường dẫn xem tài liệu (Thêm trước dòng route(app))
const swaggerDocument = YAML.load('./swagger.yaml');           
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 

route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`); // <--- (Tùy chọn) Thêm dòng này để dễ click
});