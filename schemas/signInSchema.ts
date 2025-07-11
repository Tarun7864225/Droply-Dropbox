import * as z from "zod";

export const signInSchema = z.object({
    identifier: z.string().min(10,{message:"Email Required"}).email({message:"Enter a Valid Email"}),
    password: z.string().min(1,{message:"Password Required"}).min(8,{message:"Minimum 8 Characters Required"})
})