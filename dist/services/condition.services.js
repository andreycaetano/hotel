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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionServices = void 0;
const tsyringe_1 = require("tsyringe");
const database_1 = require("../database");
const appError_erros_1 = require("../errors/appError.erros");
let ConditionServices = class ConditionServices {
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield database_1.prisma.conditions.findFirst({ where: { id: id } });
            if (!find) {
                throw new appError_erros_1.AppError(404, "Condition not found.");
            }
        });
    }
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const condition = req.body.condition;
            const find = yield database_1.prisma.conditions.findFirst({
                where: {
                    condition: condition.toLowerCase()
                }
            });
            if (find) {
                throw new appError_erros_1.AppError(409, "Condition already exists");
            }
            const create = yield database_1.prisma.conditions.create({
                data: {
                    condition: condition
                }
            });
            return create;
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            yield this.find(id);
            const updated = yield database_1.prisma.conditions.update({
                where: { id: id },
                data: {
                    condition: req.body.condition
                }
            });
            return updated;
        });
    }
    delete(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            yield this.find(id);
            yield database_1.prisma.conditions.delete({ where: { id: id } });
        });
    }
    get(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const get = yield database_1.prisma.conditions.findMany();
            return get;
        });
    }
};
exports.ConditionServices = ConditionServices;
exports.ConditionServices = ConditionServices = __decorate([
    (0, tsyringe_1.injectable)()
], ConditionServices);
