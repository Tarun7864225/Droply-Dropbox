import {pgTable, text, uuid, boolean, integer, timestamp} from "drizzle-orm/pg-core"
import {relations} from "drizzle-orm"

export const files = pgTable("Files",{
    // file info
    id:uuid("id").defaultRandom().primaryKey(),
    name:text("name").notNull(),
    path:text("path").notNull(),
    size:integer("size").notNull(),
    type:text("type").notNull(),
    // storage info
    fileUrl:text("URL").notNull(),
    thumbnailUrl:text("thumbnail_url"),

    // ownership
    userId:text("user_id").notNull(),
    parentId:uuid("parent_id"),

    // Flags
    isFolder:boolean("is_folder").default(false).notNull(),
    isStarred:boolean("is_starred").default(false).notNull(),
    isTrash:boolean("is_trash").default(false).notNull(),

    // Timestamp
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull()
})

export const filesRelation = relations(files, ({one,many})=>({
    //Parent: Each file/folder can have one parent
    parent:one(files,{
        fields:[files.parentId],
        references: [files.id]
    }),
    //Children: Each folder can have many childern files/folders
    children:many(files)
}))

// Type
export const File = typeof files.$inferSelect
export const NewFile = typeof files.$inferInsert

