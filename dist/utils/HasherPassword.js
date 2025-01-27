"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.createHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function createHash(pass) {
    console.log(pass, "pass");
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(pass, salt);
    return { hashedPassword, salt };
}
exports.createHash = createHash;
async function checkPassword(password, dbpass) {
    const isMatch = await bcrypt_1.default.compare(password, dbpass);
    return isMatch;
}
exports.checkPassword = checkPassword;
//# sourceMappingURL=HasherPassword.js.map