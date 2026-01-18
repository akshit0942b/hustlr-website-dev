// sanity/sanity.config.ts
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "Hustlr Studio",
  projectId: "oig8r3q4",
  dataset: "production",
  basePath: "/studio", // optional if embedding
  plugins: [deskTool()],
  schema: {
    types: schemaTypes, // define schemas here
  },
});
