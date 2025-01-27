"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductById = exports.getProductById = exports.addProductImage = exports.deleteProductById = exports.createProduct = exports.getAllProductsByCompanyId = exports.getProductByCompanyId = exports.getAllProducts = void 0;
const connection_1 = __importDefault(require("../utils/connection"));
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const cloudinary_1 = require("cloudinary");
// Define the fields to return for products
const productFields = {
    id: schema_1.products.id,
    name: schema_1.products.name,
    description: schema_1.products.description,
    category_id: schema_1.products.category_id,
    base_price: schema_1.products.base_price,
    created_at: schema_1.products.created_at,
    updated_at: schema_1.products.updated_at,
};
// Define the fields to return for product images
const productImageFields = {
    id: schema_1.productImages.id,
    product_id: schema_1.productImages.product_id,
    image_type: schema_1.productImages.image_type,
    image_url: schema_1.productImages.image_url,
    created_at: schema_1.productImages.created_at,
    updated_at: schema_1.productImages.updated_at,
};
// Define the fields to return for configuration options
const configOptionFields = {
    id: schema_1.configurationOptions.id,
    product_id: schema_1.configurationOptions.product_id,
    option_name: schema_1.configurationOptions.option_name,
    created_at: schema_1.configurationOptions.created_at,
    updated_at: schema_1.configurationOptions.updated_at,
};
// Define the fields to return for configuration values
const configValueFields = {
    id: schema_1.configurationValues.id,
    option_id: schema_1.configurationValues.option_id,
    value_name: schema_1.configurationValues.value_name,
    price_adjustment: schema_1.configurationValues.price_adjustment,
    created_at: schema_1.configurationValues.created_at,
    updated_at: schema_1.configurationValues.updated_at,
};
// Fetch all products with related images and configuration options
const getAllProducts = async (_req, res) => {
    try {
        const productsList = await (0, db_1.retrieveproducts)();
        res.status(200).json(productsList);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting products', error: error.message });
    }
};
exports.getAllProducts = getAllProducts;
// Fetch a product by ID with related images and configuration options
// export const getProductById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const product = await db.select({
//             ...productFields,
//             images: db.select(productImageFields)
//                 .from(productImages)
//                 .where(eq(productImages.product_id, Number(id))) as any, // Cast to any to resolve type issues
//             configOptions: db.select({
//                 ...configOptionFields,
//                 values: db.select(configValueFields)
//                     .from(configurationValues)
//                     .where(eq(configurationValues.option_id, configurationOptions.id)) as any, // Cast to any to resolve type issues
//             }).from(configurationOptions)
//                 .where(eq(configurationOptions.product_id, Number(id))) as any // Cast to any to resolve type issues
//         }).from(products).where(eq(products.id, Number(id)));
//         if (!product.length) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         res.status(200).json(product[0]);
//     } catch (error) {
//         res.status(500).json({ message: 'Error getting product', error: error.message });
//     }
// };
// Fetch a product by company ID with related images and configuration options
const getProductByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.params;
        const product = await connection_1.default.select({
            ...productFields,
            images: connection_1.default.select(productImageFields)
                .from(schema_1.productImages)
                .where((0, drizzle_orm_1.eq)(schema_1.productImages.product_id, schema_1.products.id)), // Cast to any to resolve type issues
            configOptions: connection_1.default.select({
                ...configOptionFields,
                values: connection_1.default.select(configValueFields)
                    .from(schema_1.configurationValues)
                    .where((0, drizzle_orm_1.eq)(schema_1.configurationValues.option_id, schema_1.configurationOptions.id)), // Cast to any to resolve type issues
            }).from(schema_1.configurationOptions)
                .where((0, drizzle_orm_1.eq)(schema_1.configurationOptions.product_id, schema_1.products.id)) // Cast to any to resolve type issues
        }).from(schema_1.products)
            .innerJoin(schema_1.companyProducts, (0, drizzle_orm_1.eq)(schema_1.products.id, schema_1.companyProducts.product_id))
            .where((0, drizzle_orm_1.eq)(schema_1.companyProducts.company_id, Number(companyId)))
            .limit(1);
        if (!product.length) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting product', error: error.message });
    }
};
exports.getProductByCompanyId = getProductByCompanyId;
// Fetch all products by company ID with related images and configuration options
const getAllProductsByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.params;
        const productsList = await connection_1.default.select({
            ...productFields,
            images: connection_1.default.select(productImageFields)
                .from(schema_1.productImages)
                .where((0, drizzle_orm_1.eq)(schema_1.productImages.product_id, schema_1.products.id)), // Cast to any to resolve type issues
            configOptions: connection_1.default.select({
                ...configOptionFields,
                values: connection_1.default.select(configValueFields)
                    .from(schema_1.configurationValues)
                    .where((0, drizzle_orm_1.eq)(schema_1.configurationValues.option_id, schema_1.configurationOptions.id)), // Cast to any to resolve type issues
            }).from(schema_1.configurationOptions)
                .where((0, drizzle_orm_1.eq)(schema_1.configurationOptions.product_id, schema_1.products.id)) // Cast to any to resolve type issues
        }).from(schema_1.products)
            .innerJoin(schema_1.companyProducts, (0, drizzle_orm_1.eq)(schema_1.products.id, schema_1.companyProducts.product_id))
            .where((0, drizzle_orm_1.eq)(schema_1.companyProducts.company_id, Number(companyId)));
        res.status(200).json(productsList);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting products', error: error.message });
    }
};
exports.getAllProductsByCompanyId = getAllProductsByCompanyId;
// Create a new product
// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, description, category_id, base_price, options } = req.body;
        if (!name || !description || !category_id || !base_price || !options) {
            return res.status(400).json({ message: 'Missing required product information' });
        }
        // Parse options if it's a JSON string
        let parsedOptions;
        try {
            parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
        }
        catch (e) {
            return res.status(400).json({ message: 'Invalid format for options' });
        }
        // Insert the product into the database
        const newProduct = await connection_1.default.insert(schema_1.products).values({ name, description, category_id, base_price }).returning(productFields);
        const productId = newProduct[0].id;
        // Process images if they exist
        if (req.files) {
            const files = req.files;
            const uploadPromises = files.map(file => cloudinary_1.v2.uploader.upload(file.path));
            const uploadResults = await Promise.all(uploadPromises);
            const imageEntries = uploadResults.map(result => ({
                product_id: productId,
                image_type: '2D',
                image_url: result.secure_url
            }));
            await connection_1.default.insert(schema_1.productImages).values(imageEntries).returning(productImageFields);
        }
        if (parsedOptions.length > 0) {
            await Promise.all(parsedOptions.map(async (option) => {
                const config = await connection_1.default.select().from(schema_1.configurationOptions).where((0, drizzle_orm_1.eq)(schema_1.configurationOptions.option_name, option.option_name));
                if (!config[0]?.id) {
                    const newConfig = await (0, db_1.createconfigoption)({
                        product_id: newProduct[0]?.id,
                        option_name: option.option_name
                    });
                    await Promise.all(option.config_values.map(async (value) => {
                        const valueConfig = await connection_1.default.select().from(schema_1.configurationValues).where((0, drizzle_orm_1.eq)(schema_1.configurationValues.value_name, value.value_name));
                        if (!valueConfig[0]?.id) {
                            await (0, db_1.createConfigValue)({
                                option_id: newConfig[0]?.id,
                                value_name: value.value_name,
                                price_adjustment: value.price_adjustment
                            });
                        }
                    }));
                }
                else {
                    await Promise.all(option.config_values.map(async (value) => {
                        const valueConfig = await connection_1.default.select().from(schema_1.configurationValues).where((0, drizzle_orm_1.eq)(schema_1.configurationValues.value_name, value.value_name));
                        if (!valueConfig[0]?.id) {
                            await (0, db_1.createConfigValue)({
                                option_id: config[0]?.id,
                                value_name: value.value_name,
                                price_adjustment: value.price_adjustment
                            });
                        }
                    }));
                }
            }));
        }
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};
exports.createProduct = createProduct;
// Update a product by ID
// export const updateProductById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const updatedProduct = await db.update(products).set(req.body).where(eq(products.id, Number(id))).returning(productFields);
//         if (!updatedProduct.length) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         res.status(200).json(updatedProduct[0]);
//     } catch (error) {
//         res.status  (500).json({ message: 'Error updating product', error: error.message });
//     }
// };
// Delete a product by ID
const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await connection_1.default.delete(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, Number(id))).returning(productFields);
        if (!deletedProduct.length) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted', deletedProduct: deletedProduct[0] });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
exports.deleteProductById = deleteProductById;
// Add an image to a product
const addProductImage = async (req, res) => {
    try {
        const { product_id, image_type, image_url } = req.body;
        const newImage = await connection_1.default.insert(schema_1.productImages).values({ product_id, image_type, image_url }).returning(productImageFields);
        res.status(201).json(newImage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding image', error: error.message });
    }
};
exports.addProductImage = addProductImage;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await (0, db_1.retrieveProductById)(Number(id));
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting product', error: error.message });
    }
};
exports.getProductById = getProductById;
const updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await (0, db_1.updateProduct)(Number(id), req.body);
        if (!updatedProduct.length) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};
exports.updateProductById = updateProductById;
//# sourceMappingURL=product.js.map