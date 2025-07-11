"use client"
import {useForm} from "react-hook-form"
import {useSignUp} from "@clerk/nextjs";
import {z} from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "inspector/promises";
import { useRouter } from "next/navigation";
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";

export default function SignUpForm(){
    const [verifiying,setverifiying] = useState(false)
    const {signUp, isLoaded, setActive} = useSignUp()
    const [isSubmitting,setIsSubmitting] = useState(false)
    const [authError,setAuthError] = useState<string | null>(null)
    const [verificationerror,setVerificaitionerror] = useState<string | null>(null)
    const [verificationCode,setVerificationCode] = useState("")
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            email:"",
            password:"",
            passwordConfirmation:""
        }
    })

    const onSubmit = async(data:z.infer<typeof signUpSchema>) => {
        if(!isLoaded) return;
        setIsSubmitting(true)
        setAuthError(null)

        try {
            await signUp.create({
                emailAddress:data.email,
                password:data.password
            })
            await signUp.prepareEmailAddressVerification({
                strategy:"email_code"
            })
            setverifiying(true)
        } catch (error:any) {
            console.log("SignUp Error :",error)
            setAuthError(error.errors?.[0]?.message || "SIGNUP ERROR")
        } finally { setIsSubmitting(false) }
    }

    const handleVerificationSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!isLoaded || !signUp) return;
        setIsSubmitting(true)
        setAuthError(null)
        try {
            const result = await signUp.attemptEmailAddressVerification({code:verificationCode})
            console.log(result)
            if(result.status === "complete"){
                await setActive({session:result.createdSessionId})
                router.push("/dashboard")
            } else console.error("Verification Error:", result)
        } catch (error:any) {
            console.error("Verification Error:", error)
            setVerificaitionerror(error.errors?.[0]?.message || "VERIFICATION ERROR")
        } finally {setIsSubmitting(false)}
    }

    if(verifiying){
        return(
            <h1>Enter OTP</h1>
        )
    }
    return(<h1>Sign Up Form</h1>)
};