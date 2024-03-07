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
exports.TeamServices = void 0;
const tsyringe_1 = require("tsyringe");
const appError_erros_1 = require("../errors/appError.erros");
const database_1 = require("../database");
const fs_1 = __importDefault(require("fs"));
let TeamServices = class TeamServices {
    create(data, photo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!photo)
                throw new appError_erros_1.AppError(400, "Photo is require");
            const create = yield database_1.prisma.team.create({
                data: {
                    name: data.name,
                    role: data.role,
                    photo: photo.team[0].path
                }
            });
            return create;
        });
    }
    update(data, id, photo) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield database_1.prisma.team.findFirst({ where: { id: id } });
            if (!find)
                throw new appError_erros_1.AppError(404, "Team Member not found");
            if (photo)
                fs_1.default.unlinkSync(find.photo);
            const updated = yield database_1.prisma.team.update({
                where: { id: id },
                data: {
                    name: data.name,
                    role: data.role,
                    photo: photo ? photo.team[0].path : find.photo
                }
            });
            return updated;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield database_1.prisma.team.findFirst({ where: { id: id } });
            if (!find)
                throw new appError_erros_1.AppError(404, "Team Member not found");
            fs_1.default.unlinkSync(find.photo);
            yield database_1.prisma.team.delete({ where: { id: id } });
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const get = yield database_1.prisma.team.findMany();
            return get;
        });
    }
};
exports.TeamServices = TeamServices;
exports.TeamServices = TeamServices = __decorate([
    (0, tsyringe_1.injectable)()
], TeamServices);
