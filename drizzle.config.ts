import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({path:".env"})
if(!process.env.NEON_URL) throw new Error("Error : URL")

export default defineConfig({
    schema: './lib/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.NEON_URL!,
    },
    migrations:{
        table:"__drizzle_migration",
        schema:"public"
    },
    verbose:true,
    strict:true
});
