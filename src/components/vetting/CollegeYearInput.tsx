import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldProp } from "../../lib/schemas/formSchema";

export function CollegeYearInput({ form }: { form: FormFieldProp }) {
  return (
    <FormField
      name="year"
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-black font-medium">
            Year of Study
          </FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="text-black font-medium bg-slate-50">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="font-sans font-medium">
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
                <SelectItem value="4+">4+ year/alumni</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
