"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadIcons = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const appError_erros_1 = require("../errors/appError.erros");
const storageIcons = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/icons');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''));
    }
});
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        if (file) {
            if (file.fieldname === 'hotel') {
                cb(null, 'uploads/hotel');
            }
            else if (file.fieldname === 'authors') {
                cb(null, 'uploads/authors');
            }
            else if (file.fieldname === 'galery') {
                cb(null, 'uploads/galery');
            }
            else if (file.fieldname === 'team') {
                cb(null, 'uploads/team');
            }
            else if (file.fieldname === 'banner') {
                cb(null, 'uploads/bannerNews');
            }
            else {
                throw new appError_erros_1.AppError(409, 'Campo de imagem inválido');
            }
        }
    },
    filename: function (req, file, cb) {
        if (file) {
            cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''));
        }
    }
});
exports.upload = (0, multer_1.default)({ storage: storage });
exports.uploadIcons = (0, multer_1.default)({ storage: storageIcons });
