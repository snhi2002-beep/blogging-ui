export const dynamic = "force-dynamic";

import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import "@/models/User";
import { Header } from "@/components/layout/header";
import { SidebarProfile } from "@/components/feed/sidebar-profile";
import { PostComposer } from "@/components/feed/post-composer";
import { TopicPills } from "@/components/feed/topic-pills";
import { PostCard, PostItem } from "@/components/feed/post-card";
import { SearchBar } from "@/components/feed/search-bar";
import { TrendingTopics } from "@/components/feed/trending-topics";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, BookOpen, PenSquare, Globe } from "lucide-react";

async function getPosts(searchQuery?: string, selectedTag?: string): Promise<PostItem[]> {
  try {
    await connectToDatabase();

    const query: Record<string, any> = { published: true };

    if (selectedTag && selectedTag !== "All") {
      query.tag = { $regex: new RegExp(`^${selectedTag}$`, "i") };
    }

    if (searchQuery && searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tag: searchRegex },
      ];
    }

    const posts = await Post.find(query)
      .populate("author", "name email avatar role")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Error fetching posts on server:", error);
    return [];
  }
}

interface SearchParams {
  search?: string;
  tag?: string;
}

interface PageProps {
  searchParams?: Promise<SearchParams> | SearchParams;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams =
    searchParams instanceof Promise ? await searchParams : searchParams || {};

  const searchQuery = resolvedParams?.search || "";
  const selectedTag = resolvedParams?.tag || "All";

  const posts = await getPosts(searchQuery, selectedTag);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Server-Rendered Page Header with Interactive Search and Auth Actions */}
      <Header searchQuery={searchQuery} selectedTag={selectedTag} />

      {/* Main Social Layout */}
      <div className="container mx-auto max-w-6xl px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sidebar Navigation & User Info */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20">
            <SidebarProfile />

            {/* Navigation Links */}
            <Card className="shadow-sm">
              <CardContent className="p-3 space-y-1">
                <Link href="/" className="w-full block">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 font-medium text-sm ${
                      selectedTag === "All" && !searchQuery
                        ? "text-primary bg-accent/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Compass className="h-4 w-4" />
                    Home Feed
                  </Button>
                </Link>
                <Link href="/profile" className="w-full block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 font-medium text-sm text-muted-foreground hover:text-foreground"
                  >
                    <BookOpen className="h-4 w-4" />
                    My Stories
                  </Button>
                </Link>
                <Link href="/write" className="w-full block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 font-medium text-sm text-muted-foreground hover:text-foreground"
                  >
                    <PenSquare className="h-4 w-4" />
                    Long-form Studio
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </aside>

          {/* Center Column: Social Media Posting Feed */}
          <main className="lg:col-span-6 space-y-5">
            {/* Quick Post Composer */}
            <PostComposer />

            {/* Category / Topic Pills */}
            <TopicPills selectedTag={selectedTag} searchQuery={searchQuery} />

            {/* Posts Stream (Server-Rendered HTML) */}
            {posts.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-card space-y-4 p-6">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">No posts here yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {selectedTag !== "All" || searchQuery
                    ? "No posts matched your current search filters. Try selecting another topic."
                    : "Be the first person to publish a post in this community!"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </main>

          {/* Right Column: Trending Topics & Search */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20">
            {/* Search Widget */}
            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  Search Feed
                </h4>
                <SearchBar
                  initialSearch={searchQuery}
                  selectedTag={selectedTag}
                  placeholder="Search by keywords..."
                />
              </CardContent>
            </Card>

            {/* Trending Topics Widget */}
            <TrendingTopics selectedTag={selectedTag} searchQuery={searchQuery} />

            {/* Community Info */}
            <div className="px-2 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" /> BlogSphere Social Community
              </div>
              <p className="text-[11px]">
                Server-side rendered with Next.js 14 & MongoDB.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground mt-12">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} BlogSphere. Server-side rendered social feed.
        </div>
      </footer>
    </div>
  );
}
