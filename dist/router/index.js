"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controllers/auth");
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../middleware"));
const emailValidator_1 = require("../middleware/emailValidator");
const blacklist_1 = __importDefault(require("../middleware/blacklist"));
const profile_1 = require("../controllers/profile");
const roles_1 = require("../controllers/roles");
const permissions_1 = require("../controllers/permissions");
const passwordreset_1 = require("../controllers/passwordreset");
const passport_1 = __importDefault(require("passport"));
const category_1 = require("../controllers/category");
const configoptions_1 = require("../controllers/configoptions");
const optionvalues_1 = require("../controllers/optionvalues");
const product_1 = require("../controllers/product");
const upload_1 = require("../utils/upload");
const routes = express_1.default.Router();
// // auth user
// routes.get("/getusers", authenticateJWT, getusers)
routes.post("/registeruser", emailValidator_1.validateEmail, auth_1.registerUser);
routes.post("/registercompany", emailValidator_1.validateEmail, auth_1.registerCompany);
routes.post("/loginuser", emailValidator_1.validateEmail, auth_1.loginUser);
routes.post("/refreshtoken", auth_1.refreshToken);
routes.get("/testlogout", blacklist_1.default, middleware_1.default, auth_1.testlogout);
routes.post("/logout", middleware_1.default, auth_1.logoutUser);
// google logins
routes.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
routes.get('/auth/google/callback', auth_1.googlecallback);
// // Reset password
routes.post("/forgot-password", emailValidator_1.validateEmail, passwordreset_1.forgotPassword);
routes.post("/reset-password", passwordreset_1.resetPassword);
// profile
routes.post("/createprofile", blacklist_1.default, middleware_1.default, profile_1.createProfileHandler);
// routes.post("/createprofile", checkTokenBlacklist, authMiddleware, checkActiveSubscriptionMiddleware, createProfileHandler)
routes.put("/updateProfile", blacklist_1.default, middleware_1.default, profile_1.updateProfileHandler);
routes.get("/getUsersWithProfiles", blacklist_1.default, middleware_1.default, profile_1.getUsersWithProfilesHandler);
routes.get("/getUserWithProfile/:id", blacklist_1.default, middleware_1.default, profile_1.getUserWithProfileHandler);
routes.delete("/deleteUser/:id", blacklist_1.default, middleware_1.default, profile_1.deleteUserHandler);
routes.delete("/deleteProfile", blacklist_1.default, middleware_1.default, profile_1.deleteProfileHandler);
// role
routes.get("/getrole", blacklist_1.default, middleware_1.default, roles_1.getRole);
routes.get("/getroles", blacklist_1.default, middleware_1.default, roles_1.getRoles);
routes.delete("/deleterole", blacklist_1.default, middleware_1.default, roles_1.deleteRole);
routes.patch("/updaterole", blacklist_1.default, middleware_1.default, roles_1.updateRole);
routes.post("/createrole", blacklist_1.default, middleware_1.default, roles_1.createRole);
// permission
routes.get("/getpermission", blacklist_1.default, middleware_1.default, permissions_1.getPermission);
routes.post("/roles/:roleId/permissions", blacklist_1.default, middleware_1.default, permissions_1.assignpermissiontorole);
// routes.get("/getpermissions", checkTokenBlacklist, authMiddleware, getPer)
routes.delete("/deletepermission", blacklist_1.default, middleware_1.default, permissions_1.deletePermission);
routes.patch("/updatepermission", blacklist_1.default, middleware_1.default, permissions_1.updatePermission);
routes.post("/createpermission", blacklist_1.default, middleware_1.default, permissions_1.createPermission);
// // category
routes.get("/getcategories", blacklist_1.default, middleware_1.default, category_1.retrievecategories);
routes.get("/getcategory", blacklist_1.default, middleware_1.default, category_1.retrievecategory);
routes.post("/createcategory", blacklist_1.default, middleware_1.default, category_1.newcategory);
routes.delete("/deletecategory", blacklist_1.default, middleware_1.default, category_1.removecategory);
routes.patch("/updatecategory", blacklist_1.default, middleware_1.default, category_1.updatecategory);
// config options
routes.get("/getconfigoptions", blacklist_1.default, middleware_1.default, configoptions_1.retrieveconfigoptions);
routes.get("/getconfigoptionbyproduct", blacklist_1.default, middleware_1.default, configoptions_1.retrieveoption);
routes.post("/createconfigoption", blacklist_1.default, middleware_1.default, configoptions_1.newconfigoption);
routes.delete("/deleteconfigoption", blacklist_1.default, middleware_1.default, configoptions_1.removeoption);
routes.patch("/updateconfigoption", blacklist_1.default, middleware_1.default, configoptions_1.updateoption);
//config option values
routes.get("/getconfigoptionvalues", blacklist_1.default, middleware_1.default, optionvalues_1.getConfigValuesHandler);
routes.get("/getconfigoptionvaluebyid", blacklist_1.default, middleware_1.default, optionvalues_1.getConfigValueByIdHandler);
routes.post("/createconfigoptionvalue", blacklist_1.default, middleware_1.default, optionvalues_1.createConfigValueHandler);
routes.delete("/deleteconfigoptionvalue", blacklist_1.default, middleware_1.default, optionvalues_1.deleteConfigValueHandler);
routes.patch("/updateconfigoptionvalue", blacklist_1.default, middleware_1.default, optionvalues_1.updateConfigValueHandler);
// Route to fetch all products with related images and configuration options
routes.get('/products', blacklist_1.default, middleware_1.default, product_1.getAllProducts);
// Route to fetch a single product by ID with related images and configuration options
routes.get('/products/:id', blacklist_1.default, middleware_1.default, product_1.getProductById);
// Route to fetch a single product by company ID with related images and configuration options
routes.get('/company/:companyId/product', blacklist_1.default, middleware_1.default, product_1.getProductByCompanyId);
// Route to fetch all products by company ID with related images and configuration options
routes.get('/company/:companyId/products', blacklist_1.default, middleware_1.default, product_1.getAllProductsByCompanyId);
// Route to create a new product
// routes.post('/products', checkTokenBlacklist, authMiddleware, createProduct);
routes.post('/product', blacklist_1.default, middleware_1.default, upload_1.upload.array('images', 10), product_1.createProduct);
// Route to update a product by ID
routes.put('/products/:id', blacklist_1.default, middleware_1.default, product_1.updateProductById);
// Route to delete a product by ID
routes.delete('/products/:id', blacklist_1.default, middleware_1.default, product_1.deleteProductById);
// Route to add an image to a product
routes.post('/products/:id/images', blacklist_1.default, middleware_1.default, product_1.addProductImage);
exports.default = routes;
//# sourceMappingURL=index.js.map