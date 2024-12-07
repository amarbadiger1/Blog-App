"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "react-toastify";
import { z } from "zod";

// Zod schema for form validation
const registrationSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function Signup() {
    const router = useRouter();
    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const { isLoaded, signUp, setActive } = useSignUp();

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validate form fields
        const result = registrationSchema.safeParse(data);
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
            // Create a new user
            await signUp.create({
                username: data.username,
                emailAddress: data.email,
                password: data.password,
            });

            // Prepare for email verification
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setPendingVerification(true);
            toast.success("Verification email sent. Check your inbox.");
        } catch (error: any) {
            console.error("Sign-up error:", JSON.stringify(error, null, 2));
            toast.error("Something went wrong during sign-up.");
        } finally {
            setLoading(false);
        }
    };

    // Handle email verification
    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!isLoaded) {
            toast.error("Authentication service is not loaded. Try again.");
            setLoading(false);
            return;
        }

        try {
            const completeSignup = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignup.status === "complete") {
                await setActive({ session: completeSignup.createdSessionId });
                toast.success("Sign-up complete. Redirecting...");
                router.push("/");
            } else {
                toast.error("Verification failed. Check the code and try again.");
            }
        } catch (error: any) {
            console.error("Verification error:", JSON.stringify(error, null, 2));
            toast.error("Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Google Auth Handler
    const handleGoogleSignIn = async () => {
        if (!isLoaded) {
            toast.error("Authentication service is not loaded. Try again.");
            return;
        }

        try {
            // Trigger Google OAuth
            await signUp.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/',
            });
        } catch (error: any) {
            console.error("Google OAuth error:", JSON.stringify(error, null, 2));
            toast.error("Failed to sign in with Google.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            {!pendingVerification ? (
                <form
                    className="flex flex-col bg-zinc-900 p-10 rounded-md gap-4 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-200 rounded-tl-[70px] rounded-br-[80px]"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <h1 className="text-2xl">Sign Up</h1>
                        <p className="text-neutral-500 text-sm">Register a new user</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="username">Username</label> <br />
                            <input
                                type="text"
                                placeholder="Enter username"
                                className="bg-neutral-500 outline-none p-2 rounded-xl hover:shadow-lg hover:shadow-slate-300"
                                value={data.username}
                                onChange={(e) =>
                                    setData({ ...data, username: e.target.value })
                                }
                                id="username"
                                aria-label="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label> <br />
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="bg-neutral-500 outline-none p-2 rounded-xl hover:shadow-lg hover:shadow-slate-300"
                                value={data.email}
                                onChange={(e) =>
                                    setData({ ...data, email: e.target.value })
                                }
                                id="email"
                                aria-label="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label> <br />
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="bg-neutral-500 outline-none p-2 rounded-xl hover:shadow-lg hover:shadow-slate-300"
                                value={data.password}
                                onChange={(e) =>
                                    setData({ ...data, password: e.target.value })
                                }
                                id="password"
                                aria-label="Password"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className={`bg-neutral-500 hover:bg-neutral-800 transition ease-in-out duration-200 p-2 rounded-xl min-w-full ${loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                        {/* Google Sign-In Button */}
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
                    <p className="text-neutral-500 hover:text-neutral-300 cursor-pointer text-sm text-center">
                        <Link href="/auth/signin">Already registered? Sign In</Link>
                    </p>

                </form>
            ) : (
                <form
                    className="flex flex-col bg-zinc-900 p-10 rounded-md gap-4 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-200 rounded-tl-[70px] rounded-br-[80px]"
                    onSubmit={handleVerification}
                >
                    <div>
                        <h1 className="text-2xl">Verify Email</h1>
                        <p className="text-neutral-500 text-sm">
                            Enter the code sent to your email
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Enter verification code"
                            className="bg-neutral-500 outline-none p-2 rounded-sm hover:shadow-lg hover:shadow-slate-300"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            aria-label="Verification Code"
                        />
                        <button
                            type="submit"
                            className={`bg-neutral-500 hover:bg-neutral-800 transition ease-in-out duration-200 p-2 rounded-md min-w-full rounded-br-[80px] ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
