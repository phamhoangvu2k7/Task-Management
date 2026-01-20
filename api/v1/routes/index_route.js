const taskRoutes = require("./task_route");

module.exports = (app) => {
    app.use("/", taskRoutes);
}