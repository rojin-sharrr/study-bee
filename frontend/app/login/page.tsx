"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services";
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async () => {
    try {
      setError("");
      const response = await AuthService.login({
        email,
        password,
      });

      if(!response){
        throw new Error("Error Authenticating User")
      }

      if (response) {
        router.push("/");
      }
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        console.error("Error response:", error.message);
        setError(error.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={submitHandler}>Login</Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
