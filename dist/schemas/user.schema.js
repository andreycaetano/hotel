"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.userUpdateSchema = exports.userRegisterSchema = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z.string().refine(password => {
    if (password.length < 8)
        return false;
    if (!/[A-Z]/.test(password))
        return false;
    if (!/[a-z]/.test(password))
        return false;
    if (!/\d/.test(password))
        return false;
    if (!/[^A-Za-z0-9]/.test(password))
        return false;
    return true;
}, {
    message: 'The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
});
exports.userRegisterSchema = zod_1.z.object({
    username: zod_1.z.string().min(6).max(255),
    password: passwordSchema,
    email: zod_1.z.string().email()
});
exports.userUpdateSchema = zod_1.z.object({
    username: zod_1.z.string().min(6).max(255),
    password: passwordSchema,
    email: zod_1.z.string().email(),
    role: zod_1.z.string()
});
exports.loginSchema = exports.userRegisterSchema.omit({
    username: true
});
