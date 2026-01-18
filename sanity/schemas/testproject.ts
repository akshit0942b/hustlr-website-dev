import { defineField, defineType } from "sanity";

const testProject = defineType({
  name: "testProject",
  title: "Test Project",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name of the project",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(1).error("Project name is required."),
    }),
    defineField({
      name: "projectCategory",
      title: "Category",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error("Please add at least one tag for the project.")
          .max(1)
          .error("Please add only one"),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error("Please add at least one tag for the project."),
    }),
    defineField({
      name: "desc",
      title: "Description for the project",
      type: "text",
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .error("A brief description (at least 10 characters) is required."),
    }),
    defineField({
      name: "detailedDesc",
      title: "Detailed Description",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) =>
        Rule.required().min(1).error("Detailed description is required."),
    }),
    defineField({
      name: "duration",
      title: "Duration (in days)",
      description:
        "Enter the number of days the project should be completed in by applicant.",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .positive()
          .integer()
          .error("Please enter a valid positive number of days."),
    }),
    defineField({
      name: "images",
      title: "Project Images",
      type: "array",
      of: [{ type: "image" }],
      options: {
        layout: "grid",
      },
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error("Please upload at least one image for the project."),
    }),
  ],
});

export default testProject;
