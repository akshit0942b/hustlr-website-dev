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

export function CgpaInput({ form }: { form: FormFieldProp }) {
  return (
    <FormField
      control={form.control}
      name={"cgpa"}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-black">CGPA</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Enter your CGPA (e.g. 8.25)"
              className="bg-slate-50 border border-black/25 p-2 w-full font-sans shadow text-black"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
