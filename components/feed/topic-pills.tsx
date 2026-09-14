"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const TRENDING_TOPICS = [
  "All",
  "Technology",
  "Next.js",
  "Engineering",
  "Design",
  "Architecture",
  "Tutorials",
  "Career",
];

export function TopicPills({
  selectedTag,
  searchQuery,
}: {
  selectedTag: string;
  searchQuery?: string;
}) {
  const router = useRouter();

  const handleSelect = (tag: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (tag !== "All") params.set("tag", tag);
    const queryStr = params.toString();
    router.push(queryStr ? `/?${queryStr}` : "/");
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
      {TRENDING_TOPICS.map((tag) => (
        <Badge
          key={tag}
          variant={selectedTag === tag ? "default" : "secondary"}
          className="cursor-pointer px-3 py-1 text-xs whitespace-nowrap transition-colors"
          onClick={() => handleSelect(tag)}
        >
          {tag === "All" ? "🔥 All Posts" : `#${tag}`}
        </Badge>
      ))}
    </div>
  );
}
