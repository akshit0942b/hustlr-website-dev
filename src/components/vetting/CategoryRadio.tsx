import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Code, Palette, PenTool } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormFieldProp } from "../../lib/schemas/formSchema";

const categories = [
  {
    name: "Design",
    svg: <Palette className="w-8 h-8 text-white mb-3" strokeWidth={1.5} />,
  },
  {
    name: "Development",
    svg: <Code className="w-8 h-8 text-white mb-3" strokeWidth={1.5} />,
  },
  {
    name: "Copywriting",
    svg: <PenTool className="w-8 h-8 text-white mb-3" strokeWidth={1.5} />,
  },
];

export default function CategoryRadio({ form }: { form: FormFieldProp }) {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="w-full max-w-2xl mx-auto p-6">
          <FormLabel className="block mb-4 text-lg font-semibold text-center">
            Choose your main category
          </FormLabel>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {categories.map(({ name, svg }) => {
                const value = name.toLowerCase(); // ensure consistent casing
                return (
                  <FormItem key={value}>
                    <FormLabel htmlFor={value} className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center p-8 bg-accentBlue rounded-2xl hover:bg-accentBlue transition-colors [&:has(:checked)]:bg-accentBlue [&:has(:checked)]:ring-2 [&:has(:checked)]:ring-accentBlue [&:has(:checked)]:ring-offset-2">
                        <RadioGroupItem
                          value={value}
                          id={value}
                          className="sr-only"
                        />
                        {svg}
                        <span className="text-xl font-semibold text-white">
                          {name}
                        </span>
                      </div>
                    </FormLabel>
                  </FormItem>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormDescription className="text-base text-center font-medium">
            {field.value
              ? `Selected: ${field.value}`
              : "Please select a category"}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
