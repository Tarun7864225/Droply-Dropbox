"use client"

import {ThemeProviderProps,ThemeProvider as NextThemeProvide} from "next-themes"
import {ImageKitProvider} from "imagekitio-next"
import { HeroUIProvider } from "@heroui/system"
import * as React from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";
import { createContext, useContext } from "react";

export interface ProviderProps{
    children: React.ReactNode,
    themeProp?:ThemeProviderProps
}

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
    }
}

export const ImageKitAuthContext = createContext<{
    authenticate: () => Promise<{signature: string;token: string;expire: number;}>;
    }>({ authenticate: async () => ({ signature: "", token: "", expire: 0 }) });

export const useImageKitAuth = () => useContext(ImageKitAuthContext);
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

export function Providers({children,themeProp}: ProviderProps){
    const router = useRouter();
    return(
        <HeroUIProvider navigate={router.push}>
            <ImageKitProvider authenticator={authenticator} publicKey = {process.env.NEXT_IMAGEKIT_PUBLIC_KEY || ""} urlEndpoint = {process.env.NEXT_IMAGEKIT_URL_ENDPOINT || ""}>
                <ImageKitAuthContext.Provider value={{ authenticate: authenticator }}>
                    <ToastProvider placement="top-right"/>
                    <HeroUIProvider>{children}</HeroUIProvider>
                </ImageKitAuthContext.Provider>
            </ImageKitProvider>
        </HeroUIProvider>
    )
}