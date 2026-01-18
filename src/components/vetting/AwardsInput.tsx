import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldProp } from "../../lib/schemas/formSchema";

export function AwardsInput({ form }: { form: FormFieldProp }) {
  return (
    <FormField
      name="awards"
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-black">Awards</FormLabel>
          <FormDescription className="text-teal-600 font-medium">
            Tell us about your notable achievements in your category of
            interest.{" "}
          </FormDescription>
          <FormControl>
            <Textarea {...field} maxLength={200} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
