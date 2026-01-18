import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/src/lib/fetchProjectsData";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

const ProjectCard = ({
  name,
  tags,
  desc,
  images,
  onClick,
}: {
  name: string;
  tags: string[];
  desc: string;
  images: any;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex flex-col h-full w-full rounded-sm overflow-hidden bg-gray-100 text-start hover:-translate-x-1 hover:-translate-y-2 hover:shadow hover:shadow-black/50 transition-all"
    >
      <div className="relative w-full aspect-video bg-black">
        <Image
          fill
          src={urlFor(images[0]).url()}
          alt="image"
          className="object-cover object-center"
        />
      </div>

      <div className="p-4">
        <h1 className="font-bold text-xl mb-2">{name}</h1>
        <ul className="flex flex-wrap gap-2 mb-5">
          {tags.map((el, i) => (
            <li className="" key={i}>
              <Badge className="font-sans " key={i}>
                {el}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="text-base">{desc.slice(0, 140)}...</p>
        <Button
          role="learn more about the project"
          className="inline-flex items-center w-min mt-5"
        >
          Learn More <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
