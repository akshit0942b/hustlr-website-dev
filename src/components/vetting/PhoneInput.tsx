import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

export default function PhoneInput({ form }: { form: UseFormReturn<any> }) {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                +91
              </span>
              <Input 
                {...field} 
                className="rounded-l-none" 
                placeholder="9876543210" 
                onChange={(e) => {
                  // strip +91 if user types it, or just handle raw input
                  field.onChange("+91" + e.target.value.replace("+91", ""));
                }}
                value={field.value?.replace("+91", "") || ""}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}