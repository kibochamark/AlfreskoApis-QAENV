"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const router_1 = __importDefault(require("./router"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const connection_1 = __importDefault(require("./utils/connection"));
const HasherPassword_1 = require("./utils/HasherPassword");
const schema_1 = require("./db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("./db");
const auth_1 = require("./controllers/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({ secret: 'your-session-secret', resave: false, saveUninitialized: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ credentials: true }));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", router_1.default);
app.get('/auth/google', (req, res, next) => {
    const role = req.query.role ? encodeURIComponent(req.query.role) : '2';
    passport_1.default.authenticate('google', { scope: ['profile', 'email'], state: role })(req, res, next);
});
app.get('/auth/google/callback', auth_1.googlecallback);
// Local Strategy
passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    console.log(email);
    try {
        console.log(email);
        const user = await connection_1.default.select({ password: schema_1.users.password, id: schema_1.users.id, email: schema_1.users.email, company_id: schema_1.users.company_id }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        console.log(user);
        if (!user[0]?.email)
            return done(null, false, { message: 'Incorrect email.' });
        const isValid = await (0, HasherPassword_1.checkPassword)(password, user[0]?.password);
        if (!isValid)
            return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
// Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
}, async (req, token, tokenSecret, profile, done) => {
    try {
        // console.log(req.query)
        let user = await connection_1.default.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, profile.emails[0].value));
        if (!user.length) {
            const role = req.query.state || 1;
            let newUser = await connection_1.default.insert(schema_1.users).values({
                email: profile.emails[0].value,
                profile_id: null,
                role_id: parseInt(role),
                password: '',
                salt: ''
            }).returning({
                id: schema_1.users.id,
                email: schema_1.users.email,
                profile: schema_1.users.profile_id,
                created_at: schema_1.users.created_at,
                updated_at: schema_1.users.updated_at
            });
            return done(null, newUser[0]);
        }
        else {
            return done(null, user[0]);
        }
    }
    catch (err) {
        return done(err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user?.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await (0, db_1.getUser)(id); // Assuming this function correctly retrieves user details by ID
        done(null, user); // Pass retrieved user object to done callback
    }
    catch (err) {
        done(err); // Handle error if user retrieval fails
    }
});
// const server =http.createServer(app)
// server.listen(process.env.PORT || 8000, () => {
//     console.log(`Server is running on port ${process.env.PORT || 8000}`)
// })
app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
});
exports.default = app;
//# sourceMappingURL=index.js.map