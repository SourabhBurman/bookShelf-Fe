"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BookOpen, Mail, Lock } from "lucide-react";
import { Field, Form, useForm } from "@formisch/react";
import * as v from "valibot";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "nextjs-toploader/app";
import { useGetUserLazyQuery } from "@/graphql/user/hooks";

const loginSchema = v.object({
  email: v.pipe(
    v.string("Email is required"),
    v.email("Invalid email address"),
  ),
  password: v.pipe(
    v.string("Password is required"),
    v.minLength(3, "Password must be at least 6 characters"),
  ),
});

type LoginSchemaType = v.InferInput<typeof loginSchema>;

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { getUser } = useGetUserLazyQuery();

  const loginForm = useForm({
    schema: loginSchema,
  });

  const handleFormSubmit = async (response: LoginSchemaType) => {
    setIsLoading(true);
    const { email, password } = response;
    try {
      setErrorMessage("");
      const { login } = await import("@/services/authServices");
      const res = await login(email, password);
      const userData = await getUser();
      if (userData?.data?.getUser) {
        setUser(userData.data.getUser);
      }

      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-zinc-400 animate-pulse text-sm">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50 overflow-hidden font-sans selection:bg-purple-500/30 items-center justify-center relative">
      {/* Background Effects matching landing page */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] mix-blend-screen pointer-events-none" />

      <div
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>

      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
        <Link
          href="/"
          className="flex items-center text-sm font-medium text-zinc-300 hover:text-white transition-all duration-300 group hover:-translate-x-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md px-4 z-10 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-in-out fill-mode-both">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center shadow-inner pt">
            <BookOpen className="h-6 w-6 text-purple-400" />
          </div>
        </div>

        <Card className="bg-zinc-900/70 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden relative">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Enter your email and password to sign in
            </CardDescription>
          </CardHeader>

          <Form of={loginForm} onSubmit={handleFormSubmit}>
            <CardContent className="space-y-5 pb-4">
              <Field of={loginForm} path={["email"]}>
                {(field) => (
                  <div className="space-y-2 group">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-zinc-300 transition-colors group-focus-within:text-purple-400"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        {...field.props}
                        value={field.input ?? ""}
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className={`pl-10 bg-zinc-950/50 border-white/10 text-white placeholder:text-zinc-500 transition-all duration-300 focus:bg-zinc-950 focus:border-purple-500/50 focus:ring-purple-500/20 ${
                          field.errors || errorMessage
                            ? "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20"
                            : ""
                        }`}
                      />
                    </div>
                    {field.errors && (
                      <p className="text-xs font-medium text-rose-400 animate-in slide-in-from-top-1 fade-in duration-300">
                        {field.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </Field>

              <Field of={loginForm} path={["password"]}>
                {(field) => (
                  <div className="space-y-2 group">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-zinc-300 transition-colors group-focus-within:text-purple-400"
                      >
                        Password
                      </Label>
                      <Link
                        href="#"
                        className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        {...field.props}
                        value={field.input ?? ""}
                        id="password"
                        type="password"
                        className={`pl-10 bg-zinc-950/50 border-white/10 text-white transition-all duration-300 focus:bg-zinc-950 focus:border-purple-500/50 focus:ring-purple-500/20 ${
                          field.errors || errorMessage
                            ? "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20"
                            : ""
                        }`}
                      />
                    </div>
                    {field.errors && (
                      <p className="text-xs font-medium text-rose-400 animate-in slide-in-from-top-1 fade-in duration-300">
                        {field.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </Field>

              {errorMessage && (
                <div className="text-sm font-medium text-rose-400 animate-in fade-in slide-in-from-top-1 pt-2">
                  {errorMessage}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-5 pt-4 bg-zinc-900/70 border-white/10 backdrop-blur-xl">
              <Button
                type="submit"
                className="w-full h-11 bg-purple-500 hover:bg-purple-600 text-white font-semibold transition-all shadow-lg hover:shadow-purple-500/25 border-none"
                disabled={isLoading}
              >
                Sign In
              </Button>
              <div className="text-center text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-purple-400 hover:text-purple-300 transition-colors underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Form>
        </Card>
      </div>
    </div>
  );
}
