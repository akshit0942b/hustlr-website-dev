import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import React, { useState } from "react";
import { PortableTextBlock } from "sanity";
import RichTextRenderer from "./RichTextRenderer";
import { urlFor } from "@/src/lib/fetchProjectsData";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NextRouter } from "next/router";
import { Stage2Data } from "../../lib/schemas/formSchema";
import { toast } from "sonner";

type FilteredProject = {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  duration: number;
  images: SanityImageSource[];
  detailedDesc: PortableTextBlock[];
  projectCategory: string;
};

const ProjectSelection = ({
  projectChosen,
  jwtToken,
  email,
  router,
}: {
  projectChosen: FilteredProject;
  jwtToken: string;
  email: string;
  router: NextRouter;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConfirm = async () => {
    setDialogOpen(false);
    const stage2Data: Stage2Data = {
      email,
      currentStage: 2,
      selectedProjectSanityId: projectChosen.id,
    };
    console.log("Confirmed:", stage2Data);

    const res = await fetch("/api/project/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(stage2Data),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Successfully updated test project! redirecting");
      router.push("/get-started/student/application/stage2/projectSubmit");
    } else {
      console.error("error saving vetting data:", data.error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row text-start gap-5 p-2 sm:p-4 mt-16">
      <div className="w-full sm:w-1/2 relative">
        <div className="sticky top-40 text-white aspect-square rounded shadow-lg shadow-black/30">
          <Carousel className="h-full w-full">
            <CarouselContent className="h-full">
              {projectChosen.images.map((img, i) => (
                <CarouselItem
                  key={i}
                  className="relative aspect-square overflow-hidden w-full"
                >
                  <Image
                    fill
                    src={urlFor(img).url()}
                    alt={`image-${i}`}
                    className="object-cover object-center rounded"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="text-black right-2 top-1/2 -translate-y-1/2 shadow-lg shadow-black/40 border border-slate-800 disabled:cursor-not-allowed" />
            <CarouselPrevious className="text-black left-2 top-1/2 -translate-y-1/2 shadow-lg shadow-black/40 border border-slate-800 disabled:cursor-not-allowed" />
          </Carousel>
        </div>
      </div>

      <div className="p-5 sm:w-1/2">
        <Button
          onClick={() => window.history.back()}
          className="mb-4 font-sans font-medium"
          variant="outline"
        >
          <ArrowLeft /> Back to Projects
        </Button>

        <h2 className="font-bold text-2xl mb-3">{projectChosen.name}</h2>
        <p className="font-sans">{projectChosen.desc}</p>

        <ul className="flex flex-wrap gap-2 my-5">
          {projectChosen.tags.map((el, i) => (
            <li key={i}>
              <Badge className="font-sans">{el}</Badge>
            </li>
          ))}
        </ul>

        <div className="font-sans mb-7">
          <span className="font-medium text-lg">Duration</span>
          <p className="text-4xl font-semibold">
            {projectChosen.duration} Days
          </p>
        </div>

        <h4 className="font-sans font-semibold mb-3 text-lg">
          Detailed Description & Deliverables:
        </h4>
        {projectChosen.detailedDesc?.length > 0 && (
          <RichTextRenderer value={projectChosen.detailedDesc} />
        )}

        {/* Confirmation Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-5">Confirm Choice</Button>
          </DialogTrigger>
          <DialogContent className="font-sans ">
            <DialogHeader>
              <DialogTitle className="text-lg">Are you sure?</DialogTitle>
              <DialogDescription>
                Once you confirm this project, it{" "}
                <strong>cannot be changed</strong>. Once you select a project
                the deadline will start <strong>IMMEDIATELY</strong> relative to
                current time.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Yes, Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectSelection;
