"use client"

import { signInSchema } from "@/schemas/signInSchema"
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

export default function signInForm(){
    const router = useRouter()
    const {signIn, isLoaded, setActive} = useSignIn()
    const [isSubmitting,setIsSubmitting] = useState(false)
    const [authError,setAuthError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:"",
            password:"",
        }
    })

    const onSubmit = async(data: z.infer<typeof signInSchema>) => {
    if(!isLoaded) return;
    setIsSubmitting(true)
    setAuthError(null)
    try {
        const result = await signIn.create({
            identifier:data.identifier,
            password:data.password
        })
        if(result.status === "complete") await setActive({session:result.createdSessionId})
        else setAuthError("Sign-In Error")
        
    } catch (error:any) {
        console.log("SignIn Error :",error)
        setAuthError(error.errors?.[0]?.message || "SIGN-IN ERROR")
    } finally { setIsSubmitting(false) }

    }

    return(
        <>

        </>
    )
}