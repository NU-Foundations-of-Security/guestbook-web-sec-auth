"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Auth () {
    const router = useRouter();
    useEffect(() => {
        if (window.localStorage.getItem("guestbook-jwt"))
            router.replace("/home");
        else
            router.replace("/login");
    })
}