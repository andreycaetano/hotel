"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleErrors = void 0;
const appError_erros_1 = require("./appError.erros");
const zod_1 = require("zod");
const jsonwebtoken_1 = require("jsonwebtoken");
class HandleErrors {
    static execute(err, req, res, next) {
        if (err instanceof appError_erros_1.AppError) {
            return res.status(err.statusCode).json({ error: err.message });
        }
        else if (err instanceof zod_1.ZodError) {
            const errorMessage = err.errors.map(error => error.message).join(', ');
            return res.status(409).json({ error: errorMessage });
        }
        else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).json({ error: err.message });
        }
        else {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
}
exports.HandleErrors = HandleErrors;
