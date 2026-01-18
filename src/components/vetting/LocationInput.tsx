import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormFieldProp } from "../../lib/schemas/formSchema";

export function LocationInput({ form }: { form: FormFieldProp }) {
  return (
    <FormField
      name={"location"}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-black">Location</FormLabel>
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
  );
}
