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

type Props<T extends FieldValues & { cgpa: any }> = {
  form: UseFormReturn<T>;
};

export function CollegeEmailInput({ form }: { form: FormFieldProp }) {
  return (
    <FormField
      name="collegeEmail"
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-black">
            College Email &nbsp;
          </FormLabel>
          <FormControl>
            <Input
              className="border border-black/25 p-2 w-full mb-4 font-sans shadow-black/30 text-black"
              placeholder="student@college.edu"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
