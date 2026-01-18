import { sanity } from "@/sanity/lib/client";
import urlBuilder from "@sanity/image-url";
import groq from "groq";

const builder = urlBuilder(sanity);

export function urlFor(source: any) {
  return builder.image(source);
}

export default async function fetchProjectsData() {
  try {
    const query = groq`*[_type == "testProject"]{
    "id": _id,
    name,
    tags,
    duration,
    "projectCategory": projectCategory[0]->name,
    desc,
    images,
    detailedDesc
  }`;

    const data = await sanity.fetch(query);
    return { success: true, data };
  } catch (err) {
    console.error("Sanity fetch error:", err);
    return { success: false, err };
  }
}
export async function fetchProjectDataById(id: string) {
  try {
    const query = groq`*[_type == "testProject" && _id == $id][0]{
    "id": _id,
    name,
    tags,
    duration,
    "projectCategory": projectCategory[0]->name,
    desc,
    images,
    detailedDesc
  }`;

    const data = await sanity.fetch(query, { id });
    return data;
  } catch (err) {
    console.error("Sanity fetch error:", err);
    return { success: false, err };
  }
}
