"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema = __importStar(require("../db/schema"));
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// })
// import { Pool } from '@neondatabase/serverless';
// const pool = new Pool({ connectionString: "postgresql://blog_owner:cvQlHMJK0L2T@ep-cold-dust-a5ex9ahi.us-east-2.aws.neon.tech/blog?sslmode=require" });
// const db = drizzle(pool)
// const sql = neon("postgresql://blog_owner:cvQlHMJK0L2T@ep-cold-dust-a5ex9ahi.us-east-2.aws.neon.tech/blog?sslmode=require");
// const db = drizzle(sql, {schema:schema});
// const sql= neon("postgresql://neondb_owner:30WYKdxVMhnQ@ep-rapid-snow-a26ly6wq-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require")
// const db = drizzle(sql, {schema:schema});
// const db = drizzle(pool)
// import { Pool } from "pg";
const pool = new pg_1.Pool({
    connectionString: "postgresql://neondb_owner:30WYKdxVMhnQ@ep-rapid-snow-a26ly6wq-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require",
});
// or
// const pool = new Pool({
//   host: "127.0.0.1",
//   port: 5432,
//   user: "postgres",
//   password: "kibo1215",
//   database: "Configurator",
// });
const db = (0, node_postgres_1.drizzle)(pool, { schema: schema });
exports.default = db;
//# sourceMappingURL=connection.js.map