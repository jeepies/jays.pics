import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export function PrivacyPickerContent() {
    const options = [
        {
            value: "private",
            label: "Private"
        },
        {
            value: "unlisted",
            label: "Unlisted"
        },
        {
            value: "public",
            label: "Public"
        },
    ]
    return _PrivacyPicker(options)
}

export function PrivacyPickerURL() {
    const options = [
        {
            value: "private",
            label: "Private"
        },
        {
            value: "public",
            label: "Public"
        },
    ]
    return _PrivacyPicker(options)
}

function _PrivacyPicker(options: {value: string, label: string}[]) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
            {value ? options.find((option) => option.value === value)?.label : "Select privacy..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {option.label}
                    <Check className={cn("ml-auto", value === option.value ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
}