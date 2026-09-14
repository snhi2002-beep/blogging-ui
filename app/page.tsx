"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  LogOut,
  PenSquare,
  Heart,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface Author {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  description: string;
  tag: string;
  readTime: string;
  createdAt: string;
  likes: string[];
  author: Author;
}

const CATEGORIES = ["All", "Technology", "Next.js", "Engineering", "Design", "Architecture", "Tutorials"];

export default function Home() {
  const { user, logout, loading: authLoading } = useAuth();

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState("All");

  const fetchPosts = React.useCallback(async (query: string, tag: string) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (query.trim()) params.append("search", query.trim());
      if (tag && tag !== "All") params.append("tag", tag);

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPosts(searchQuery, selectedTag);
  }, [fetchPosts, selectedTag]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(searchQuery, selectedTag);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur z-50">
        <div className="container mx-auto max-w-5xl flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>BlogSphere</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="#articles" className="hover:text-primary transition-colors">
              Articles
            </Link>
            <Link href="/profile" className="hover:text-primary transition-colors">
              Profile
            </Link>

            <Link href="/write">
              <Button size="sm" className="gap-1.5 hidden sm:inline-flex">
                <PenSquare className="h-4 w-4" /> Write
              </Button>
            </Link>

            {!authLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link href="/profile" className="flex items-center gap-2 hover:opacity-80">
                      <Avatar className="h-8 w-8">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline-block text-sm font-medium">
                        {user.name.split(" ")[0]}
                      </span>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => logout()} title="Log out">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">Get Started</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="py-20 px-4 text-center container mx-auto max-w-3xl space-y-6">
          <Badge variant="secondary" className="px-3 py-1 gap-1 inline-flex items-center text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Fullstack MongoDB Blogging
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Stories, insights, and ideas for builders.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Read perspectives from software creators, or share your own journey with the world.
          </p>

          <form onSubmit={handleSearchSubmit} className="flex max-w-md mx-auto items-center gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles by title, tag..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat}
                variant={selectedTag === cat ? "default" : "outline"}
                className="cursor-pointer px-3 py-1 text-xs transition-colors"
                onClick={() => setSelectedTag(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </section>

        {/* Real Articles from MongoDB */}
        <section id="articles" className="py-12 container mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {selectedTag === "All" ? "Latest Articles" : `${selectedTag} Articles`}
            </h2>
            <Link href="/write">
              <Button variant="outline" size="sm" className="gap-1">
                Write an article <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Fetching articles from MongoDB...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-card space-y-4">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-bold">No articles found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {searchQuery || selectedTag !== "All"
                  ? "No published stories matched your filter criteria. Try searching for something else."
                  : "There are no published articles yet. Be the first to share your thoughts!"}
              </p>
              <Link href="/write">
                <Button className="gap-2">
                  <PenSquare className="h-4 w-4" /> Write First Article
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => {
                const dateStr = new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <Link
                    key={post._id}
                    href={`/posts/${post.slug}`}
                    className="block group"
                  >
                    <Card className="flex flex-col h-full justify-between hover:shadow-md transition-all group-hover:border-primary/50">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{post.tag}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {post.readTime}
                          </span>
                        </div>
                        <CardTitle className="text-xl line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex items-center justify-between pt-0 text-xs text-muted-foreground border-t mt-4 p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            {post.author?.avatar ? (
                              <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            ) : null}
                            <AvatarFallback className="text-[10px]">
                              {post.author?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {post.author?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {post.likes?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {dateStr}
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} BlogSphere. Powered by Next.js & MongoDB.
        </div>
      </footer>
    </div>
  );
}
