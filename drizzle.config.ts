import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({path:".env.local"})
if(!process.env.URL) throw new Error("Error : URL")

export default defineConfig({
    schema: './lib/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.URL!,
    },
    migrations:{
        table:"__drizzle_migration",
        schema:"public"
    },
    verbose:true,
    strict:true
});
