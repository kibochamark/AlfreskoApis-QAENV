// @ts-nocheck
import { eq } from "drizzle-orm";
import db from "../utils/connection"
import { InsertPermission, InsertRole, User, permissions, profiles, refreshTokens, rolePermissions, roles, users, company, profileTypeEnum, ProfileType, categories, InsertCategory, InsertConfigureOption, configurationOptions, configurationValues, InsertConfigureOptionValue, products, InsertQuote, quote, InsertConfig, ConfigSettings } from './schema';
import { hashPassword } from '../utils/authenticationUtilities';
import { createHash } from "../utils/HasherPassword";
import { and, gte } from "drizzle-orm";
import { subscriptionPlans, subscriptions, InsertSubscriptionPlan, InsertSubscription, quoteStatusEnum } from './schema';

// Create a new subscription plan
export const createSubscriptionPlan = async (plan: InsertSubscriptionPlan) => {
    return await db.insert(subscriptionPlans).values(plan).returning({
        id: subscriptionPlans.id,
        name: subscriptionPlans.name,
        description: subscriptionPlans.description,
        price: subscriptionPlans.price,
        discount: subscriptionPlans.discount,
        duration_months: subscriptionPlans.duration
    });
};

// Update an existing subscription plan
export const updateSubscriptionPlan = async (plan: Partial<InsertSubscriptionPlan>, planId: number) => {
    return await db.update(subscriptionPlans).set(plan).where(eq(subscriptionPlans.id, planId)).returning({
        id: subscriptionPlans.id,
        name: subscriptionPlans.name,
        description: subscriptionPlans.description,
        price: subscriptionPlans.price,
        discount: subscriptionPlans.discount,
        duration_months: subscriptionPlans.duration
    });
};

// Get all subscription plans
export const getSubscriptionPlans = async () => {
    return await db.select().from(subscriptionPlans);
};

// Get a specific subscription plan by ID
export const getSubscriptionPlanById = async (planId: number) => {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, planId));
};

// Create a new subscription
export const createSubscription = async (subscription: InsertSubscription) => {
    return await db.insert(subscriptions).values(subscription).returning({
        id: subscriptions.id,
        company_id: subscriptions.company_id,
        plan_id: subscriptions.plan_id,
        status: subscriptions.status,
        start_date: subscriptions.start_date,
        end_date: subscriptions.end_date
    });
};

// Update an existing subscription
export const updateSubscription = async (subscription: Partial<InsertSubscription>, subscriptionId: number) => {
    return await db.update(subscriptions).set(subscription).where(eq(subscriptions.id, subscriptionId)).returning({
        id: subscriptions.id,
        company_id: subscriptions.company_id,
        plan_id: subscriptions.plan_id,
        status: subscriptions.status,
        start_date: subscriptions.start_date,
        end_date: subscriptions.end_date
    });
};

// Get all subscriptions for a specific company
export const getSubscriptionsByCompany = async (companyId: number) => {
    return await db.select().from(subscriptions).where(eq(subscriptions.company_id, companyId));
};

// Check if a company has an active subscription
export const checkActiveSubscription = async (companyId: number) => {
    const currentDate = new Date();
    const activeSubscription = await db.select()
        .from(subscriptions)
        .where(
            and(
                eq(subscriptions.company_id, companyId),
                eq(subscriptions.status, 'active'),
                gte(subscriptions.end_date, currentDate)
            )
        )
        .limit(1);

    return activeSubscription.length > 0 ? activeSubscription[0] : null;
};





// tokens  ----------------------------------------------
export const insertRefreshToken = async (refreshToken: string, user_id: number) => {
    return await db.insert(refreshTokens).values({ user_id: user_id, token: refreshToken }).returning({
        id: refreshTokens.id,
        user: refreshTokens.user_id,
        token: refreshTokens.token
    });

}

export const deleteRefreshToken = async (token: string) => {
    return await db.delete(refreshTokens).where(eq(refreshTokens.token, token))

}



// users -----------------------------

export const getUsers = async () => {
    return await db.select({ id: users.id, email: users.email }).from(users);
}
export const getUser = async (id: number) => {
    return await db.select({ id: users.id, email: users.email, role: users.role_id }).from(users).where(eq(users.id, id));
}
export const getUserByEmail = async (email: string) => {
    return await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.email, email));
}


export const createUser = async (user: {

    email: string;
    password: string;
    salt: string;
    role_id: number;


}) => {
    return await db.insert(users).values(user).returning({
        id: users.id,
        email: users.email,
        role: users.role_id,
        profile: users.profile_id
    });
}
export const updateUser = async (user: {

    email?: string;
    password?: string;
    salt?: string;
    role_id?: number;
    profile_id?: number;


}, id: number) => {
    return await db.update(users).set(user).where(eq(users.id, id)).returning({
        id: users.id,
        email: users.email,
        role: users.role_id,
        profile: users.profile_id
    });
}


// create company 
export const createCompanywithUser = async ({
    salt,
    role,
    companyName,
    companyAddress,
    companyPhone,
    companyEmail,
    email,
    location,
    hashedPassword,
}: {
    salt: string;
    role: number;
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    location: string;
    email: string;
    hashedPassword: string;
}) => {
    return await db.transaction(async (tx) => {
        // Create company profile
        const [companydata] = await tx.insert(company).values({
            company_name: companyName,
            street_address: companyAddress,
            street_address2: companyAddress,
            location: location,
            phone: companyPhone,
            email: companyEmail
        }).returning();

        // Create user profile
        const [profile] = await tx.insert(profiles).values({
            user_type: 'company',
            name: companyName,
            phone: companyPhone,
            address: companyAddress
        }).returning();

        // Create user
        const user = await tx.insert(users).values({
            email: email,
            password: hashedPassword,
            salt: salt,
            role_id: role,
            profile_id: profile.id,
            company_id: companydata.id
        }).returning();

        return user
    });
}



// forgot password ---------------------------------------------
// reset password
// export const updatePassword = async (userId: number, newPassword: string) => {


//     const { hashedPassword, salt } = await createHash(newPassword)

//     return await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));

// };




// profile -----------------------------------------------
export const createProfile = async (userType: "individual" | "company" | "admin", name: string, phone: string, address: string) => {
    return await db.insert(profiles).values({
        user_type: userType,
        name: name,
        phone: phone,
        address: address,
        created_at: new Date(),
        updated_at: new Date()
    }).returning({
        id: profiles.id,
        user_type: profiles.user_type,
        name: profiles.name,
        phone: profiles.phone,
        address: profiles.address,
        created_at: profiles.created_at,
        updated_at: profiles.updated_at
    });
};

//Update profile 
export const updateProfile = async (profileId: number, updates: any) => {
    return await db.update(profiles).set(updates).where(eq(profiles.id, profileId)).returning({
        id: profiles.id,
        user_type: profiles.user_type,
        name: profiles.name,
        phone: profiles.phone,
        address: profiles.address,
        created_at: profiles.created_at,
        updated_at: profiles.updated_at
    });
};
//Delete Profile
export const deleteProfile = async (profileId: number) => {
    return await db.delete(profiles).where(eq(profiles.id, profileId)).returning({
        id: profiles.id,
        user_type: profiles.user_type,
        name: profiles.name,
        phone: profiles.phone,
        address: profiles.address,
        created_at: profiles.created_at,
        updated_at: profiles.updated_at
    });
};
export const nullifyProfileInUsers = async (profileId: number) => {
    return await db.update(users).set({ profile_id: null }).where(eq(users.profile_id, profileId));
};
//Get Users with profile
export const getUsersWithProfiles = async () => {
    return await db
        .select({
            id: users.id,
            email: users.email,
            profile: {
                id: profiles.id,
                user_type: profiles.user_type,
                name: profiles.name,
                phone: profiles.phone,
                address: profiles.address,
                created_at: profiles.created_at,
                updated_at: profiles.updated_at
            }
        })
        .from(users)
        .leftJoin(profiles, eq(users.profile_id, profiles.id));
};
//Get a single user
export const getUserWithProfile = async (userId: number) => {
    return await db
        .select({
            id: users.id,
            email: users.email,
            profile: {
                id: profiles.id,
                user_type: profiles.user_type,
                name: profiles.name,
                phone: profiles.phone,
                address: profiles.address,
                created_at: profiles.created_at,
                updated_at: profiles.updated_at
            }
        })
        .from(users)
        .leftJoin(profiles, eq(users.profile_id, profiles.id))
        .where(eq(users.id, userId));
};
// Permissions

export const createpermission = async (perm: InsertPermission) => {
    return await db.insert(permissions).values(perm).returning({
        id: permissions.id,
        name: permissions.name,
        description: permissions.description
    })
}
export const updatepermission = async (perm: InsertPermission, id: number) => {
    return await db.update(permissions).set(perm).where(eq(permissions.id, id)).returning({
        id: permissions.id,
        name: permissions.name,
        description: permissions.description
    })
}

export const getpermission = async (id: number) => {
    return await db.select().from(permissions).where(eq(permissions.id, id))
}
export const deletepermission = async (id: number) => {
    return await db.delete(permissions).where(eq(permissions.id, id))
}
//Delete User
export const deleteUser = async (userId: number) => {
    return await db.delete(users).where(eq(users.id, userId));
};
//delete refresh token to allow you to delete a user
export const deleteRefreshTokensByUserId = async (userId: number) => {
    return await db.delete(refreshTokens).where(eq(refreshTokens.user_id, userId));
};

//OTP 
// Function to set the OTP code and expiration time for a user

export const setOtpCode = async (email: string, otpCode: string, expiresAt: Date) => {
    return await db.update(users)
        .set({ otp_code: otpCode, otp_expires_at: expiresAt })
        .where(eq(users.email, email))
        .returning({
            id: users.id,
            email: users.email,
            otp_code: users.otp_code,
            otp_expires_at: users.otp_expires_at,
        });
};

// Function to verify the OTP code
export const verifyOtpCode = async (email: string, otpCode: string) => {
    const [user] = await db.select()
        .from(users)
        .where(eq(users.email, email));

    if (!user || user.otp_code !== otpCode || new Date() > user.otp_expires_at) {
        return null;
    }
    return user;
};

// Function to update the user's password
export const updatePassword = async (userId: number, newPassword: string) => {
    const { hashedPassword, salt } = await createHash(newPassword);
    return await db.update(users)
        .set({ password: hashedPassword, salt: salt })
        .where(eq(users.id, userId))
        .returning({
            id: users.id,
            email: users.email,
        });
};




// roles
export const createrole = async (role: InsertRole) => {
    return await db.insert(roles).values(role).returning({
        id: roles.id,
        name: roles.name,
        description: roles.description
    })
}
export const updaterole = async (role: InsertRole, id: number) => {
    return await db.update(roles).set(role).where(eq(roles.id, id)).returning({
        id: roles.id,
        name: roles.name,
        description: roles.description
    })
}

export const getrole = async (id: number) => {
    return await db.select().from(roles).where(eq(roles.id, id))
}
export const getroles = async () => {
    return await db.select().from(roles)
}
export const deleterole = async (id: number) => {
    return await db.delete(roles).where(eq(roles.id, id))
}


// role and permissions

/**
 * Assign one or more permissions to a role
 * @param roleId - The ID of the role
 * @param permissionIds - Array of permission IDs
 */
export async function assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<void> {
    const values = permissionIds.map(permissionId => ({
        role_id: roleId,
        permission_id: permissionId,
    }));

    await db.insert(rolePermissions).values(values).onConflictDoNothing();
}




// categories function

export const getCategories = async () => {
    return await db.select({ id: categories.id, name: categories.name, description: categories.description, created_at: categories.created_at }).from(categories)
}

export const getCategoryById = async (id: number) => {
    return await db.select({ id: categories.id, name: categories.name, description: categories.description, created_at: categories.created_at }).from(categories).where(eq(categories.id, id))
}



export const createcategory = async (category: InsertCategory) => {

    return await db.insert(categories).values(category).returning({
        id: categories.id, name: categories.name, description: categories.description, created_at: categories.created_at
    })

}


export const updateCategory = async (category: InsertCategory, id: number) => {

    return await db.update(categories).set(category).where(eq(categories.id, id)).returning({
        id: categories.id, name: categories.name, description: categories.description, updated_at: categories.updated_at
    })

}


export const deleteCategory = async (id: number) => {
    return await db.delete(categories).where(eq(categories.id, id))
}



// configure option functions


export const createconfigoption = async (option: InsertConfigureOption) => {
    return await db.insert(configurationOptions).values(option).returning({
        id: configurationOptions.id,
        name: configurationOptions.option_name,
        product_id: configurationOptions.product_id,
        created_at: configurationOptions.created_at
    })
}



export const updateconfigoption = async (option: {
    option_name: string
}, id: number) => {
    return await db.update(configurationOptions).set(option).returning({
        id: configurationOptions.id,
        name: configurationOptions.option_name,
        product_id: configurationOptions.product_id,
        updated_at: configurationOptions.updated_at
    }).where(eq(configurationOptions.id, id))
}



export const getconfigoptions = async () => {
    return await db.select({
        id: configurationOptions.id,
        name: configurationOptions.option_name,
        product_id: configurationOptions.product_id,
        updated_at: configurationOptions.updated_at
    }).from(configurationOptions)
}


export const getconfigoptionbyid = async (id: number) => {
    return await db.select({
        id: configurationOptions.id,
        name: configurationOptions.option_name,
        product_id: configurationOptions.product_id,
        updated_at: configurationOptions.updated_at
    }).from(configurationOptions).where(eq(configurationOptions.id, id))
}

export const getconfigoptionbyproductid = async (id: number) => {
    return await db.select({
        id: configurationOptions.id,
        name: configurationOptions.option_name,
        product_id: configurationOptions.product_id,
        updated_at: configurationOptions.updated_at
    }).from(configurationOptions).where(eq(configurationOptions.product_id, id))
}

export const deleteConfigOption = async (id: number) => {
    return await db.delete(configurationOptions).where(eq(configurationOptions.id, id))
}


export const getConfigoptionswithvalues = async () => {
    return await db.query.configurationOptions.findMany({
        with: {
            configuration_values: true
        }
    })
}
export const getConfigoptionswithvaluesbyid = async (id: number) => {
    return await db.query.configurationOptions.findMany({
        where: (configurationOptions, { eq }) => eq(configurationOptions.id, id),
        with: {
            configuration_values: true
        }
    })
}
export const getConfigoptionswithvaluesbyproductid = async (id: number) => {
    return await db.query.configurationOptions.findMany({
        where: (configurationOptions, { eq }) => eq(configurationOptions.product_id, id),
        with: {
            configuration_values: true
        }
    })
}




// quotes
export const createQuote = async (optionvalues: InsertQuote) => {
    return await db.insert(quote).values(optionvalues).returning({
        id: quote.id,
        status: quote.status,
        name: quote.name,
        email: quote.email,
        phone: quote.phone,
        address: quote.address,
        dimensions: quote.dimensions,
        canopyType: quote.canopyType,
        rooffeature: quote.rooffeature,
        timeframe:quote.timeframe,
        wallfeatures: quote.wallfeatures,
        backside: quote.backside,

        price:quote.price,
        status: quote.status,
        additionalfeatures: quote.additionalfeatures,
        installation: quote.installation,
        created_at: quote.created_at,
        updated_at: quote.updated_at,

        roofBlinds: quote.roofBlinds,
        budget: quote.budget
    });
};



export const getQuotes = async (priceToggled: boolean) => {
    let ResponseBody = {
        id: quote.id,

        name: quote.name,
        email: quote.email,
        phone: quote.phone,
        address: quote.address,
        dimensions: quote.dimensions,
        canopyType: quote.canopyType,
        rooffeature: quote.rooffeature,
        timeframe:quote.timeframe,
        wallfeatures: quote.wallfeatures,
        backside: quote.backside,
        status: quote.status,
        additionalfeatures: quote.additionalfeatures,
        installation: quote.installation,
        created_at: quote.created_at,
        updated_at: quote.updated_at,

        roofBlinds: quote.roofBlinds,
        budget: quote.budget,


    }

    if (priceToggled) {
        ResponseBody["price"] = quote.price
    }

    return await db.select({
        ...ResponseBody
    }).from(quote);
};


export const getQuoteById = async (id: number, priceToggled:boolean) => {
    let ResponseBody = {
        id: quote.id,

        name: quote.name,
        email: quote.email,
        phone: quote.phone,
        address: quote.address,
        dimensions: quote.dimensions,
        canopyType: quote.canopyType,
        rooffeature: quote.rooffeature,
        wallfeatures: quote.wallfeatures,
        timeframe:quote.timeframe,
        backside: quote.backside,
        status: quote.status,
        additionalfeatures: quote.additionalfeatures,
        installation: quote.installation,
        created_at: quote.created_at,
        updated_at: quote.updated_at,

        roofBlinds: quote.roofBlinds,
        budget: quote.budget,


    }

    if (priceToggled) {
        ResponseBody["price"] = quote.price
    }

    return await db.select({
        ...ResponseBody
    }).from(quote).where(eq(quote.id, id));
};


export const updateQuote = async (id: number, updatedValues: InsertQuote) => {
    return await db.update(quote).set(updatedValues).where(eq(quote.id, id)).returning({
        id: quote.id,
        status: quote.status
    });
};

export const updateQuoteStatus = async (id: number, status: quoteStatusEnum) => {
    return await db.update(quote).set({
        status: status
    }).where(eq(quote.id, id)).returning({
        id: quote.id,
        status: quote.status
    });
};


export const deleteQuote = async (id: number) => {
    return await db.delete(quote).where(eq(quote.id, id));
};




//config values
export const createConfigValue = async (optionvalues: InsertConfigureOptionValue) => {
    return await db.insert(configurationValues).values(optionvalues).returning({
        id: configurationValues.id,
        option_id: configurationValues.option_id,
        value_name: configurationValues.value_name,
        price_adjustment: configurationValues.price_adjustment,
        created_at: configurationValues.created_at,
        updated_at: configurationValues.updated_at,
    });
};


export const getConfigValues = async () => {
    return await db.select({
        id: configurationValues.id,
        option_id: configurationValues.option_id,
        value_name: configurationValues.value_name,
        price_adjustment: configurationValues.price_adjustment,
        created_at: configurationValues.created_at,
        updated_at: configurationValues.updated_at,
    }).from(configurationValues);
};


export const getConfigValueById = async (id: number) => {
    return await db.select({
        id: configurationValues.id,
        option_id: configurationValues.option_id,
        value_name: configurationValues.value_name,
        price_adjustment: configurationValues.price_adjustment,
        created_at: configurationValues.created_at,
        updated_at: configurationValues.updated_at,
    }).from(configurationValues).where(eq(configurationValues.id, id));
};


export const updateConfigValue = async (id: number, updatedValues: InsertConfigureOptionValue) => {
    return await db.update(configurationValues).set(updatedValues).where(eq(configurationValues.id, id)).returning({
        id: configurationValues.id,
        option_id: configurationValues.option_id,
        value_name: configurationValues.value_name,
        price_adjustment: configurationValues.price_adjustment,
        updated_at: configurationValues.updated_at,
    });
};


export const deleteConfigValue = async (id: number) => {
    return await db.delete(configurationValues).where(eq(configurationValues.id, id));
};


// config settings
export const createConfigSettings = async (optionvalues: InsertConfig) => {
    return await db.insert(ConfigSettings).values(optionvalues).returning({
        id: ConfigSettings.id,
        priceToggle: ConfigSettings.priceToggle,
        created_at: ConfigSettings.created_at,
        updated_at: ConfigSettings.updated_at,
    });
};


export const getConfigSettings = async () => {
    return await db.select({
        id: ConfigSettings.id,
        priceToggle: ConfigSettings.priceToggle,
        created_at: ConfigSettings.created_at,
        updated_at: ConfigSettings.updated_at,
    }).from(ConfigSettings);
};


export const getConfigSettingsById = async (id: number) => {
    return await db.select({
        id: ConfigSettings.id,
        priceToggle: ConfigSettings.priceToggle,
        created_at: ConfigSettings.created_at,
        updated_at: ConfigSettings.updated_at,
    }).from(ConfigSettings).where(eq(ConfigSettings.id, id));
};


export const updateConfigSettings = async (id: number, toggle:boolean) => {
    return await db.update(ConfigSettings).set({
        priceToggle:toggle
    }).where(eq(ConfigSettings.id, id)).returning({
        id: ConfigSettings.id,
        priceToggle: ConfigSettings.priceToggle,
        updated_at: ConfigSettings.updated_at,
    });
};


export const deleteConfigSettings = async (id: number) => {
    return await db.delete(ConfigSettings).where(eq(ConfigSettings.id, id));
};



export const retrieveproducts = async () => {
    return await db.query.products.findMany({
        with: {
            configuration_options: {
                with: {
                    configuration_values: true


                }
            },
            product_images: {
                columns: {
                    image_url: true,
                    image_type: true
                }
            }

        }
    })
}
export const retrieveProductById = async (id: number) => {
    return await db.query.products.findFirst({
        where: (products) => eq(products.id, id),
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
export const updateProduct = async (id: number, data: any) => {
    return await db
        .update(products)
        .set(data)
        .where(eq(products.id, id))
        .returning({
            id: products.id,
            name: products.name,
            description: products.description,
            category_id: products.category_id,
            base_price: products.base_price,
            created_at: products.created_at,
            updated_at: products.updated_at,
        });
};