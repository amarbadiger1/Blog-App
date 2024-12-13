"use client"
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod"

const signinSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function Signin() {
    const router = useRouter();
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);
    const { isLoaded, signIn, setActive } = useSignIn();


    const handlesubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const result = signinSchema.safeParse(data);
        if (!result.success) {
            toast.error(result.error.errors[0].message);
            setLoading(false);
            return;
        }

        if (!isLoaded) {
            toast.error("Authentication service is not loaded. Try again.");
            setLoading(false);
            return;
        }

        try {
            await signIn.create({
                identifier: data.email,
            })

            const completeSignin = await signIn.attemptFirstFactor({ strategy: "password", password: data.password })

            if (completeSignin.status === "complete") {
                await setActive({ session: completeSignin.createdSessionId });
                toast.success("Sign-In complete. Redirecting...");
                router.push("/");
            } else {
                toast.error("Verification failed. Check the code and try again.");
            }
        } catch (error: any) {
            console.error("Sign-up error:", JSON.stringify(error.errors[0].message, null, 2));
            toast.error(error.errors[0].message);
        } finally {
            setLoading(false);
        }
    }

    // Google Auth Handler
    const handleGoogleSignIn = async () => {
        if (!isLoaded) {
            toast.error("Authentication service is not loaded. Try again.");
            return;
        }

        try {
            // Trigger Google OAuth
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/',
            });
        } catch (error: any) {
            console.error("Google OAuth error:", JSON.stringify(error.errors[0].message, null, 2));
            toast.error("Failed to sign in with Google.");
        }
    };
    return (
        <div className="flex items-center justify-center h-screen ">
            <form className="flex flex-col bg-zinc-900 p-10 rounded-md gap-4 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-200  rounded-tl-[70px] rounded-br-[80px] z-10"
                onSubmit={handlesubmit}
            >
                <div>
                    <h1 className="text-2xl">SignIn</h1>
                    <p className="text-neutral-500 text-sm">Registered user Signin here</p>
                </div>
                <div className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email">Email</label> <br />
                        <input type="text" placeholder="Enter Email" className="bg-neutral-500 outline-none p-2 rounded-xl hover:shadow-lg hover:shadow-slate-300"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            id="email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label> <br />
                        <input type="password" placeholder="Enter Password" className="bg-neutral-500 outline-none p-2 rounded-xl hover:shadow-lg hover:shadow-slate-300"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            id="password"
                        />
                    </div>
                    <div>
                        <button type="submit" className=" bg-neutral-500 hover:bg-neutral-800 transition ease-in-out duration-200 p-2 rounded-xl min-w-full "> {loading ? "Submitting..." : "Submit"}</button>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="bg-blue-500 hover:bg-blue-700 transition ease-in-out duration-200 p-2  text-xs rounded-xl min-w-full  text-white"
                        >
                            SignIn with Google
                        </button>
                    </div>
                </div>
                <p className="text-neutral-500 hover:text-neutral-300 cursor-pointer text-sm text-center"><Link href={"/auth/signup"}>Not yet Registered</Link></p>
            </form>
        </div >
    );
}