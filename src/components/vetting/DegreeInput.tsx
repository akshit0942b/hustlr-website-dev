import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

export function DegreeInput({ form }: { form: UseFormReturn<any> }) {
  return (
    <FormField
      control={form.control}
      name="degree"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Degree Type</FormLabel>
          <FormControl>
            <Input placeholder="e.g. B.Tech" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}