import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { fi } from "zod/v4/locales";

const imagekit = new ImageKit({
    publicKey : process.env.NEXT_IMAGEKIT_PUBLIC_KEY || "",
    privateKey : process.env.NEXT_IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint : process.env.NEXT_IMAGEKIT_URL_ENDPOINT || ""
})

export async function POST(request:NextRequest){
    try {
        const {userId} = await auth()
        if(!userId) return NextResponse.json({error:"Unauthorized"},{status:401})
        const formData = await request.formData()
        const file = formData.get("file") as File
        const formUserId = formData.get("string") as string
        const parentId = formData.get("parentId") as string || null
        if(formUserId !== userId) return NextResponse.json({error:"Unauthorized"},{status:401})
        if(!file) return NextResponse.json({error:"ERROR : NO FILE"},{status:401})
        if(parentId){
            const [parentFolder] = await db.select().from(files).where(and(eq(files.id,parentId),eq(files.userId,userId),eq(files.isFolder,true)))
        } else {
            return NextResponse.json({error:"ERROR : NO PARENT FOLDER"},{status:401})
        }
        if(!file.type.startsWith("image/") && file.type !=="application/pdf") return NextResponse.json({error:"ERROR : ONLY IMAGE AND PDF ALLOWED"},{status:401})
        
        const buffer = await file.arrayBuffer()
        const fileBuffer = Buffer.from(buffer)

        const folderPath = parentId ? `/droply/${userId}/folder/${parentId}` : `/droply/${userId}`
        const originalFilename = file.name 
        const fileExtension = originalFilename.split(".").pop() || ""
        const uniqueFilename= `${uuidv4}.${fileExtension}`
        const uploadResponse = await imagekit.upload({
            file:fileBuffer,
            fileName:uniqueFilename,
            folder:folderPath,
            useUniqueFileName:false
        })
        const fileData = {
            name:originalFilename,
            path:uploadResponse.filePath,
            size:file.size,
            type:file.type,
            fileUrl:uploadResponse.url,
            thumbnailUrl:uploadResponse.thumbnailUrl,
            userId:userId,
            parentId:parentId,
            isFolder:false,
            isStarred:false,
            isTrash:false
        }
        const [newfile] = await db.insert(files).values(fileData).returning()
        return NextResponse.json(newfile)

    } catch (error) {
        return NextResponse.json({error:"ERROR : FILE UPLOAD"},{status:401})
    }
}