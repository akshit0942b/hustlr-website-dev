"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
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
import { X, ChevronDown } from "lucide-react";
import { FormFieldProp } from "../../lib/schemas/formSchema";

const availableSkills = [
  "React",
  "FastAPI",
  "Next.JS",
  "TypeScript",
  "Python",
  "JavaScript",
  "Node.js",
  "Vue.js",
  "Angular",
  "Django",
  "Flask",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Git",
  "GraphQL",
  "REST API",
  "Tailwind CSS",
];

type Props = {
  form: FormFieldProp;
  name?: "skills";
  label?: string;
  placeholder?: string;
  className?: string;
};

export function SkillsInput({
  form,
  name = "skills",
  label = "Skills",
  placeholder = "Select skills...",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSelectSkill = (skill: string, currentValue: string[]) => {
    if (!currentValue.includes(skill)) {
      const newValue = [...currentValue, skill];
      form.setValue(name, newValue);
    }
    setOpen(false);
  };

  const handleRemoveSkill = (skillToRemove: string, currentValue: string[]) => {
    const newValue = currentValue.filter((skill) => skill !== skillToRemove);
    form.setValue(name, newValue);
  };

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => {
        const selectedSkills = field.value || [];
        const availableOptions = availableSkills.filter(
          (skill) => !selectedSkills.includes(skill)
        );

        return (
          <FormItem>
            <FormLabel className="text-black">{label}</FormLabel>
            <FormControl>
              <div className={`relative ${className}`}>
                <div className="min-h-[60px] w-full rounded-lg border border-black/25 bg-gray-100 px-3 py-2 text-sm shadow-black/30 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill: string) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-teal-700 text-white hover:bg-gray-700 px-3 py-1 rounded-full"
                      >
                        {skill}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-auto p-0 text-white hover:bg-transparent hover:text-gray-300"
                          onClick={() =>
                            handleRemoveSkill(skill, selectedSkills)
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          role="combobox"
                          aria-expanded={open}
                          className="h-8 justify-between border-0 bg-black/5 !px-3 py-2 p-0 font-normal text-muted-foreground hover:bg-black/10"
                        >
                          {selectedSkills.length === 0
                            ? placeholder
                            : "Add skill..."}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[400px] p-0 shadow-xl shadow-black/20 border-2 border-black/15"
                        align="start"
                      >
                        <Command className="font-sans font-medium">
                          <CommandInput placeholder="Search skills..." />
                          <CommandList>
                            <CommandEmpty>No skills found.</CommandEmpty>
                            <CommandGroup>
                              {availableOptions.map((skill) => (
                                <CommandItem
                                  key={skill}
                                  value={skill}
                                  onSelect={() =>
                                    handleSelectSkill(skill, selectedSkills)
                                  }
                                >
                                  {skill}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {selectedSkills.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {selectedSkills.length} skill
                    {selectedSkills.length !== 1 ? "s" : ""} selected
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
