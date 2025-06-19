"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 5000;
database_1.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
    app_1.default.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Error during Data Source initialization:', err);
});
