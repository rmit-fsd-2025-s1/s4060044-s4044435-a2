import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SplashScreen from "../components/SplashScreen"


export default function Default(){
    const[loading,SetLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            SetLoading(false);
            router.push("/loginForm")
        },2000)
    },[router])

    return loading ? <SplashScreen /> : null;
}