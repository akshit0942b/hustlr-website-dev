"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

function ConfirmActionModal({
  action,
  onConfirm,
  children,
  loading,
  description,
}: {
  action: string;
  onConfirm: () => void;
  children: React.ReactNode;
  loading: boolean;
  description?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md font-sans">
        <DialogHeader>
          <DialogTitle>Confirm {action}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">{description}</p>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={action === "reject" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? `${action}ing...` : `Confirm ${action}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Define status labels and stage mapping
const STATUS_TO_STAGE: Record<string, number> = {
  not_completed: 1,
  under_review: 1,
  round_2_eligible: 2,
  round_2_project_selected: 2,
  round_2_under_review: 2,
  accepted: 3,
  rejected: 3,
};

export function StatusUpdateForm({
  currentStatus,
  email,
  jwtToken,
}: {
  currentStatus: string;
  email: string;
  jwtToken: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [stage, setStage] = useState(STATUS_TO_STAGE[currentStatus]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      stage: STATUS_TO_STAGE[currentStatus],
    },
  });

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    setMessage(null);
    setStatus(newStatus);
    setStage(STATUS_TO_STAGE[newStatus]);

    try {
      const res = await fetch("/api/admin/updateApplicationStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          email,
          status: newStatus,
          currentStage: STATUS_TO_STAGE[newStatus],
        }),
      });

      if (res.ok) {
        toast.success("Status updated successfully!");
        setMessage("Status updated successfully! Refreshing...");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await res.json();
        setStatus(currentStatus);
        setStage(STATUS_TO_STAGE[currentStatus]);
        toast.error(data.error || "Failed to update status.");
        setMessage(data.error || "Failed to update status.");
      }
    } catch {
      setStatus(currentStatus);
      setStage(STATUS_TO_STAGE[currentStatus]);
      toast.error("Failed to update status.");
      setMessage("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const renderButtons = () => {
    switch (status) {
      case "under_review":
        return (
          <div className="flex gap-4">
            <ConfirmActionModal
              action="Accept"
              onConfirm={() => handleStatusUpdate("round_2_eligible")}
              loading={loading}
              description="Are you sure you want to accept and move the applicant to Round 2?"
            >
              <Button type="button" variant="default">
                Accept and move to Round 2
              </Button>
            </ConfirmActionModal>

            <ConfirmActionModal
              action="Reject"
              onConfirm={() => handleStatusUpdate("rejected")}
              loading={loading}
              description="Are you sure you want to reject this application? This action cannot be undone."
            >
              <Button type="button" variant="destructive">
                Reject
              </Button>
            </ConfirmActionModal>
          </div>
        );

      case "round_2_under_review":
        return (
          <div className="flex gap-4">
            <ConfirmActionModal
              action="Accept"
              onConfirm={() => handleStatusUpdate("accepted")}
              loading={loading}
              description="Are you sure you want to accept and onboard this applicant?"
            >
              <Button type="button" variant="default">
                Accept and onboard user
              </Button>
            </ConfirmActionModal>

            <ConfirmActionModal
              action="Reject"
              onConfirm={() => handleStatusUpdate("rejected")}
              loading={loading}
              description="Are you sure you want to reject this application? This action cannot be undone."
            >
              <Button type="button" variant="destructive">
                Reject
              </Button>
            </ConfirmActionModal>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="p-6 border rounded-lg bg-gray-50/20">
        {currentStatus === "under_review" ||
        currentStatus === "round_2_under_review" ? (
          <>
            <h2 className="font-semibold text-xl mb-4">
              Update Application Status
            </h2>
            <p className="text-gray-600 mb-4 font-sans">
              Use the form below to update the status of this application.
            </p>
            <Form {...form}>
              <form
                className="space-y-6 font-sans"
                onSubmit={(e) => e.preventDefault()}
              >
                {renderButtons()}

                <Input type="hidden" name="stage" value={stage} />
                <Input type="hidden" name="status" value={status} />

                {message && (
                  <p
                    className={`text-sm font-medium ${
                      message.includes("success")
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>
            </Form>
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold">
              Current Status: {currentStatus}
            </p>
            <p className="text-sm text-gray-500">
              No actions available for this status.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
