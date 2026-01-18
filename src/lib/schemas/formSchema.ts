import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  category: z.string().min(1, "A category is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  college: z.string().min(1, "College is required"),
  dob: z
    .date({ required_error: "Date of birth is required" })
    .min(new Date("1900-01-01"), "Date of birth is too far in the past")
    .refine(
      (date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const m = today.getMonth() - date.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
          return age - 1 >= 18;
        }
        return age >= 18;
      },
      { message: "You must be at least 18 years old" }
    ),
  cgpa: z
    .string()
    .refine((val) => /^\d+\.\d+$/.test(val), {
      message: "CGPA must include a decimal point (e.g., 8.25)",
    })
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num >= 6 && num <= 10;
      },
      {
        message: "CGPA must be between 6 and 10",
      }
    ),

  year: z.string().min(1, "Year is required"),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  awards: z.string().max(200, "Max 200 characters"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  studentId: z.string().min(1, "Student ID is required"),
  resume: z.string().min(1, "Resume is required"),
  transcript: z.string().min(1, "Transcript is required"),
});

export type UploadFormFields = z.infer<typeof formSchema>;
export type FormFieldProp = UseFormReturn<UploadFormFields>;

export type PreloadedFileInfo = {
  name: string;
  size: number;
  url: string;
};

export type SupabaseVettingData = {
  // first round details
  email: string;
  name: string;
  category: string;
  college: string;
  year: string;
  dob: string;
  cgpa: number;
  linkedin?: string;
  github?: string;
  location: string;
  awards?: string;
  skills: string[];
  resume?: string;
  transcript?: string;
  studentId?: string;
  /* TODO: Migrate isComplete also to status */
  isComplete?: boolean; // tells if stage one is completed
  // used to determine application status
  status?: ApplicationStatus;
  currentStage?: number;
  // second round details
  selectedProjectSanityId?: JSON;
  videoLink?: string;
  otherLinks?: string;
  projectDeadline: string;
};

export type ApplicationStatus =
  | "not_completed"
  | "under_review" // means round 1 - submitted for review
  | "round_2_eligible" // means round 1 was accepted
  | "round_2_project_selected" // means round 2 project was selected
  | "round_2_under_review" // means round 2 project was submitted for review
  // verbose enough
  | "accepted" // both rounds were accepted and onboarding completed
  | "rejected";

export type Stage2Data = {
  email: string;
  status?: ApplicationStatus;
  currentStage: number;
  selectedProjectSanityId: string;
  videoLink?: string;
  otherLinks?: string;
};

export type Stage2ProjectSubmit = {
  status: ApplicationStatus;
  videoLink: string;
  otherLinks?: string;
};

export type GetVettingProgressResponse =
  | { success: true; data: SupabaseVettingData }
  | { success: false };
