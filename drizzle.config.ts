import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:30WYKdxVMhnQ@ep-rapid-snow-a26ly6wq-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require",
  },
});
