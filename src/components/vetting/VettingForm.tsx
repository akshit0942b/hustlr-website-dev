"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryRadio from "./CategoryRadio";
import {
  formSchema,
  GetVettingProgressResponse,
  SupabaseVettingData,
} from "../../lib/schemas/formSchema";
import { CollegeInput } from "./CollegeInput";
import DobInput from "./DobInput";
import { CgpaInput } from "./CgpaInput";
import { NameInput } from "./NameInput";
import { EmailInput } from "./EmailInput";
import { SkillsInput } from "./SkillsInput";
import { LinksInput } from "./LinksInput";
import { Hourglass } from "lucide-react";
import { CollegeYearInput } from "./CollegeYearInput";
import { AwardsInput } from "./AwardsInput";
import UploadFileInput from "./UploadFile";
import { LocationInput } from "./LocationInput";
import { NextRouter } from "next/router";
import { toast } from "sonner";

const steps = [
  { name: "Category Selection", desc: "Tell us what you do best" },
  {
    name: "Tell us about yourself",
    desc: "Share your background and education",
  },
  {
    name: "Experience and Awards",
    desc: "We use this to learn more about your projects and accolades",
  },
];

const stepVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.3 } },
};

export default function VettingForm({
  step,
  setStep,
  email,
  jwtToken,
  vettingProgressResponse,
  setSuccess,
  router,
}: {
  step: number;
  setStep: (s: number) => void;
  email: string;
  jwtToken: string;
  vettingProgressResponse: GetVettingProgressResponse | null;
  setSuccess: (success: boolean) => void;
  router: NextRouter;
}) {
  const [submitting, setSubmitting] = useState(false);

  const stepFields: Record<number, (keyof z.infer<typeof formSchema>)[]> = {
    0: ["category"],
    1: [
      "name",
      "email",
      "dob",
      "college",
      "year",
      "cgpa",
      "transcript",
      "studentId",
      "location",
    ],
    2: ["resume", "linkedin", "github", "skills", "awards"],
  };

  const initialData: Partial<SupabaseVettingData> =
    vettingProgressResponse?.success ? vettingProgressResponse.data : {};

  // console.log("Vetting REsponse rvd in vettingForm: ", initialData);

  const calculteStartingStep = () => {
    if (!initialData) return 0;
    const filledFields = Object.keys(initialData).filter((key) => {
      const value = initialData[key as keyof SupabaseVettingData];
      return (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (Array.isArray(value) ? value.length > 0 : true)
      );
    });
    console.log(
      filledFields,
      filledFields.map((k) => initialData[k as keyof SupabaseVettingData])
    );
    if (filledFields.length >= 8) return 2; // Most fields filled
    if (filledFields.length >= 1) return 1; // Some fields filled
    return 0; // No fields filled
  };

  // useEffect(() => {
  //   if (initialData && setStep) {
  //     setStep(calculteStartingStep());
  //   }
  // }, [initialData]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      category: initialData?.category || "",
      name: initialData?.name || "",
      email: initialData?.email || email,
      college: initialData?.college || "",
      year: initialData?.year || "",
      linkedin: initialData?.linkedin || "",
      github: initialData?.github || "",
      location: initialData?.location || "",
      awards: initialData?.awards || "",
      dob: initialData?.dob ? new Date(initialData.dob) : new Date(),
      cgpa:
        initialData?.cgpa !== undefined && initialData?.cgpa !== null
          ? String(Number(initialData.cgpa).toFixed(2))
          : "",
      skills: initialData?.skills || [],
      resume: initialData?.resume || "",
      transcript: initialData?.transcript || "",
      studentId: initialData?.studentId || "",
    },
  });

  const next = async () => {
    setSubmitting(true);

    const fieldsToValidate = stepFields[step];
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      const formData = form.getValues();
      console.log("form data forntend: ", formData);
      const res = await fetch("/api/application/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Vetting data saved successfully");
        console.log("Vetting data saved successfully");
      } else {
        toast.error("Failed to save vetting data.");
        console.error("error saving vetting data:", data.error);
      }
      if (step < steps.length - 1) {
        setStep(step + 1);
      }
    } else {
      toast.error("Please fix the errors in the form.");
      form.setError("root", { message: "Please fix the errors above." });
    }
    setSubmitting(false);
  };

  const prev = () => {
    if (setStep && typeof step === "number") setStep(Math.max(step - 1, 0));
  };

  const onSubmit = async () => {
    setSubmitting(true);
    const isValid = await form.trigger();
    console.log("hallo submutting");
    if (isValid) {
      const res = await fetch("/api/application/save?final=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(form.getValues()),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        console.log("Vetting data saved successfully");

        setTimeout(() => {
          router.push("/get-started/student/application/status");
        }, 1000);
      } else {
        toast.error("Failed to submit vetting data.");
        console.log("error saving vetting data:", data);
      }
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          toast.error("Please fix the errors in the form.");
          console.log("Form validation errors:", errors);
        })}
        className="space-y-6 font-sans"
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <CategoryRadio form={form} />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-5"
            >
              <NameInput form={form} />
              <EmailInput form={form} />
              <DobInput form={form} />
              <CgpaInput form={form} />
              <CollegeInput form={form} />
              <CollegeYearInput form={form} />
              <LocationInput form={form} />
              <UploadFileInput
                title="Transcript"
                form={form}
                email={email}
                name={"transcript"}
                // preloadedFile={initialData?.preloadedFiles?.transcript}
                jwtToken={jwtToken}
              />
              <UploadFileInput
                title="Student ID"
                form={form}
                email={email}
                name={"studentId"}
                // preloadedFile={initialData?.preloadedFiles?.studentId}
                jwtToken={jwtToken}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col gap-3"
            >
              <UploadFileInput
                title="Resume"
                form={form}
                email={email}
                name={"resume"}
                // preloadedFile={initialData?.preloadedFiles?.resume}
                jwtToken={jwtToken}
              />
              <LinksInput form={form} />
              <SkillsInput
                form={form}
                name="skills"
                label="Technical Skills"
                placeholder="Choose your skills..."
                className="mb-4 font-sans"
              />
              <AwardsInput form={form} />
            </motion.div>
          )}

          {/*step === 3 && (
            <motion.div
              key="step-3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col justify-center items-center"
            >
              <Hourglass className="size-14 mb-5" />
              <p className="text-center text-black font-medium">
                We're reviewing your profile carefully. Only the top candidates
                make it through. Expect to hear back within 1 to 2 working days.
                <br />
                <br />
                Keep an eye on your email, or check back here for updates.
                Hustlr is a curated network of India's top student freelancers.
                If you're selected, you'll move on to the next round — closer to
                becoming part of the top 5 percent.
              </p>
            </motion.div>
          ) */}
        </AnimatePresence>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prev}
            disabled={step === 0}
          >
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={next}>
              {submitting ? "Saving Progress..." : "Next"}
              {/* Next */}
            </Button>
          ) : (
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
