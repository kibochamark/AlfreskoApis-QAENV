import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dsp3koxbb',
    api_key: '712128876688431',
    api_secret: 'uBHazNFklotm0DLSNbS_0AdgAJ4'
});

// Create a storage engine to save the files in Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'uploads',
            public_id: `${Date.now()}-${file.originalname}`,
            format: 'jpg', // or any other format you want to use
        };
    },
});

export const upload = multer({ storage: storage });
