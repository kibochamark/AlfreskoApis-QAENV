"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: 'dsp3koxbb',
    api_key: '712128876688431',
    api_secret: 'uBHazNFklotm0DLSNbS_0AdgAJ4'
});
// Create a storage engine to save the files in Cloudinary
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        return {
            folder: 'uploads',
            public_id: `${Date.now()}-${file.originalname}`,
            format: 'jpg', // or any other format you want to use
        };
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
//# sourceMappingURL=upload.js.map