// @ts-nocheck
import { boolean, decimal, integer, json, jsonb, pgEnum, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { InferModel, SQL, relations } from "drizzle-orm";
import exp from "constants";

// Roles Table
export const roles = pgTable("roles", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});



// Users Table
export const users = pgTable("users", {
    id: serial('id').primaryKey(),
    role_id: integer('role_id').references(() => roles.id).notNull(),
    profile_id: integer('profile_id').references(() => profiles.id).unique(),
    company_id: integer('company_id').references(() => company.id).unique().default(null),
    email: text('email').notNull().unique(),
    password: varchar('password').notNull(),
    salt: varchar('salt').notNull(),
    otp_code: varchar('otp_code'), // Add OTP code field
    otp_expires_at: timestamp('otp_expires_at'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});


export const profileTypeEnum = pgEnum('profiletype', ['individual', 'company', 'admin'])


// Profiles Table
export const profiles = pgTable("profiles", {
    id: serial('id').primaryKey(),
    user_type: profileTypeEnum('profiletype'),
    name: text('name').notNull(),
    phone: varchar('phone'),
    address: text('address'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});


export const subscriptionEnum = pgEnum('subscriptions_status', ['active', 'inactive']);


// companies
export const company = pgTable("companies", {
    id: serial('id').primaryKey(),
    company_name: text("company_name").notNull(),
    street_address: text("address1").notNull(),
    street_address2: text("address2"),
    location: text("location").notNull(),
    phone: text("company-telephone").notNull(),
    email: text("email").notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})
// Subscription Plans Table
export const subscriptionPlans = pgTable("subscription_plans", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    price: integer('price').notNull(),
    discount: integer('discount').default(0), // Discount field
    duration: integer('duration').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});
// Subscriptions Table

export const subscriptions = pgTable("subscriptions", {
    id: serial('id').primaryKey(),
    company_id: integer('company_id').references(() => company.id).notNull(),
    plan_id: integer('plan_id').references(() => subscriptionPlans.id).notNull(),
    status: subscriptionEnum('status').default('inactive').notNull(),
    start_date: timestamp('start_date').notNull(),
    end_date: timestamp('end_date').notNull(), // Subscription end date
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});


// Permissions Table
export const permissions = pgTable("permissions", {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});
// RefreshTokens Table
export const refreshTokens = pgTable("refresh_tokens", {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id).notNull(),
    token: text('token').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});
// RolePermissions Table
export const rolePermissions = pgTable("role_permissions", {
    role_id: integer('role_id').references(() => roles.id).notNull(),
    permission_id: integer('permission_id').references(() => permissions.id).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
    pk: primaryKey(table.role_id, table.permission_id)
}));


// Products Table
export const products = pgTable("products", {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    category_id: integer('category_id').references(() => categories.id).notNull(),
    base_price: decimal('base_price').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});



export const quoteStatusEnum = pgEnum("status", ["contacted",
    "left message",
    "survey booked",
    "survey completed",
    "revised estimate sent",
    "sale agreed",
    "invoiced",
    "payment received",
    "ordered",
    "installed",
    "complete",
    "pending"
]);

// Quote Table
export const quote = pgTable("quote", {
    id: serial("id").primaryKey(), // Ensure the field name is a string
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: varchar("phone").notNull(),
    address: text("address").notNull(),
    dimensions: text("dimensions").notNull(),
    canopyType: varchar("canopyType").notNull(),
    rooffeature: text("rooffeature"),
    timeframe: text("timeframe"),
    wallfeatures: jsonb("wallfeatures").notNull(), // Ensure the name is "wallfeatures" (plural)
    backside: text("backside"),
    status: quoteStatusEnum("status").notNull(),
    additionalfeatures: text("additionalfeatures"),
    installation: boolean("installation").$default(false),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    price:decimal('price').notNull().default(0.00),
    roofBlinds:varchar("roofBlinds"),
    budget:decimal('budget').notNull().default(0.00)
});


//company products
export const companyProducts = pgTable("company_products", {
    id: serial('id').primaryKey(),
    company_id: integer('company_id').references(() => company.id).notNull(),
    product_id: integer('product_id').references(() => products.id).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});



//categories table

export const categories = pgTable("categories", {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
})


// Configuration Options Table
export const configurationOptions = pgTable("configuration_options", {
    id: serial('id').primaryKey(),
    product_id: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
    option_name: text('option_name').notNull().unique(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

// Configuration Values Table
export const configurationValues = pgTable("configuration_values", {
    id: serial('id').primaryKey(),
    option_id: integer('option_id').references(() => configurationOptions.id, { onDelete: 'cascade' }).notNull(),
    value_name: text('value_name').notNull().unique(),
    price_adjustment: decimal('price_adjustment').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});


export const productimageEnum = pgEnum("productimages", ["2D", "3D"])

// Product Images Table
export const productImages = pgTable("product_images", {
    id: serial('id').primaryKey(),
    product_id: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
    image_type: productimageEnum("productimages").notNull(),
    image_url: text('image_url').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});


// Proposals Table
export const proposals = pgTable("proposals", {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id).notNull(),
    product_id: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
    selected_options: json('selected_options').notNull(),
    total_price: integer('total_price').notNull(),
    status: text('status').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});


// configuration setting
export const ConfigSettings = pgTable("configsettings", {
    id: serial('id').primaryKey(),
    priceToggle:boolean("pricetoggle").$default(false),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
})



// Relations
export const userRelations = relations(users, ({ one, many }) => ({
    profile: one(profiles),
    company: one(company),
    role: one(roles),
    refreshTokens: many(refreshTokens)
}));

export const roleRelations = relations(roles, ({ many }) => ({
    role_permissions: many(rolePermissions),
    users: many(users)
}));

export const permissionRelations = relations(permissions, ({ many }) => ({
    role_permissions: many(rolePermissions)
}));

export const rolePermissionRelations = relations(rolePermissions, ({ one }) => ({
    role: one(roles, {
        fields: [rolePermissions.role_id],
        references: [roles.id]
    }),
    permission: one(permissions, {
        fields: [rolePermissions.permission_id],
        references: [permissions.id]
    })
}));

export const productRelations = relations(products, ({ many }) => ({
    configuration_options: many(configurationOptions),
    product_images: many(productImages),
    proposals: many(proposals)
}));

export const configurationOptionRelations = relations(configurationOptions, ({ one, many }) => ({
    product: one(products, {
        fields: [configurationOptions.product_id],
        references: [products.id]
    }),
    configuration_values: many(configurationValues)
}));

export const configurationValueRelations = relations(configurationValues, ({ one }) => ({
    configuration_option: one(configurationOptions, {
        fields: [configurationValues.option_id],
        references: [configurationOptions.id]
    })
}));

export const productImageRelations = relations(productImages, ({ one }) => ({
    product: one(products, {
        fields: [productImages.product_id],
        references: [products.id]
    })
}));



export const companyProductRelations = relations(companyProducts, ({ one }) => ({
    company: one(company, {
        fields: [companyProducts.company_id],
        references: [company.id]
    }),
    product: one(products, {
        fields: [companyProducts.product_id],
        references: [products.id]
    })
}));


export const proposalRelations = relations(proposals, ({ one }) => ({
    user: one(users),
    product: one(products)
}));


export const companyRelations = relations(company, ({ many }) => ({
    users: many(users),
    subscriptions: many(subscriptions),
    company_products: many(companyProducts)

}));

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
    company: one(company, {
        fields: [subscriptions.company_id],
        references: [company.id]
    }),
    plan: one(subscriptionPlans, {
        fields: [subscriptions.plan_id],
        references: [subscriptionPlans.id]
    })
}));

export const subscriptionPlanRelations = relations(subscriptionPlans, ({ many }) => ({
    subscriptions: many(subscriptions)
}));

// Relations
// export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
//     company: one(company),
//     plan: one(subscriptionPlans)
// }));

export const planRelations = relations(subscriptionPlans, ({ many }) => ({
    subscriptions: many(subscriptions)
}));

// Define types
export type SubscriptionPlan = InferModel<typeof subscriptionPlans>;
export type InsertSubscriptionPlan = InferModel<typeof subscriptionPlans, 'insert'>;
export type Subscription = InferModel<typeof subscriptions>;
export type InsertSubscription = InferModel<typeof subscriptions, 'insert'>;

export type config = InferModel<typeof ConfigSettings>;
export type InsertConfig = InferModel<typeof ConfigSettings, 'insert'>;


// export const posts = pgTable("posts", {
//     id: serial('id').primaryKey(),
//     title: text('title').notNull().unique(),
//     content: text('content').notNull(),
//     imagepath:varchar("imagepath"),
//     author_id: integer("author_id").references(() => users.id, { onDelete: "cascade" }),
//     slug: text("slug").notNull(),  // keep slug as a text field
//     created_at: timestamp("created_at").defaultNow(),
//     updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
// });

// export const postsRelations = relations(posts, ({ one, many }) => ({
//     author: one(users, {
//         fields: [posts.author_id],
//         references: [users.id],
//     }),
//     comments: many(comments),
//     categories: many(postsToCategories),
// }));

// export const comments = pgTable("comments", {
//     id: serial('id').primaryKey(),
//     post_id: integer("post_id").references(() => posts.id, { onDelete: "cascade" }),
//     author_id: integer("author_id").references(() => users.id, { onDelete: "cascade" }),
//     content: text("content"),
//     created_at: timestamp("created_at").defaultNow(),
//     updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
// });

// export const commentsRelations = relations(comments, ({ one }) => ({
//     post: one(posts, {
//         fields: [comments.post_id],
//         references: [posts.id],
//     }),
//     author: one(users, {
//         fields: [comments.author_id],
//         references: [users.id],
//     }),
// }));

// export const category = pgTable("category", {
//     id: serial('id').primaryKey(),
//     name: text('name').notNull().unique(),
//     slug: text("slug"),
//     created_at: timestamp("created_at").defaultNow(),
//     update_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
// });

// export const categoryRelation = relations(category, ({ many }) => ({
//     postCategories: many(postsToCategories),
// }));

// export const postsToCategories = pgTable(
//     'posts_to_categories',
//     {
//         post_id: integer('post_id').notNull().references(() => posts.id, { onDelete: "cascade" }),
//         category_id: integer('category_id').notNull().references(() => category.id, { onDelete: "cascade" }),
//     },
//     (t) => ({
//         pk: primaryKey({ columns: [t.post_id, t.category_id] }),
//     }),
// );


// export const postTocategoriesRelations = relations(postsToCategories, ({ one }) => ({
//   postCategories: one(posts, {
//     fields: [postsToCategories.post_id],
//     references: [posts.id],
//   }),
//   categories: one(category, {
//     fields: [postsToCategories.category_id],
//     references: [category.id],
//   }),
// }));

// export type User = InferModel<typeof users>;
export type User = InferModel<typeof users> & { company_id?: number };
// Define Role type
export type Role = InferModel<typeof roles, 'select'>;
export type InsertRole = InferModel<typeof roles, 'insert'>;

// categories
export type Category = InferModel<typeof categories, 'select'>;
export type InsertCategory = InferModel<typeof categories, 'insert'>;

// quote
export type Quote = InferModel<typeof quote, 'select'>;
export type InsertQuote = InferModel<typeof quote, 'insert'>;

// Define Profile type
export type Profile = InferModel<typeof profiles>;

// Define Permission type
export type Permission = InferModel<typeof permissions, 'select'>;
export type InsertPermission = InferModel<typeof permissions, 'insert'>;

// Define RolePermission type
export type RolePermission = InferModel<typeof rolePermissions>;

export type RefreshToken = InferModel<typeof refreshTokens>;

export type ProfileType = NoInfer<typeof profileTypeEnum>;

export type Company = InferModel<typeof company>;
export type CompanyProduct = InferModel<typeof companyProducts>;
export type InsertConfigureOption = InferModel<typeof configurationOptions, 'insert'>;
export type InsertConfigureOptionValue = InferModel<typeof configurationValues, 'insert'>;
