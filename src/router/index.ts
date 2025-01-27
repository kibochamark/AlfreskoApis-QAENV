import { googlecallback, loginUser, logoutUser, refreshToken, registerCompany, registerUser, testlogout } from '../controllers/auth';
import express from 'express';
import authMiddleware from '../middleware';
import { validateEmail } from '../middleware/emailValidator';
import checkTokenBlacklist from '../middleware/blacklist';
import { createProfileHandler, updateProfileHandler, deleteProfileHandler, getUsersWithProfilesHandler, getUserWithProfileHandler, deleteUserHandler } from '../controllers/profile';
import { createRole, deleteRole, getRole, getRoles, updateRole } from '../controllers/roles';
import { assignpermissiontorole, createPermission, deletePermission, getPermission, updatePermission } from '../controllers/permissions';
import { forgotPassword, resetPassword } from '../controllers/passwordreset';
import passport from 'passport';
import { newcategory, removecategory, retrievecategories, retrievecategory, updatecategory } from '../controllers/category';
import checkActiveSubscriptionMiddleware from '../middleware/checksubscription';
import { newconfigoption, removeoption, retrieveconfigoptions, retrieveoption, updateoption } from '../controllers/configoptions';
import { createConfigValueHandler, deleteConfigValueHandler, getConfigValueByIdHandler, getConfigValuesHandler, updateConfigValueHandler } from '../controllers/optionvalues';
import { addProductImage, createProduct, deleteProductById, getAllProducts, getAllProductsByCompanyId, getProductByCompanyId, getProductById, updateProductById } from '../controllers/product';
import { upload } from '../utils/upload';
import { newquote, removequote, retrievecquotes, retrievequote, updatequote, updatequotestatus } from '../controllers/quote';
import { createConfigSettingsHandler, deleteConfigSettingsHandler, getConfigSettingByIdHandler, getConfigSettingsHandler, updateConfigSettingsHandler } from '../controllers/settings';



const routes = express.Router();


// // auth user

// routes.get("/getusers", authenticateJWT, getusers)
routes.post("/registeruser", validateEmail, registerUser)
routes.post("/registercompany", validateEmail, registerCompany)
routes.post("/loginuser", validateEmail, loginUser)
routes.post("/refreshtoken", refreshToken)
routes.get("/testlogout", checkTokenBlacklist, authMiddleware, testlogout)
routes.post("/logout", authMiddleware, logoutUser)

// google logins
routes.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
routes.get('/auth/google/callback', googlecallback);


// // Reset password

routes.post("/forgot-password", validateEmail, forgotPassword);
routes.post("/reset-password", resetPassword);

// profile
routes.post("/createprofile", checkTokenBlacklist, authMiddleware, createProfileHandler)
// routes.post("/createprofile", checkTokenBlacklist, authMiddleware, checkActiveSubscriptionMiddleware, createProfileHandler)
routes.put("/updateProfile", checkTokenBlacklist, authMiddleware, updateProfileHandler)
routes.get("/getUsersWithProfiles", checkTokenBlacklist, authMiddleware, getUsersWithProfilesHandler)
routes.get("/getUserWithProfile/:id", checkTokenBlacklist, authMiddleware, getUserWithProfileHandler)
routes.delete("/deleteUser/:id", checkTokenBlacklist, authMiddleware, deleteUserHandler);
routes.delete("/deleteProfile", checkTokenBlacklist, authMiddleware, deleteProfileHandler);

// role
routes.get("/getrole", checkTokenBlacklist, authMiddleware, getRole)
routes.get("/getroles", checkTokenBlacklist, authMiddleware, getRoles)
routes.delete("/deleterole", checkTokenBlacklist, authMiddleware, deleteRole)
routes.patch("/updaterole", checkTokenBlacklist, authMiddleware, updateRole)


routes.post("/createrole", checkTokenBlacklist, authMiddleware, createRole);

// permission
routes.get("/getpermission", checkTokenBlacklist, authMiddleware, getPermission)
routes.post("/roles/:roleId/permissions", checkTokenBlacklist, authMiddleware, assignpermissiontorole)
// routes.get("/getpermissions", checkTokenBlacklist, authMiddleware, getPer)
routes.delete("/deletepermission", checkTokenBlacklist, authMiddleware, deletePermission)
routes.patch("/updatepermission", checkTokenBlacklist, authMiddleware, updatePermission)
routes.post("/createpermission", checkTokenBlacklist, authMiddleware, createPermission);


// // category
routes.get("/getcategories", checkTokenBlacklist, authMiddleware, retrievecategories)
routes.get("/getcategory", checkTokenBlacklist, authMiddleware, retrievecategory)
routes.post("/createcategory", checkTokenBlacklist, authMiddleware, newcategory)
routes.delete("/deletecategory", checkTokenBlacklist, authMiddleware, removecategory)
routes.patch("/updatecategory", checkTokenBlacklist, authMiddleware, updatecategory)


// config options
routes.get("/getconfigoptions", checkTokenBlacklist, authMiddleware, retrieveconfigoptions)
routes.get("/getconfigoptionbyproduct", checkTokenBlacklist, authMiddleware, retrieveoption)
routes.post("/createconfigoption", checkTokenBlacklist, authMiddleware, newconfigoption)
routes.delete("/deleteconfigoption", checkTokenBlacklist, authMiddleware, removeoption)
routes.patch("/updateconfigoption", checkTokenBlacklist, authMiddleware, updateoption)

// quote
routes.get("/quotes", retrievecquotes)
routes.get("/:id/quote", retrievequote)
routes.post("/quote", newquote)
routes.delete("/:id/quote", removequote)
routes.put("/quote", updatequote)
routes.put("/quotestatus", updatequotestatus)


//config settings

routes.get("/configsettings",checkTokenBlacklist, authMiddleware, getConfigSettingsHandler)
routes.get("/:id/configsetting",checkTokenBlacklist, authMiddleware, getConfigSettingByIdHandler)
routes.post("/configsettings", checkTokenBlacklist, authMiddleware,createConfigSettingsHandler)
routes.delete("/:id/configsetting",checkTokenBlacklist, authMiddleware, deleteConfigSettingsHandler)
routes.put("/configsetting",checkTokenBlacklist, authMiddleware, updateConfigSettingsHandler)



//config option values

routes.get("/getconfigoptionvalues", checkTokenBlacklist, authMiddleware, getConfigValuesHandler)
routes.get("/getconfigoptionvaluebyid", checkTokenBlacklist, authMiddleware, getConfigValueByIdHandler)
routes.post("/createconfigoptionvalue", checkTokenBlacklist, authMiddleware, createConfigValueHandler)
routes.delete("/deleteconfigoptionvalue", checkTokenBlacklist, authMiddleware, deleteConfigValueHandler)
routes.patch("/updateconfigoptionvalue", checkTokenBlacklist, authMiddleware, updateConfigValueHandler)

// Route to fetch all products with related images and configuration options
routes.get('/products', checkTokenBlacklist, authMiddleware, getAllProducts);

// Route to fetch a single product by ID with related images and configuration options
routes.get('/products/:id', checkTokenBlacklist, authMiddleware, getProductById);

// Route to fetch a single product by company ID with related images and configuration options
routes.get('/company/:companyId/product', checkTokenBlacklist, authMiddleware, getProductByCompanyId);

// Route to fetch all products by company ID with related images and configuration options
routes.get('/company/:companyId/products', checkTokenBlacklist, authMiddleware, getAllProductsByCompanyId);

// Route to create a new product
// routes.post('/products', checkTokenBlacklist, authMiddleware, createProduct);
routes.post('/product', checkTokenBlacklist, authMiddleware, upload.array('images', 10), createProduct);

// Route to update a product by ID
routes.put('/products/:id', checkTokenBlacklist, authMiddleware, updateProductById);

// Route to delete a product by ID
routes.delete('/products/:id', checkTokenBlacklist, authMiddleware, deleteProductById);

// Route to add an image to a product
routes.post('/products/:id/images', checkTokenBlacklist, authMiddleware, addProductImage);

export default routes;
