"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const formSchema = z.object({
  videoLink: z
    .string()
    .url("Must be a valid URL")
    .includes("drive.google.com", { message: "Must be a Google Drive link" }),
  otherLinks: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProjectSubmissionForm({
  email,
  jwtToken,
}: {
  email: string;
  jwtToken: string;
}) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoLink: "",
      otherLinks: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/project/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          email,
          videoLink: data.videoLink,
          otherLinks: data.otherLinks
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("Project submitted successfully!");
      router.push("/get-started/student/application/status");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="videoLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Drive Video Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://drive.google.com/..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-sm font-medium text-gray-600">
                  Please Attach a video of you explaining the project and work
                  you've done. <br /> Ensure the link is viewable by anyone.
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otherLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Links and description (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Figma, GitHub, etc. — comma separated, or perhaps a short description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit Project
          </Button>
        </form>
      </Form>
    </>
  );
}
