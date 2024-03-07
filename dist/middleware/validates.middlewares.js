"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validates = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_erros_1 = require("../errors/appError.erros");
const tsyringe_1 = require("tsyringe");
let Validates = class Validates {
    validateBody(schemas) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (schemas.params) {
                req.params = yield schemas.params.parseAsync(req.params);
            }
            if (schemas.body) {
                req.body = yield schemas.body.parseAsync(req.body);
            }
            if (schemas.query) {
                req.query = yield schemas.query.parseAsync(req.query);
            }
            next();
        });
    }
    validateToken(req, res, next) {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            throw new appError_erros_1.AppError(401, "Token is required");
        }
        const secret = process.env.SECRET_KEY_TOKEN;
        jsonwebtoken_1.default.verify(token, secret, (err, decode) => {
            if (err) {
                throw new appError_erros_1.AppError(401, "Token Expired");
            }
            res.locals.decode = jsonwebtoken_1.default.decode(token);
            next();
        });
    }
    validateAdminRole(req, res, next) {
        const token = res.locals.decode;
        if (token.role != "admin") {
            throw new appError_erros_1.AppError(401, "You do not have sufficient privileges to perform this action.");
        }
        next();
    }
};
exports.Validates = Validates;
exports.Validates = Validates = __decorate([
    (0, tsyringe_1.injectable)()
], Validates);
