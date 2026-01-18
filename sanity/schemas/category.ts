import { defineField, defineType } from "sanity";

const category = defineType({
  name: "category",
  title: "Project Categories",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name of the category",
      type: "string",
      validation: (Rule) => Rule.required().error("category name is required."),
    }),
  ],
});

export default category;
