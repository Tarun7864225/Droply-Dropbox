import * as dotenv from 'dotenv';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { drizzle } from 'drizzle-orm/neon-http';
import {neon} from "@neondatabase/serverless"

dotenv.config({path:".env"})
if(!process.env.NEON_URL) throw new Error("URL not found!")

async function runMigration() {
    try {
        const sql = neon(process.env.NEON_URL!);
        const db = drizzle(sql);
        await migrate(db,{migrationsFolder:"./drizzle"})
        console.log("Migration done successfully")
    } catch (error) {
        console.log("Migration Error :", error);
        process.exit(1)
    }
}

runMigration()