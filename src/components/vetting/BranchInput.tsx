import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

export function BranchInput({ form }: { form: UseFormReturn<any> }) {
  return (
    <FormField
      control={form.control}
      name="branch"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Major or Branch</FormLabel>
          <FormControl>
            <Input placeholder="e.g. CSE" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}