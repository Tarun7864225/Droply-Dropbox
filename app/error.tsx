"use client"

import { useEffect } from "react"

export default function({error,reset}:{error:Error;reset:()=>void}){
    useEffect(()=>{console.log(error)},[error]);
    return(
        <>
            <h2>Something went wrong!</h2>
            <button onClick={()=>reset()}>Try Again</button>
        </>
    )
}