import { Button } from "@/components/ui/button";
import Nav from "@/src/components/Nav";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
// ?message=Oops_It_seems_the_link_has_expired!
export default function ErrorPage() {
  const router = useRouter();
  const message =
    typeof router.query.message === "string"
      ? decodeURIComponent(router.query.message.replace(/_/g, " "))
      : null;

  return (
    <>
      <Nav />
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#111] text-white px-4">
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-lg mb-8">
          {message
            ? message
            : "Sorry, There was some unexpected error with your request."}
        </p>

        <Button
          className="bg-accentPurple text-gray-900 font-sans hover:text-gray-100"
          asChild
        >
          <Link href="/">
            {" "}
            <ArrowLeft /> Go Back Home
          </Link>
        </Button>
      </div>
    </>
  );
}
