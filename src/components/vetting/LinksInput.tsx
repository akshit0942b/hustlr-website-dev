import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, UseFormReturn, Path } from "react-hook-form";
import { FormFieldProp } from "../../lib/schemas/formSchema";

export function LinksInput({ form }: { form: FormFieldProp }) {
  return (
    <>
      <FormField
        name="linkedin"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black">LinkedIn</FormLabel>
            <FormControl>
              <Input
                className=" border border-black/25 p-2 w-full mb-4 font-sans shadow-black/30 text-black"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="github"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-black">
              GitHub Profile or Portfolio Link
            </FormLabel>
            <FormControl>
              <Input
                className=" border border-black/25 p-2 w-full mb-4 font-sans shadow-black/30 text-black"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
