import { GetServerSideProps } from "next";
import { PortableTextBlock } from "sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import React from "react";
import { fetchProjectDataById, urlFor } from "@/src/lib/fetchProjectsData";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowLeft } from "lucide-react";
import RichTextRenderer from "@/src/components/stage2/RichTextRenderer";
import Nav from "@/src/components/Nav";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  let project: boolean | FilteredProject = false;
  if (id !== undefined && typeof id === "string")
    project = await fetchProjectDataById(id);

  if (!project) {
    return {
      notFound: true,
    };
  }

  return {
    props: { project },
  };
};

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

const ProjectDetails = ({
  projectChosen,
}: {
  projectChosen: FilteredProject;
}) => {
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
          <ArrowLeft /> Go Back
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
      </div>
    </div>
  );
};

export default function ProjectInfoPage({
  project,
}: {
  project: FilteredProject;
}) {
  return (
    <>
      <Nav />
      <main className="md:pt-32 bg-white">
        <h1 className="font-bold text-3xl text-center">Project Details</h1>
        <div className="p-3 max-w-screen-lg mx-auto">
          <ProjectDetails projectChosen={project} />
        </div>
      </main>
    </>
  );
}
