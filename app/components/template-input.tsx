import * as React from "react";

import { Input, type InputProps } from "~/components/ui/input";

interface TemplateInputProps extends InputProps {
  templates: string[];
}

export function TemplateInput({ templates, onChange, ...props }: Readonly<TemplateInputProps>) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(e);
    const input = e.currentTarget;
    const pos = input.selectionStart ?? input.value.length;
    setOpen(pos >= 2 && input.value.slice(pos - 2, pos) === "{{");
  }

  function handleSelect(t: string) {
    const input = ref.current;
    if (!input) return;
    const pos = input.selectionStart ?? input.value.length;
    const before = input.value.slice(0, pos);
    const after = input.value.slice(pos);
    const text = `{{${t}}}`;
    input.value = before + text + after;
    const newPos = before.length + text.length;
    input.focus();
    input.setSelectionRange(newPos, newPos);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    setOpen(false);
  }

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative">
      <Input ref={ref} onChange={handleChange} {...props} />
      {open && templates.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md max-h-48 overflow-auto">
          {templates.map((t) => (
            <button
              type="button"
              key={t}
              className="block w-full px-2 py-1 text-left hover:bg-accent"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(t)}
            >
              {`{{${t}}}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}