"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./database");
app_1.app.listen(process.env.PORT, () => {
    console.log(`Application started on port ${process.env.PORT} successfully!`);
    (0, database_1.main)();
});
