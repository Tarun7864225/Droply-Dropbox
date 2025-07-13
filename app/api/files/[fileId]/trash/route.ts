import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(request:NextRequest,props:{params: Promise<{fileId:string}>}){
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const {fileId} = await props.params
        if(!fileId) return NextResponse.json({ error: "FILEID REQUIRED" }, { status: 401 });
        const [file] = await db.select().from(files).where(and(eq(files.id,fileId),eq(files.userId,userId)))
        if(!file) return NextResponse.json({ error: "FILE NOT FOUND" }, { status: 401 });

        const updatedFiles = await db.update(files).set({isTrash:!file.isTrash}).where(and(eq(files.id,fileId),eq(files.userId,userId))).returning()
        console.log(updatedFiles)
        const updatedFile = updatedFiles[0]
        return NextResponse.json(updatedFile);

    } catch (error) {
        return NextResponse.json({ error: "FAILED TO UPDATE THE FILE" }, { status: 401 });
    }
}