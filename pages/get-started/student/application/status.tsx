import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Nav from "@/src/components/Nav"; // your Nav component
import { motion } from "framer-motion";
import {
  ArrowRight,
  ClipboardList,
  Hourglass,
  ListTodo,
  LogOut,
  MessageSquareWarning,
  Star,
  UserCheck,
  UserLock,
  UserX,
} from "lucide-react";
import TimelineDots from "@/src/components/Timeline";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApplicationStatus } from "@/src/lib/schemas/formSchema";
import { CountdownTimer } from "@/src/components/stage2/CountdownTimer";
import { toast } from "sonner";

const stepVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.3 } },
};

type ApplicationResponses = ApplicationStatus | "not_found" | "unauthorized";

export default function CheckApplicationStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ApplicationResponses | null>(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/application/status");
        const data = await res.json();

        if (res.status === 401) {
          setStatus("unauthorized");
          toast.error("Unauthorized! Please login to view application status!");
        } else if (res.status === 404 || data.status === "not_found") {
          console.log(data);
          toast.error("User not found with the given email!");
          setStatus("not_found");
          setEmail(data.email);
          // router.push("/get-started/student/vetting");
        } else {
          setStatus(data.status as ApplicationResponses);
        }
      } catch (err) {
        console.error("Error checking status:", err);
        setStatus("unauthorized");
        toast.error("Unauthorized! Please login to view application status!");
      }
    };

    checkStatus();
  }, [router]);

  const getStatusMessage = () => {
    switch (status) {
      case "not_found":
        return {
          heading: "No application found!",
          subtext: (
            <motion.div
              key="step-not-found"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col justify-center items-center"
            >
              <UserLock className="size-16 mb-4" />
              <p className="text-lg font-serif text-black text-center">
                No registered application was found with the email:
                <br />
                <strong>{email}</strong>
                <br />
                Please check your email ID or start a new application.
              </p>
              <div className="mt-10 flex flex-col md:flex-row gap-4 items-center">
                <Link
                  href={"/get-started/student/application"}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
                >
                  Proceed to Form
                </Link>
                <Button
                  className="bg-gray-100 border border-black/10 text-black hover:border-black"
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    router.push("/get-started/");
                  }}
                >
                  <LogOut className="mr-2" /> Sign Out
                </Button>
              </div>
            </motion.div>
          ),
          color: "text-red-900",
        };

      case "unauthorized":
        return {
          heading: "Unauthorized Access",
          subtext: (
            <motion.div
              key="step-unauthorized"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col justify-center items-center"
            >
              <MessageSquareWarning className="size-16 mb-4" />
              <p className="text-lg text-black text-center font-medium">
                You are not logged in!
                <br />
                Please log in with your registered email to continue.
              </p>
            </motion.div>
          ),
          color: "text-black",
        };

      case "accepted":
        return {
          heading: "Congratulations, you're in!",
          subtext: (
            <motion.div
              key="step-accepted"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col justify-center items-center"
            >
              <UserCheck className="size-16 mb-4" />
              <p className="text-lg font-serif text-black text-center">
                You are officially part of the top 5% of student freelancers in
                India.
                <br />
                You may now log in to the mobile app.
                <br />
                <br />
                You've proven your skills and mindset — now it's time to shine.
                <br />
                <span className="font-semibold">
                  The Hustlr journey has just begun.
                </span>
              </p>
            </motion.div>
          ),
          color: "text-green-800",
        };

      case "rejected":
        return {
          heading: "Application Rejected",
          subtext: (
            <motion.div
              key="step-rejected"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col justify-center items-center"
            >
              <UserX className="size-16 mb-4" />
              <p className="text-lg font-serif text-black text-center">
                We received many exceptional applications, and unfortunately, we
                couldn't move forward with yours this time.
                <br />
                <br />
                Many of our top Hustlrs succeeded on their second or third try.
                <br />
                <br />
                <span className="font-semibold">
                  Keep learning, keep building — the Hustlr journey isn't over.
                </span>
              </p>
            </motion.div>
          ),
          color: "text-black",
        };

      case "not_completed":
        return {
          heading: "Form Incomplete",
          subtext: (
            <motion.div
              key="step-not-completed"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col justify-center items-center"
            >
              <ClipboardList className="size-16 mb-4" />
              <p className="text-lg text-black font-medium text-center">
                You have started the application but haven't completed all
                steps.
                <br />
                Click below to resume and complete your form.
              </p>
              <Link
                href="/get-started/student/application/stage1"
                className="mt-4 bg-black text-white px-5 py-2 rounded hover:bg-gray-900"
              >
                Resume Form
              </Link>
            </motion.div>
          ),
          color: "text-yellow-800",
        };

      case "round_2_eligible":
        return {
          heading: "Round 1 Cleared",
          subtext: (
            <motion.div
              key="step-round2-eligible"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col justify-center items-center"
            >
              <Star className="size-16 mb-4" />
              <p className="text-lg text-black font-medium text-center">
                You've cleared the first stage and are eligible for Round 2.
                <br />
                Proceed to select and begin your test project.
              </p>
              <Link
                href="/get-started/student/application/stage2"
                className="mt-4 bg-teal-700 text-white px-5 py-2 rounded hover:bg-teal-900"
              >
                Start Round 2
              </Link>
            </motion.div>
          ),
          color: "text-teal-800",
        };

      case "round_2_project_selected":
        return {
          heading: "Round 2 - Project Selected",
          subtext: (
            <motion.div
              key="step-project-selected"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col justify-center items-center"
            >
              <ListTodo className="size-16 mb-4" />
              <p className="text-lg text-black font-medium text-center">
                You have selected your Round 2 project.
                <br />
                Submit your deliverables before the deadline.
              </p>
            </motion.div>
          ),
          color: "text-slate-800",
        };

      case "round_2_under_review":
        return {
          heading: "Project Under Review",
          subtext: (
            <motion.div
              key="step-round2-review"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col justify-center items-center"
            >
              <Hourglass className="size-16 mb-4" />
              <p className="text-lg text-black text-center font-medium">
                Your project has been submitted successfully.
                <br />
                Our team is reviewing it carefully.
                <br />
                You'll hear back within 2-3 working days.
              </p>
            </motion.div>
          ),
          color: "text-indigo-800",
        };

      default:
        return {
          heading: "Application Submitted",
          subtext: (
            <motion.div
              key="step-default"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col justify-center items-center"
            >
              <Hourglass className="size-16 mb-5" />
              <p className="text-lg text-black text-center font-medium">
                We're reviewing your application.
                <br />
                Expect to hear back in 1-2 working days.
                <br />
                Check back here for updates.
              </p>
            </motion.div>
          ),
          color: "text-black",
        };
    }
  };

  const { heading, subtext, color } = getStatusMessage();

  return (
    <>
      <Nav />

      <main className="bg-[#fefefe] text-black ">
        <div className="min-h-screen max-w-screen-sm mx-auto px-4 pt-24 text-center flex flex-col justify-center  ">
          {status === "accepted" || status === "rejected" ? (
            <TimelineDots totalSteps={3} currentStep={3} />
          ) : (
            <></>
          )}

          <h1 className={`text-3xl font-bold mb-4 ${color}`}>{heading}</h1>
          {subtext}

          <div className="mt-10 flex flex-col gap-4 items-center">
            {status !== "unauthorized" && (
              <>
                <button
                  className="text-black/80 border-b border-black/50 text-base font-medium hover:text-black hover:border-black"
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    router.push("/");
                  }}
                >
                  Sign Out
                </button>
                <Link
                  href={"/get-started/student/application"}
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition flex items-center gap-3"
                >
                  View Application / Next Steps <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
          {status === "unauthorized" && (
            <div className="mt-10 flex flex-col gap-4 items-center">
              <Link
                href={"/get-started/"}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition"
              >
                Proceed to Login
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
