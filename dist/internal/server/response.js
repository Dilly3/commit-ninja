"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonResponse = void 0;
const jsonResponse = (res, code, data) => {
    res.status(code).json(data);
};
exports.jsonResponse = jsonResponse;
