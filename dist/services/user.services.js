"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.UserServices = void 0;
const tsyringe_1 = require("tsyringe");
const database_1 = require("../database");
const bcrypt_1 = __importStar(require("bcrypt"));
const appError_erros_1 = require("../errors/appError.erros");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let UserServices = class UserServices {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield database_1.prisma.user.findFirst({
                where: {
                    username: data.username,
                },
            });
            if (findUser) {
                throw new appError_erros_1.AppError(404, 'Already registered user.');
            }
            const findUserByEmail = yield database_1.prisma.user.findFirst({
                where: {
                    email: data.email
                }
            });
            if (findUserByEmail) {
                throw new appError_erros_1.AppError(404, 'Email registered user.');
            }
            data.password = yield (0, bcrypt_1.hash)(data.password, 7);
            const create = database_1.prisma.user.create({
                data: Object.assign({}, data),
            });
            return create;
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield database_1.prisma.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (!findUser) {
                throw new appError_erros_1.AppError(401, 'Access denied due to lack of valid authentication credentials for the target resource. Please make sure to include the proper authentication.');
            }
            const match = yield bcrypt_1.default.compare(data.password, findUser.password);
            if (!match) {
                throw new appError_erros_1.AppError(401, 'Access denied due to lack of valid authentication credentials for the target resource. Please make sure to include the proper authentication.');
            }
            const token = jsonwebtoken_1.default.sign({ id: findUser.id, role: findUser.role }, process.env.SECRET_KEY_TOKEN, {
                expiresIn: '1h',
            });
            const user = {
                user: findUser.username,
                token: token,
                role: findUser.role,
            };
            return user;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.prisma.user.findFirst({ where: { id: id } });
            if (!user) {
                throw new appError_erros_1.AppError(404, 'User not found.');
            }
            yield database_1.prisma.user.delete({
                where: {
                    id: id,
                },
            });
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield database_1.prisma.user.findMany();
            return users;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield database_1.prisma.user.findFirst({ where: { id: id } });
            if (!findUser)
                throw new appError_erros_1.AppError(404, 'User not found');
            data.password = yield (0, bcrypt_1.hash)(data.password, 7);
            const updated = yield database_1.prisma.user.update({
                where: {
                    id: id,
                },
                data: Object.assign({}, data),
            });
            return updated;
        });
    }
    validateToken(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                valid: true,
                role: res.locals.decode.role
            };
            return response;
        });
    }
    validateTokenAndRespond(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verify = yield this.validateToken(res);
                res.status(200).json(verify);
            }
            catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
};
exports.UserServices = UserServices;
exports.UserServices = UserServices = __decorate([
    (0, tsyringe_1.injectable)()
], UserServices);
