import { Form, useSubmit, useNavigation } from "@remix-run/react";
import { Search } from "lucide-react";
import { useDebounce } from "~/hooks/use-debounce";

interface FiltersProps {
  initialSearch: string;
}

export function Filters({ initialSearch }: FiltersProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSearching = navigation.formData?.has("search");

  const debouncedSubmit = useDebounce((form: HTMLFormElement) => {
    submit(form);
  }, 300);

  return (
    <Form
      className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-md"
      onChange={(e) => debouncedSubmit(e.currentTarget)}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          name="search"
          placeholder="Search images..."
          defaultValue={initialSearch}
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Search images"
        />
      </div>
    </Form>
  );
}
