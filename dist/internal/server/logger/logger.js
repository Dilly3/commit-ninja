"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = loggerMiddleware;
const chalk_1 = __importDefault(require("chalk"));
chalk_1.default.level = 2;
function colorizeMethod(method) {
    switch (method.toUpperCase()) {
        case "GET":
            return chalk_1.default.green(method);
        case "POST":
            return chalk_1.default.yellow(method);
        case "PUT":
            return chalk_1.default.blue(method);
        case "DELETE":
            return chalk_1.default.red(method);
        default:
            return chalk_1.default.white(method);
    }
}
function loggerMiddleware(req, _, next) {
    const method = colorizeMethod(req.method);
    const time = new Date(Date.now()).toString();
    console.log(`Method:${method}, Host:${chalk_1.default.yellow(req.hostname)}, 
    Path: ${chalk_1.default.blue(req.path)}, 
    Time: ${chalk_1.default.bgCyan(time)}`);
    next();
}
