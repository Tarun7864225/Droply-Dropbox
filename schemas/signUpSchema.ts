import * as z from "zod";

export const signUpSchema = z.object({
    email: z.string().min(10,{message:"Email Required"}).email({message:"Enter a Valid Email"}),
    password: z.string().min(1,{message:"Password Required"}).min(8,{message:"Minimum 8 Characters Required"}),
    passwordConfirmation: z.string().min(1,{message:"Confirm Password"})
}).refine((data)=>data.password === data.passwordConfirmation ,{ message:"Enter the same Password", path:["passwordConfiguration"] })