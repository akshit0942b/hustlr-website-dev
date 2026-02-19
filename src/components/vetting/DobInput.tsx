import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/src/lib/utils";
import { format, differenceInYears } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { FormFieldProp } from "../../lib/schemas/formSchema";

function DobInput({ form }: { form: FormFieldProp }) {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name="dob"
      render={({ field }) => {
        const age = field.value ? differenceInYears(new Date(), field.value) : null;
      return (
        <FormItem className="flex flex-col">
          <FormLabel>Date of birth</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-sans",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                className="font-sans"
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
           {age !== null ? (
                <span className="text-blue-600 font-medium">
                  You are {age} years old
                </span>
              ) : (
                "Your date of birth is used to calculate your age."
              )}
          </FormDescription>
          <FormMessage />
        </FormItem>
      );
      }}
    />
  );
}

export default DobInput;
