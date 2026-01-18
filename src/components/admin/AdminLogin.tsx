"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "@/src/lib/firebaseClient";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Nav from "../Nav";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginWithEmail = async (data: FormValues) => {
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const idToken = await userCred.user.getIdToken();

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Logged in as admin!");
        router.push("/admin");
      } else {
        toast.error(json.error || "Login failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Logged in as admin!");
        router.push("/admin");
      } else {
        toast.error(json.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-screen-sm mx-auto">
          <CardHeader>
            <CardTitle className="text-4xl text-center">hustlr.</CardTitle>
            <CardDescription className="font-sans text-center text-base">
              Admin Login - Only authorized admins can access
            </CardDescription>
          </CardHeader>

          <CardContent className="font-sans">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(loginWithEmail)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@example.com"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login with Email"}
                </Button>
              </form>
            </Form>

            <Separator className="my-4" />

            {/* <Button
              onClick={loginWithGoogle}
              variant="outline"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Redirecting..." : "Login with Google"}
            </Button> */}
          </CardContent>

          <CardFooter>
            <p className="text-xs text-muted-foreground mx-auto">
              Only authorized admins can access
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
