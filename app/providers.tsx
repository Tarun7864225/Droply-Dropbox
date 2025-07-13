"use client"

import {ThemeProviderProps,ThemeProvider as NextThemeProvide} from "next-themes"
import {ImageKitProvider} from "imagekitio-next"
import { HeroUIProvider } from "@heroui/system"

const authenticator = async() => {
    try {
        const response = await fetch("/api/imagekit-auth")
        const data = await response.json()
        return data
    } catch (error) {
        console.error("AUTH ERROR",error)
        throw error;
    }
}

export interface ProviderProps{
    children: React.ReactNode,
    themeProp?:ThemeProviderProps
}

export function Providers({children,themeProp}: ProviderProps){
    return(
        <ImageKitProvider authenticator={authenticator} publicKey = {process.env.NEXT_IMAGEKIT_PUBLIC_KEY || ""} urlEndpoint = {process.env.NEXT_IMAGEKIT_URL_ENDPOINT || ""}>
            <HeroUIProvider>{children}</HeroUIProvider>
        </ImageKitProvider>
    )
}