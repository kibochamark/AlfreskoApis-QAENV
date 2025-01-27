"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigoptionswithvaluesbyid = exports.getConfigoptionswithvalues = exports.deleteConfigOption = exports.getconfigoptionbyproductid = exports.getconfigoptionbyid = exports.getconfigoptions = exports.updateconfigoption = exports.createconfigoption = exports.deleteCategory = exports.updateCategory = exports.createcategory = exports.getCategoryById = exports.getCategories = exports.assignPermissionsToRole = exports.deleterole = exports.getroles = exports.getrole = exports.updaterole = exports.createrole = exports.updatePassword = exports.verifyOtpCode = exports.setOtpCode = exports.deleteRefreshTokensByUserId = exports.deleteUser = exports.deletepermission = exports.getpermission = exports.updatepermission = exports.createpermission = exports.getUserWithProfile = exports.getUsersWithProfiles = exports.nullifyProfileInUsers = exports.deleteProfile = exports.updateProfile = exports.createProfile = exports.createCompanywithUser = exports.updateUser = exports.createUser = exports.getUserByEmail = exports.getUser = exports.getUsers = exports.deleteRefreshToken = exports.insertRefreshToken = exports.checkActiveSubscription = exports.getSubscriptionsByCompany = exports.updateSubscription = exports.createSubscription = exports.getSubscriptionPlanById = exports.getSubscriptionPlans = exports.updateSubscriptionPlan = exports.createSubscriptionPlan = void 0;
exports.updateProduct = exports.retrieveProductById = exports.retrieveproducts = exports.deleteConfigValue = exports.updateConfigValue = exports.getConfigValueById = exports.getConfigValues = exports.createConfigValue = exports.getConfigoptionswithvaluesbyproductid = void 0;
// @ts-nocheck
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = __importDefault(require("../utils/connection"));
const schema_1 = require("./schema");
const HasherPassword_1 = require("../utils/HasherPassword");
const drizzle_orm_2 = require("drizzle-orm");
const schema_2 = require("./schema");
// Create a new subscription plan
const createSubscriptionPlan = async (plan) => {
    return await connection_1.default.insert(schema_2.subscriptionPlans).values(plan).returning({
        id: schema_2.subscriptionPlans.id,
        name: schema_2.subscriptionPlans.name,
        description: schema_2.subscriptionPlans.description,
        price: schema_2.subscriptionPlans.price,
        discount: schema_2.subscriptionPlans.discount,
        duration_months: schema_2.subscriptionPlans.duration
    });
};
exports.createSubscriptionPlan = createSubscriptionPlan;
// Update an existing subscription plan
const updateSubscriptionPlan = async (plan, planId) => {
    return await connection_1.default.update(schema_2.subscriptionPlans).set(plan).where((0, drizzle_orm_1.eq)(schema_2.subscriptionPlans.id, planId)).returning({
        id: schema_2.subscriptionPlans.id,
        name: schema_2.subscriptionPlans.name,
        description: schema_2.subscriptionPlans.description,
        price: schema_2.subscriptionPlans.price,
        discount: schema_2.subscriptionPlans.discount,
        duration_months: schema_2.subscriptionPlans.duration
    });
};
exports.updateSubscriptionPlan = updateSubscriptionPlan;
// Get all subscription plans
const getSubscriptionPlans = async () => {
    return await connection_1.default.select().from(schema_2.subscriptionPlans);
};
exports.getSubscriptionPlans = getSubscriptionPlans;
// Get a specific subscription plan by ID
const getSubscriptionPlanById = async (planId) => {
    return await connection_1.default.select().from(schema_2.subscriptionPlans).where((0, drizzle_orm_1.eq)(schema_2.subscriptionPlans.id, planId));
};
exports.getSubscriptionPlanById = getSubscriptionPlanById;
// Create a new subscription
const createSubscription = async (subscription) => {
    return await connection_1.default.insert(schema_2.subscriptions).values(subscription).returning({
        id: schema_2.subscriptions.id,
        company_id: schema_2.subscriptions.company_id,
        plan_id: schema_2.subscriptions.plan_id,
        status: schema_2.subscriptions.status,
        start_date: schema_2.subscriptions.start_date,
        end_date: schema_2.subscriptions.end_date
    });
};
exports.createSubscription = createSubscription;
// Update an existing subscription
const updateSubscription = async (subscription, subscriptionId) => {
    return await connection_1.default.update(schema_2.subscriptions).set(subscription).where((0, drizzle_orm_1.eq)(schema_2.subscriptions.id, subscriptionId)).returning({
        id: schema_2.subscriptions.id,
        company_id: schema_2.subscriptions.company_id,
        plan_id: schema_2.subscriptions.plan_id,
        status: schema_2.subscriptions.status,
        start_date: schema_2.subscriptions.start_date,
        end_date: schema_2.subscriptions.end_date
    });
};
exports.updateSubscription = updateSubscription;
// Get all subscriptions for a specific company
const getSubscriptionsByCompany = async (companyId) => {
    return await connection_1.default.select().from(schema_2.subscriptions).where((0, drizzle_orm_1.eq)(schema_2.subscriptions.company_id, companyId));
};
exports.getSubscriptionsByCompany = getSubscriptionsByCompany;
// Check if a company has an active subscription
const checkActiveSubscription = async (companyId) => {
    const currentDate = new Date();
    const activeSubscription = await connection_1.default.select()
        .from(schema_2.subscriptions)
        .where((0, drizzle_orm_2.and)((0, drizzle_orm_1.eq)(schema_2.subscriptions.company_id, companyId), (0, drizzle_orm_1.eq)(schema_2.subscriptions.status, 'active'), (0, drizzle_orm_2.gte)(schema_2.subscriptions.end_date, currentDate)))
        .limit(1);
    return activeSubscription.length > 0 ? activeSubscription[0] : null;
};
exports.checkActiveSubscription = checkActiveSubscription;
// tokens  ----------------------------------------------
const insertRefreshToken = async (refreshToken, user_id) => {
    return await connection_1.default.insert(schema_1.refreshTokens).values({ user_id: user_id, token: refreshToken }).returning({
        id: schema_1.refreshTokens.id,
        user: schema_1.refreshTokens.user_id,
        token: schema_1.refreshTokens.token
    });
};
exports.insertRefreshToken = insertRefreshToken;
const deleteRefreshToken = async (token) => {
    return await connection_1.default.delete(schema_1.refreshTokens).where((0, drizzle_orm_1.eq)(schema_1.refreshTokens.token, token));
};
exports.deleteRefreshToken = deleteRefreshToken;
// users -----------------------------
const getUsers = async () => {
    return await connection_1.default.select({ id: schema_1.users.id, email: schema_1.users.email }).from(schema_1.users);
};
exports.getUsers = getUsers;
const getUser = async (id) => {
    return await connection_1.default.select({ id: schema_1.users.id, email: schema_1.users.email, role: schema_1.users.role_id }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
};
exports.getUser = getUser;
const getUserByEmail = async (email) => {
    return await connection_1.default.select({ id: schema_1.users.id, email: schema_1.users.email }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
};
exports.getUserByEmail = getUserByEmail;
const createUser = async (user) => {
    return await connection_1.default.insert(schema_1.users).values(user).returning({
        id: schema_1.users.id,
        email: schema_1.users.email,
        role: schema_1.users.role_id,
        profile: schema_1.users.profile_id
    });
};
exports.createUser = createUser;
const updateUser = async (user, id) => {
    return await connection_1.default.update(schema_1.users).set(user).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).returning({
        id: schema_1.users.id,
        email: schema_1.users.email,
        role: schema_1.users.role_id,
        profile: schema_1.users.profile_id
    });
};
exports.updateUser = updateUser;
// create company 
const createCompanywithUser = async ({ salt, role, companyName, companyAddress, companyPhone, companyEmail, email, location, hashedPassword, }) => {
    return await connection_1.default.transaction(async (tx) => {
        // Create company profile
        const [companydata] = await tx.insert(schema_1.company).values({
            company_name: companyName,
            street_address: companyAddress,
            street_address2: companyAddress,
            location: location,
            phone: companyPhone,
            email: companyEmail
        }).returning();
        // Create user profile
        const [profile] = await tx.insert(schema_1.profiles).values({
            user_type: 'company',
            name: companyName,
            phone: companyPhone,
            address: companyAddress
        }).returning();
        // Create user
        const user = await tx.insert(schema_1.users).values({
            email: email,
            password: hashedPassword,
            salt: salt,
            role_id: role,
            profile_id: profile.id,
            company_id: companydata.id
        }).returning();
        return user;
    });
};
exports.createCompanywithUser = createCompanywithUser;
// forgot password ---------------------------------------------
// reset password
// export const updatePassword = async (userId: number, newPassword: string) => {
//     const { hashedPassword, salt } = await createHash(newPassword)
//     return await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
// };
// profile -----------------------------------------------
const createProfile = async (userType, name, phone, address) => {
    return await connection_1.default.insert(schema_1.profiles).values({
        user_type: userType,
        name: name,
        phone: phone,
        address: address,
        created_at: new Date(),
        updated_at: new Date()
    }).returning({
        id: schema_1.profiles.id,
        user_type: schema_1.profiles.user_type,
        name: schema_1.profiles.name,
        phone: schema_1.profiles.phone,
        address: schema_1.profiles.address,
        created_at: schema_1.profiles.created_at,
        updated_at: schema_1.profiles.updated_at
    });
};
exports.createProfile = createProfile;
//Update profile 
const updateProfile = async (profileId, updates) => {
    return await connection_1.default.update(schema_1.profiles).set(updates).where((0, drizzle_orm_1.eq)(schema_1.profiles.id, profileId)).returning({
        id: schema_1.profiles.id,
        user_type: schema_1.profiles.user_type,
        name: schema_1.profiles.name,
        phone: schema_1.profiles.phone,
        address: schema_1.profiles.address,
        created_at: schema_1.profiles.created_at,
        updated_at: schema_1.profiles.updated_at
    });
};
exports.updateProfile = updateProfile;
//Delete Profile
const deleteProfile = async (profileId) => {
    return await connection_1.default.delete(schema_1.profiles).where((0, drizzle_orm_1.eq)(schema_1.profiles.id, profileId)).returning({
        id: schema_1.profiles.id,
        user_type: schema_1.profiles.user_type,
        name: schema_1.profiles.name,
        phone: schema_1.profiles.phone,
        address: schema_1.profiles.address,
        created_at: schema_1.profiles.created_at,
        updated_at: schema_1.profiles.updated_at
    });
};
exports.deleteProfile = deleteProfile;
const nullifyProfileInUsers = async (profileId) => {
    return await connection_1.default.update(schema_1.users).set({ profile_id: null }).where((0, drizzle_orm_1.eq)(schema_1.users.profile_id, profileId));
};
exports.nullifyProfileInUsers = nullifyProfileInUsers;
//Get Users with profile
const getUsersWithProfiles = async () => {
    return await connection_1.default
        .select({
        id: schema_1.users.id,
        email: schema_1.users.email,
        profile: {
            id: schema_1.profiles.id,
            user_type: schema_1.profiles.user_type,
            name: schema_1.profiles.name,
            phone: schema_1.profiles.phone,
            address: schema_1.profiles.address,
            created_at: schema_1.profiles.created_at,
            updated_at: schema_1.profiles.updated_at
        }
    })
        .from(schema_1.users)
        .leftJoin(schema_1.profiles, (0, drizzle_orm_1.eq)(schema_1.users.profile_id, schema_1.profiles.id));
};
exports.getUsersWithProfiles = getUsersWithProfiles;
//Get a single user
const getUserWithProfile = async (userId) => {
    return await connection_1.default
        .select({
        id: schema_1.users.id,
        email: schema_1.users.email,
        profile: {
            id: schema_1.profiles.id,
            user_type: schema_1.profiles.user_type,
            name: schema_1.profiles.name,
            phone: schema_1.profiles.phone,
            address: schema_1.profiles.address,
            created_at: schema_1.profiles.created_at,
            updated_at: schema_1.profiles.updated_at
        }
    })
        .from(schema_1.users)
        .leftJoin(schema_1.profiles, (0, drizzle_orm_1.eq)(schema_1.users.profile_id, schema_1.profiles.id))
        .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
};
exports.getUserWithProfile = getUserWithProfile;
// Permissions
const createpermission = async (perm) => {
    return await connection_1.default.insert(schema_1.permissions).values(perm).returning({
        id: schema_1.permissions.id,
        name: schema_1.permissions.name,
        description: schema_1.permissions.description
    });
};
exports.createpermission = createpermission;
const updatepermission = async (perm, id) => {
    return await connection_1.default.update(schema_1.permissions).set(perm).where((0, drizzle_orm_1.eq)(schema_1.permissions.id, id)).returning({
        id: schema_1.permissions.id,
        name: schema_1.permissions.name,
        description: schema_1.permissions.description
    });
};
exports.updatepermission = updatepermission;
const getpermission = async (id) => {
    return await connection_1.default.select().from(schema_1.permissions).where((0, drizzle_orm_1.eq)(schema_1.permissions.id, id));
};
exports.getpermission = getpermission;
const deletepermission = async (id) => {
    return await connection_1.default.delete(schema_1.permissions).where((0, drizzle_orm_1.eq)(schema_1.permissions.id, id));
};
exports.deletepermission = deletepermission;
//Delete User
const deleteUser = async (userId) => {
    return await connection_1.default.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
};
exports.deleteUser = deleteUser;
//delete refresh token to allow you to delete a user
const deleteRefreshTokensByUserId = async (userId) => {
    return await connection_1.default.delete(schema_1.refreshTokens).where((0, drizzle_orm_1.eq)(schema_1.refreshTokens.user_id, userId));
};
exports.deleteRefreshTokensByUserId = deleteRefreshTokensByUserId;
//OTP 
// Function to set the OTP code and expiration time for a user
const setOtpCode = async (email, otpCode, expiresAt) => {
    return await connection_1.default.update(schema_1.users)
        .set({ otp_code: otpCode, otp_expires_at: expiresAt })
        .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
        .returning({
        id: schema_1.users.id,
        email: schema_1.users.email,
        otp_code: schema_1.users.otp_code,
        otp_expires_at: schema_1.users.otp_expires_at,
    });
};
exports.setOtpCode = setOtpCode;
// Function to verify the OTP code
const verifyOtpCode = async (email, otpCode) => {
    const [user] = await connection_1.default.select()
        .from(schema_1.users)
        .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
    if (!user || user.otp_code !== otpCode || new Date() > user.otp_expires_at) {
        return null;
    }
    return user;
};
exports.verifyOtpCode = verifyOtpCode;
// Function to update the user's password
const updatePassword = async (userId, newPassword) => {
    const { hashedPassword, salt } = await (0, HasherPassword_1.createHash)(newPassword);
    return await connection_1.default.update(schema_1.users)
        .set({ password: hashedPassword, salt: salt })
        .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
        .returning({
        id: schema_1.users.id,
        email: schema_1.users.email,
    });
};
exports.updatePassword = updatePassword;
// roles
const createrole = async (role) => {
    return await connection_1.default.insert(schema_1.roles).values(role).returning({
        id: schema_1.roles.id,
        name: schema_1.roles.name,
        description: schema_1.roles.description
    });
};
exports.createrole = createrole;
const updaterole = async (role, id) => {
    return await connection_1.default.update(schema_1.roles).set(role).where((0, drizzle_orm_1.eq)(schema_1.roles.id, id)).returning({
        id: schema_1.roles.id,
        name: schema_1.roles.name,
        description: schema_1.roles.description
    });
};
exports.updaterole = updaterole;
const getrole = async (id) => {
    return await connection_1.default.select().from(schema_1.roles).where((0, drizzle_orm_1.eq)(schema_1.roles.id, id));
};
exports.getrole = getrole;
const getroles = async () => {
    return await connection_1.default.select().from(schema_1.roles);
};
exports.getroles = getroles;
const deleterole = async (id) => {
    return await connection_1.default.delete(schema_1.roles).where((0, drizzle_orm_1.eq)(schema_1.roles.id, id));
};
exports.deleterole = deleterole;
// role and permissions
/**
 * Assign one or more permissions to a role
 * @param roleId - The ID of the role
 * @param permissionIds - Array of permission IDs
 */
async function assignPermissionsToRole(roleId, permissionIds) {
    const values = permissionIds.map(permissionId => ({
        role_id: roleId,
        permission_id: permissionId,
    }));
    await connection_1.default.insert(schema_1.rolePermissions).values(values).onConflictDoNothing();
}
exports.assignPermissionsToRole = assignPermissionsToRole;
// categories function
const getCategories = async () => {
    return await connection_1.default.select({ id: schema_1.categories.id, name: schema_1.categories.name, description: schema_1.categories.description, created_at: schema_1.categories.created_at }).from(schema_1.categories);
};
exports.getCategories = getCategories;
const getCategoryById = async (id) => {
    return await connection_1.default.select({ id: schema_1.categories.id, name: schema_1.categories.name, description: schema_1.categories.description, created_at: schema_1.categories.created_at }).from(schema_1.categories).where((0, drizzle_orm_1.eq)(schema_1.categories.id, id));
};
exports.getCategoryById = getCategoryById;
const createcategory = async (category) => {
    return await connection_1.default.insert(schema_1.categories).values(category).returning({
        id: schema_1.categories.id, name: schema_1.categories.name, description: schema_1.categories.description, created_at: schema_1.categories.created_at
    });
};
exports.createcategory = createcategory;
const updateCategory = async (category, id) => {
    return await connection_1.default.update(schema_1.categories).set(category).where((0, drizzle_orm_1.eq)(schema_1.categories.id, id)).returning({
        id: schema_1.categories.id, name: schema_1.categories.name, description: schema_1.categories.description, updated_at: schema_1.categories.updated_at
    });
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    return await connection_1.default.delete(schema_1.categories).where((0, drizzle_orm_1.eq)(schema_1.categories.id, id));
};
exports.deleteCategory = deleteCategory;
// configure option functions
const createconfigoption = async (option) => {
    return await connection_1.default.insert(schema_1.configurationOptions).values(option).returning({
        id: schema_1.configurationOptions.id,
        name: schema_1.configurationOptions.option_name,
        product_id: schema_1.configurationOptions.product_id,
        created_at: schema_1.configurationOptions.created_at
    });
};
exports.createconfigoption = createconfigoption;
const updateconfigoption = async (option, id) => {
    return await connection_1.default.update(schema_1.configurationOptions).set(option).returning({
        id: schema_1.configurationOptions.id,
        name: schema_1.configurationOptions.option_name,
        product_id: schema_1.configurationOptions.product_id,
        updated_at: schema_1.configurationOptions.updated_at
    }).where((0, drizzle_orm_1.eq)(schema_1.configurationOptions.id, id));
};
exports.updateconfigoption = updateconfigoption;
const getconfigoptions = async () => {
    return await connection_1.default.select({
        id: schema_1.configurationOptions.id,
        name: schema_1.configurationOptions.option_name,
        product_id: schema_1.configurationOptions.product_id,
        updated_at: schema_1.configurationOptions.updated_at
    }).from(schema_1.configurationOptions);
};
exports.getconfigoptions = getconfigoptions;
const getconfigoptionbyid = async (id) => {
    return await connection_1.default.select({
        id: schema_1.configurationOptions.id,
        name: schema_1.configurationOptions.option_name,
        product_id: schema_1.configurationOptions.product_id,
        updated_at: schema_1.configurationOptions.updated_at
    }).from(schema_1.configurationOptions).where((0, drizzle_orm_1.eq)(schema_1.configurationOptions.id, id));
};
exports.getconfigoptionbyid = getconfigoptionbyid;
const getconfigoptionbyproductid = async (id) => {
    return await connection_1.default.select({
        id: schema_1.configurationOptions.id,
        name: schema_1.configurationOptions.option_name,
        product_id: schema_1.configurationOptions.product_id,
        updated_at: schema_1.configurationOptions.updated_at
    }).from(schema_1.configurationOptions).where((0, drizzle_orm_1.eq)(schema_1.configurationOptions.product_id, id));
};
exports.getconfigoptionbyproductid = getconfigoptionbyproductid;
const deleteConfigOption = async (id) => {
    return await connection_1.default.delete(schema_1.configurationOptions).where((0, drizzle_orm_1.eq)(schema_1.configurationOptions.id, id));
};
exports.deleteConfigOption = deleteConfigOption;
const getConfigoptionswithvalues = async () => {
    return await connection_1.default.query.configurationOptions.findMany({
        with: {
            configuration_values: true
        }
    });
};
exports.getConfigoptionswithvalues = getConfigoptionswithvalues;
const getConfigoptionswithvaluesbyid = async (id) => {
    return await connection_1.default.query.configurationOptions.findMany({
        where: (configurationOptions, { eq }) => eq(configurationOptions.id, id),
        with: {
            configuration_values: true
        }
    });
};
exports.getConfigoptionswithvaluesbyid = getConfigoptionswithvaluesbyid;
const getConfigoptionswithvaluesbyproductid = async (id) => {
    return await connection_1.default.query.configurationOptions.findMany({
        where: (configurationOptions, { eq }) => eq(configurationOptions.product_id, id),
        with: {
            configuration_values: true
        }
    });
};
exports.getConfigoptionswithvaluesbyproductid = getConfigoptionswithvaluesbyproductid;
//config values
const createConfigValue = async (optionvalues) => {
    return await connection_1.default.insert(schema_1.configurationValues).values(optionvalues).returning({
        id: schema_1.configurationValues.id,
        option_id: schema_1.configurationValues.option_id,
        value_name: schema_1.configurationValues.value_name,
        price_adjustment: schema_1.configurationValues.price_adjustment,
        created_at: schema_1.configurationValues.created_at,
        updated_at: schema_1.configurationValues.updated_at,
    });
};
exports.createConfigValue = createConfigValue;
const getConfigValues = async () => {
    return await connection_1.default.select({
        id: schema_1.configurationValues.id,
        option_id: schema_1.configurationValues.option_id,
        value_name: schema_1.configurationValues.value_name,
        price_adjustment: schema_1.configurationValues.price_adjustment,
        created_at: schema_1.configurationValues.created_at,
        updated_at: schema_1.configurationValues.updated_at,
    }).from(schema_1.configurationValues);
};
exports.getConfigValues = getConfigValues;
const getConfigValueById = async (id) => {
    return await connection_1.default.select({
        id: schema_1.configurationValues.id,
        option_id: schema_1.configurationValues.option_id,
        value_name: schema_1.configurationValues.value_name,
        price_adjustment: schema_1.configurationValues.price_adjustment,
        created_at: schema_1.configurationValues.created_at,
        updated_at: schema_1.configurationValues.updated_at,
    }).from(schema_1.configurationValues).where((0, drizzle_orm_1.eq)(schema_1.configurationValues.id, id));
};
exports.getConfigValueById = getConfigValueById;
const updateConfigValue = async (id, updatedValues) => {
    return await connection_1.default.update(schema_1.configurationValues).set(updatedValues).where((0, drizzle_orm_1.eq)(schema_1.configurationValues.id, id)).returning({
        id: schema_1.configurationValues.id,
        option_id: schema_1.configurationValues.option_id,
        value_name: schema_1.configurationValues.value_name,
        price_adjustment: schema_1.configurationValues.price_adjustment,
        updated_at: schema_1.configurationValues.updated_at,
    });
};
exports.updateConfigValue = updateConfigValue;
const deleteConfigValue = async (id) => {
    return await connection_1.default.delete(schema_1.configurationValues).where((0, drizzle_orm_1.eq)(schema_1.configurationValues.id, id));
};
exports.deleteConfigValue = deleteConfigValue;
const retrieveproducts = async () => {
    return await connection_1.default.query.products.findMany({
        with: {
            configuration_options: {
                columns: {
                    id: true,
                    option_name: true
                },
                with: {
                    configuration_values: {
                        columns: {
                            id: true,
                            value_name: true,
                            price_adjustment: true
                        }
                    }
                }
            },
            product_images: {
                columns: {
                    image_url: true,
                    image_type: true
                }
            }
        }
    });
};
exports.retrieveproducts = retrieveproducts;
const retrieveProductById = async (id) => {
    return await connection_1.default.query.products.findFirst({
        where: (products) => (0, drizzle_orm_1.eq)(products.id, id),
        with: {
            configuration_options: {
                with: {
                    configuration_values: true,
                },
            },
            product_images: {
                columns: {
                    image_url: true,
                    image_type: true,
                },
            },
        },
    });
};
exports.retrieveProductById = retrieveProductById;
const updateProduct = async (id, data) => {
    return await connection_1.default
        .update(schema_1.products)
        .set(data)
        .where((0, drizzle_orm_1.eq)(schema_1.products.id, id))
        .returning({
        id: schema_1.products.id,
        name: schema_1.products.name,
        description: schema_1.products.description,
        category_id: schema_1.products.category_id,
        base_price: schema_1.products.base_price,
        created_at: schema_1.products.created_at,
        updated_at: schema_1.products.updated_at,
    });
};
exports.updateProduct = updateProduct;
//# sourceMappingURL=index.js.map