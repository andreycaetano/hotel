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
exports.GaleryServices = void 0;
const tsyringe_1 = require("tsyringe");
const database_1 = require("../database");
const appError_erros_1 = require("../errors/appError.erros");
const fs_1 = __importDefault(require("fs"));
let GaleryServices = class GaleryServices {
    create(images) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!images)
                throw new appError_erros_1.AppError(404, "Images is require");
            const create = yield database_1.prisma.galery.create({
                data: {
                    path: images.galery[0].path
                }
            });
            console.log(create);
            return create;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield database_1.prisma.galery.findFirst({ where: { id: id } });
            if (!find)
                throw new appError_erros_1.AppError(404, "Photo not found");
            fs_1.default.unlinkSync(find.path);
            yield database_1.prisma.galery.delete({ where: { id: id } });
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const get = yield database_1.prisma.galery.findMany();
            return get;
        });
    }
};
exports.GaleryServices = GaleryServices;
exports.GaleryServices = GaleryServices = __decorate([
    (0, tsyringe_1.injectable)()
], GaleryServices);
