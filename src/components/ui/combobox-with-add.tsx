import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxWithAddProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  emptyText?: string;
  addNewText?: string;
  disabled?: boolean;
  className?: string;
}

export function ComboboxWithAdd({
  value,
  onValueChange,
  options,
  placeholder = "Select option...",
  emptyText = "No options found.",
  addNewText = "Add new",
  disabled = false,
  className,
}: ComboboxWithAddProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue === value ? "" : selectedValue);
    setOpen(false);
    setSearchValue("");
  };

  const handleAddNew = () => {
    if (searchValue.trim() && !options.includes(searchValue.trim())) {
      onValueChange(searchValue.trim());
      setOpen(false);
      setSearchValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {filteredOptions.length === 0 ? (
              <CommandEmpty>
                <div className="py-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">{emptyText}</p>
                  {searchValue.trim() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddNew}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {addNewText}: "{searchValue.trim()}"
                    </Button>
                  )}
                </div>
              </CommandEmpty>
            ) : (
              <>
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => handleSelect(option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {searchValue.trim() && !options.includes(searchValue.trim()) && (
                  <CommandGroup>
                    <CommandItem onSelect={handleAddNew} className="border-t">
                      <Plus className="mr-2 h-4 w-4" />
                      {addNewText}: "{searchValue.trim()}"
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
