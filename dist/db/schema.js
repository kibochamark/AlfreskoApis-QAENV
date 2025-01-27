"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planRelations = exports.subscriptionPlanRelations = exports.subscriptionRelations = exports.companyRelations = exports.proposalRelations = exports.companyProductRelations = exports.productImageRelations = exports.configurationValueRelations = exports.configurationOptionRelations = exports.productRelations = exports.rolePermissionRelations = exports.permissionRelations = exports.roleRelations = exports.userRelations = exports.proposals = exports.productImages = exports.productimageEnum = exports.configurationValues = exports.configurationOptions = exports.categories = exports.companyProducts = exports.products = exports.rolePermissions = exports.refreshTokens = exports.permissions = exports.subscriptions = exports.subscriptionPlans = exports.company = exports.subscriptionEnum = exports.profiles = exports.profileTypeEnum = exports.users = exports.roles = void 0;
// @ts-nocheck
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Roles Table
exports.roles = (0, pg_core_1.pgTable)("roles", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => new Date())
});
// Users Table
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    role_id: (0, pg_core_1.integer)('role_id').references(() => exports.roles.id).notNull(),
    profile_id: (0, pg_core_1.integer)('profile_id').references(() => exports.profiles.id).unique(),
    company_id: (0, pg_core_1.integer)('company_id').references(() => exports.company.id).unique().default(null),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    password: (0, pg_core_1.varchar)('password').notNull(),
    salt: (0, pg_core_1.varchar)('salt').notNull(),
    otp_code: (0, pg_core_1.varchar)('otp_code'), // Add OTP code field
    otp_expires_at: (0, pg_core_1.timestamp)('otp_expires_at'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow().$onUpdate(() => new Date())
});
exports.profileTypeEnum = (0, pg_core_1.pgEnum)('profiletype', ['individual', 'company', 'admin']);
// Profiles Table
exports.profiles = (0, pg_core_1.pgTable)("profiles", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    user_type: (0, exports.profileTypeEnum)('profiletype'),
    name: (0, pg_core_1.text)('name').notNull(),
    phone: (0, pg_core_1.varchar)('phone'),
    address: (0, pg_core_1.text)('address'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => new Date())
});
exports.subscriptionEnum = (0, pg_core_1.pgEnum)('subscriptions_status', ['active', 'inactive']);
// companies
exports.company = (0, pg_core_1.pgTable)("companies", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    company_name: (0, pg_core_1.text)("company_name").notNull(),
    street_address: (0, pg_core_1.text)("address1").notNull(),
    street_address2: (0, pg_core_1.text)("address2"),
    location: (0, pg_core_1.text)("location").notNull(),
    phone: (0, pg_core_1.text)("company-telephone").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => new Date())
});
// Subscription Plans Table
exports.subscriptionPlans = (0, pg_core_1.pgTable)("subscription_plans", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    price: (0, pg_core_1.integer)('price').notNull(),
    discount: (0, pg_core_1.integer)('discount').default(0), // Discount field
    duration: (0, pg_core_1.integer)('duration').notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => new Date())
});
// Subscriptions Table
exports.subscriptions = (0, pg_core_1.pgTable)("subscriptions", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    company_id: (0, pg_core_1.integer)('company_id').references(() => exports.company.id).notNull(),
    plan_id: (0, pg_core_1.integer)('plan_id').references(() => exports.subscriptionPlans.id).notNull(),
    status: (0, exports.subscriptionEnum)('status').default('inactive').notNull(),
    start_date: (0, pg_core_1.timestamp)('start_date').notNull(),
    end_date: (0, pg_core_1.timestamp)('end_date').notNull(), // Subscription end date
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => new Date())
});
// Permissions Table
exports.permissions = (0, pg_core_1.pgTable)("permissions", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => new Date())
});
// RefreshTokens Table
exports.refreshTokens = (0, pg_core_1.pgTable)("refresh_tokens", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    user_id: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    token: (0, pg_core_1.text)('token').notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => new Date())
});
// RolePermissions Table
exports.rolePermissions = (0, pg_core_1.pgTable)("role_permissions", {
    role_id: (0, pg_core_1.integer)('role_id').references(() => exports.roles.id).notNull(),
    permission_id: (0, pg_core_1.integer)('permission_id').references(() => exports.permissions.id).notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)(table.role_id, table.permission_id)
}));
// Products Table
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    category_id: (0, pg_core_1.integer)('category_id').references(() => exports.categories.id).notNull(),
    base_price: (0, pg_core_1.decimal)('base_price').notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => new Date())
});
//company products
exports.companyProducts = (0, pg_core_1.pgTable)("company_products", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    company_id: (0, pg_core_1.integer)('company_id').references(() => exports.company.id).notNull(),
    product_id: (0, pg_core_1.integer)('product_id').references(() => exports.products.id).notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => new Date())
});
//categories table
exports.categories = (0, pg_core_1.pgTable)("categories", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().$onUpdate(() => new Date())
});
// Configuration Options Table
exports.configurationOptions = (0, pg_core_1.pgTable)("configuration_options", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    product_id: (0, pg_core_1.integer)('product_id').references(() => exports.products.id, { onDelete: 'cascade' }).notNull(),
    option_name: (0, pg_core_1.text)('option_name').notNull().unique(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow().$onUpdate(() => new Date())
});
// Configuration Values Table
exports.configurationValues = (0, pg_core_1.pgTable)("configuration_values", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    option_id: (0, pg_core_1.integer)('option_id').references(() => exports.configurationOptions.id, { onDelete: 'cascade' }).notNull(),
    value_name: (0, pg_core_1.text)('value_name').notNull().unique(),
    price_adjustment: (0, pg_core_1.decimal)('price_adjustment').notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow().$onUpdate(() => new Date())
});
exports.productimageEnum = (0, pg_core_1.pgEnum)("productimages", ["2D", "3D"]);
// Product Images Table
exports.productImages = (0, pg_core_1.pgTable)("product_images", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    product_id: (0, pg_core_1.integer)('product_id').references(() => exports.products.id, { onDelete: 'cascade' }).notNull(),
    image_type: (0, exports.productimageEnum)("productimages").notNull(),
    image_url: (0, pg_core_1.text)('image_url').notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow().$onUpdate(() => new Date())
});
// Proposals Table
exports.proposals = (0, pg_core_1.pgTable)("proposals", {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    user_id: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    product_id: (0, pg_core_1.integer)('product_id').references(() => exports.products.id, { onDelete: 'cascade' }).notNull(),
    selected_options: (0, pg_core_1.json)('selected_options').notNull(),
    total_price: (0, pg_core_1.integer)('total_price').notNull(),
    status: (0, pg_core_1.text)('status').notNull(),
    created_at: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updated_at: (0, pg_core_1.timestamp)('updated_at').defaultNow().$onUpdate(() => new Date())
});
// Relations
exports.userRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one, many }) => ({
    profile: one(exports.profiles),
    company: one(exports.company),
    role: one(exports.roles),
    refreshTokens: many(exports.refreshTokens)
}));
exports.roleRelations = (0, drizzle_orm_1.relations)(exports.roles, ({ many }) => ({
    role_permissions: many(exports.rolePermissions),
    users: many(exports.users)
}));
exports.permissionRelations = (0, drizzle_orm_1.relations)(exports.permissions, ({ many }) => ({
    role_permissions: many(exports.rolePermissions)
}));
exports.rolePermissionRelations = (0, drizzle_orm_1.relations)(exports.rolePermissions, ({ one }) => ({
    role: one(exports.roles, {
        fields: [exports.rolePermissions.role_id],
        references: [exports.roles.id]
    }),
    permission: one(exports.permissions, {
        fields: [exports.rolePermissions.permission_id],
        references: [exports.permissions.id]
    })
}));
exports.productRelations = (0, drizzle_orm_1.relations)(exports.products, ({ many }) => ({
    configuration_options: many(exports.configurationOptions),
    product_images: many(exports.productImages),
    proposals: many(exports.proposals)
}));
exports.configurationOptionRelations = (0, drizzle_orm_1.relations)(exports.configurationOptions, ({ one, many }) => ({
    product: one(exports.products, {
        fields: [exports.configurationOptions.product_id],
        references: [exports.products.id]
    }),
    configuration_values: many(exports.configurationValues)
}));
exports.configurationValueRelations = (0, drizzle_orm_1.relations)(exports.configurationValues, ({ one }) => ({
    configuration_option: one(exports.configurationOptions, {
        fields: [exports.configurationValues.option_id],
        references: [exports.configurationOptions.id]
    })
}));
exports.productImageRelations = (0, drizzle_orm_1.relations)(exports.productImages, ({ one }) => ({
    product: one(exports.products, {
        fields: [exports.productImages.product_id],
        references: [exports.products.id]
    })
}));
exports.companyProductRelations = (0, drizzle_orm_1.relations)(exports.companyProducts, ({ one }) => ({
    company: one(exports.company, {
        fields: [exports.companyProducts.company_id],
        references: [exports.company.id]
    }),
    product: one(exports.products, {
        fields: [exports.companyProducts.product_id],
        references: [exports.products.id]
    })
}));
exports.proposalRelations = (0, drizzle_orm_1.relations)(exports.proposals, ({ one }) => ({
    user: one(exports.users),
    product: one(exports.products)
}));
exports.companyRelations = (0, drizzle_orm_1.relations)(exports.company, ({ many }) => ({
    users: many(exports.users),
    subscriptions: many(exports.subscriptions),
    company_products: many(exports.companyProducts)
}));
exports.subscriptionRelations = (0, drizzle_orm_1.relations)(exports.subscriptions, ({ one }) => ({
    company: one(exports.company, {
        fields: [exports.subscriptions.company_id],
        references: [exports.company.id]
    }),
    plan: one(exports.subscriptionPlans, {
        fields: [exports.subscriptions.plan_id],
        references: [exports.subscriptionPlans.id]
    })
}));
exports.subscriptionPlanRelations = (0, drizzle_orm_1.relations)(exports.subscriptionPlans, ({ many }) => ({
    subscriptions: many(exports.subscriptions)
}));
// Relations
// export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
//     company: one(company),
//     plan: one(subscriptionPlans)
// }));
exports.planRelations = (0, drizzle_orm_1.relations)(exports.subscriptionPlans, ({ many }) => ({
    subscriptions: many(exports.subscriptions)
}));
//# sourceMappingURL=schema.js.map