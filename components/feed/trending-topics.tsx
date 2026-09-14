"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const TRENDING_TOPICS = [
  "Technology",
  "Next.js",
  "Engineering",
  "Design",
  "Architecture",
  "Tutorials",
  "Career",
];

export function TrendingTopics({
  selectedTag,
  searchQuery,
}: {
  selectedTag: string;
  searchQuery?: string;
}) {
  const router = useRouter();

  const handleSelect = (topic: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (topic !== selectedTag) {
      params.set("tag", topic);
    }
    const queryStr = params.toString();
    router.push(queryStr ? `/?${queryStr}` : "/");
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> Trending Topics
        </h4>
        <div className="space-y-2">
          {TRENDING_TOPICS.map((topic) => (
            <div
              key={topic}
              onClick={() => handleSelect(topic)}
              className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                selectedTag === topic
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>#{topic}</span>
              <span className="text-[10px] text-muted-foreground">Explore</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
