import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_kzBLcCPDIl96@ep-delicate-glitter-a8lmlqrw-pooler.eastus2.azure.neon.tech/Alfresko-test-db?sslmode=require",
  },
});
