"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const express_validator_1 = require("express-validator");
exports.validateEmail = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
//# sourceMappingURL=emailValidator.js.map