import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SplashScreen from "../Components/SplashScreen"


export default function Home(){
    const[loading,SetLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            SetLoading(false);
            router.push("/login")
        },2000)
    },[router])

    return loading ? <SplashScreen /> : null;
}