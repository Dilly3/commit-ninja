"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ApiError = ApiError;
