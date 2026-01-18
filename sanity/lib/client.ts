import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: "oig8r3q4",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-07-01",
  token: process.env.SANITY_API_TOKEN, // optional
});
