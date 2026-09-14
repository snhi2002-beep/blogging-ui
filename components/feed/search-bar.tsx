"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar({
  initialSearch = "",
  selectedTag = "All",
  placeholder = "Search posts, topics...",
  className = "",
}: {
  initialSearch?: string;
  selectedTag?: string;
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(initialSearch);

  React.useEffect(() => {
    setValue(initialSearch);
  }, [initialSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("search", value.trim());
    if (selectedTag && selectedTag !== "All") params.set("tag", selectedTag);
    const queryStr = params.toString();
    router.push(queryStr ? `/?${queryStr}` : "/");
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 h-9 bg-muted/50 rounded-full text-xs"
      />
    </form>
  );
}
