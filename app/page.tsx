"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Heart,
  MessageSquare,
  Share2,
  Search,
  Sparkles,
  PenSquare,
  LogOut,
  Loader2,
  Compass,
  TrendingUp,
  Send,
  ImageIcon,
  ArrowRight,
  Clock,
  Check,
  Globe,
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
  content: string;
  tag: string;
  coverImage?: string;
  readTime: string;
  createdAt: string;
  likes: string[];
  author: Author;
}

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

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Home() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState("All");

  // Quick Composer State
  const [composerTitle, setComposerTitle] = React.useState("");
  const [composerContent, setComposerContent] = React.useState("");
  const [composerTag, setComposerTag] = React.useState("Technology");
  const [composerImage, setComposerImage] = React.useState("");
  const [showImageInput, setShowImageInput] = React.useState(false);
  const [isPosting, setIsPosting] = React.useState(false);
  const [postError, setPostError] = React.useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = React.useState<string | null>(null);

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
    const timer = setTimeout(() => {
      fetchPosts(searchQuery, selectedTag);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPosts, selectedTag, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(searchQuery, selectedTag);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login?from=/");
      return;
    }

    if (!composerTitle.trim() || !composerContent.trim()) {
      setPostError("Please write a title and your post content.");
      return;
    }

    setIsPosting(true);
    setPostError(null);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: composerTitle.trim(),
          content: composerContent.trim(),
          tag: composerTag || "Technology",
          coverImage: composerImage.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPostError(data.error || "Failed to publish post.");
        setIsPosting(false);
        return;
      }

      setPosts((prev) => [data.post, ...prev]);
      setComposerTitle("");
      setComposerContent("");
      setComposerImage("");
      setShowImageInput(false);
    } catch {
      setPostError("Network error while creating post.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleToggleLike = async (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login?from=/");
      return;
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p;
        const alreadyLiked = p.likes?.includes(user.id);
        const newLikes = alreadyLiked
          ? p.likes.filter((id) => id !== user.id)
          : [...(p.likes || []), user.id];
        return { ...p, likes: newLikes };
      })
    );

    try {
      await fetch(`/api/posts/${slug}/like`, { method: "POST" });
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleShare = (slug: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/posts/${slug}`;
    if (navigator.share) {
      navigator.share({ title, url });
    } else {
      navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur z-50">
        <div className="container mx-auto max-w-6xl flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>BlogSphere</span>
          </Link>

          {/* Quick search input */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative max-w-sm w-full mx-6"
          >
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-muted/50 rounded-full"
            />
          </form>

          <nav className="flex items-center gap-3">
            <Link href="/write">
              <Button size="sm" className="gap-1.5">
                <PenSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Write Post</span>
              </Button>
            </Link>

            {!authLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    <Link href="/profile">
                      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="text-xs font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => logout()}
                      title="Log out"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">Join</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Social Layout */}
      <div className="container mx-auto max-w-6xl px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sidebar Navigation & User Info */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20">
            {/* User Mini Profile Card */}
            {user ? (
              <Card className="shadow-sm">
                <CardContent className="pt-6 text-center space-y-3">
                  <Avatar className="h-16 w-16 mx-auto border-2">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="text-lg font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-base leading-tight">
                      {user.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[11px] gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    {user.role.toUpperCase()}
                  </Badge>
                  <div className="pt-2">
                    <Link href="/profile">
                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base">Join the Conversation</h3>
                  <p className="text-xs text-muted-foreground">
                    Sign in to share your thoughts, like stories, and connect with other builders.
                  </p>
                  <div className="flex flex-col gap-2 pt-1">
                    <Link href="/login">
                      <Button size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="outline" size="sm" className="w-full">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Links */}
            <Card className="shadow-sm">
              <CardContent className="p-3 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 font-medium text-sm text-primary bg-accent/50"
                  onClick={() => setSelectedTag("All")}
                >
                  <Compass className="h-4 w-4" />
                  Home Feed
                </Button>
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
            <Card className="shadow-sm border">
              <CardContent className="pt-4 space-y-3">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="font-semibold text-xs">
                      {user ? user.name.charAt(0).toUpperCase() : "G"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Title of your post..."
                      value={composerTitle}
                      onChange={(e) => setComposerTitle(e.target.value)}
                      className="border-none px-0 text-base font-semibold focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/70"
                    />
                    <Textarea
                      placeholder={
                        user
                          ? "What's happening? Share code, ideas, or insights..."
                          : "Sign in to post updates and share articles..."
                      }
                      value={composerContent}
                      onChange={(e) => setComposerContent(e.target.value)}
                      className="border-none px-0 resize-none min-h-[70px] focus-visible:ring-0 shadow-none text-sm placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Optional Cover Image Input */}
                {showImageInput && (
                  <div className="pt-2">
                    <Input
                      placeholder="Paste image URL (https://images.unsplash.com/...)"
                      value={composerImage}
                      onChange={(e) => setComposerImage(e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                )}

                {postError && (
                  <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                    {postError}
                  </div>
                )}

                {/* Composer Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    {/* Tag Selector */}
                    <select
                      value={composerTag}
                      onChange={(e) => setComposerTag(e.target.value)}
                      className="text-xs border rounded-md px-2 py-1 bg-background text-muted-foreground"
                    >
                      {TRENDING_TOPICS.filter((t) => t !== "All").map((tag) => (
                        <option key={tag} value={tag}>
                          #{tag}
                        </option>
                      ))}
                    </select>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowImageInput(!showImageInput)}
                      title="Attach Image"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleCreatePost}
                    disabled={isPosting}
                    className="gap-1.5 h-8 px-4"
                  >
                    {isPosting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" /> Post
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Category / Topic Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {TRENDING_TOPICS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "secondary"}
                  className="cursor-pointer px-3 py-1 text-xs whitespace-nowrap transition-colors"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag === "All" ? "🔥 All Posts" : `#${tag}`}
                </Badge>
              ))}
            </div>

            {/* Posts Stream */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Loading feed updates...</p>
              </div>
            ) : posts.length === 0 ? (
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
                {posts.map((post) => {
                  const isLiked = user && post.likes?.includes(user.id);
                  const likesCount = post.likes?.length || 0;

                  return (
                    <Card
                      key={post._id}
                      className="shadow-sm border hover:border-muted-foreground/30 transition-colors overflow-hidden"
                    >
                      <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
                        <div className="flex items-start justify-between gap-3">
                          {/* Author Info */}
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              {post.author?.avatar ? (
                                <AvatarImage
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                />
                              ) : null}
                              <AvatarFallback className="font-semibold text-xs">
                                {post.author?.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-sm">
                                  {post.author?.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  · {timeAgo(post.createdAt)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 font-normal"
                                >
                                  #{post.tag}
                                </Badge>
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {post.readTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      {/* Post Content */}
                      <CardContent className="px-4 sm:px-5 py-0 space-y-3">
                        <Link href={`/posts/${post.slug}`}>
                          <h2 className="text-base sm:text-lg font-bold hover:text-primary transition-colors cursor-pointer leading-snug">
                            {post.title}
                          </h2>
                        </Link>

                        <p className="text-sm text-foreground/90 line-clamp-3 leading-relaxed">
                          {post.description || post.content}
                        </p>

                        {/* Optional Image */}
                        {post.coverImage && (
                          <Link href={`/posts/${post.slug}`}>
                            <div className="mt-3 rounded-lg overflow-hidden border max-h-[300px]">
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                        )}
                      </CardContent>

                      {/* Social Action Footer */}
                      <CardFooter className="px-4 sm:px-5 py-3 mt-3 border-t flex items-center justify-between text-muted-foreground text-xs">
                        <div className="flex items-center gap-4">
                          {/* Like Button */}
                          <button
                            onClick={(e) => handleToggleLike(post.slug, e)}
                            className={`flex items-center gap-1.5 hover:text-destructive transition-colors ${
                              isLiked ? "text-destructive font-semibold" : ""
                            }`}
                          >
                            <Heart
                              className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                            />
                            <span>{likesCount}</span>
                          </button>

                          {/* Comment / Detail Link */}
                          <Link
                            href={`/posts/${post.slug}`}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>Discuss</span>
                          </Link>

                          {/* Share Button */}
                          <button
                            onClick={(e) => handleShare(post.slug, post.title, e)}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                            title="Share post"
                          >
                            {copiedSlug === post.slug ? (
                              <>
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="text-green-500">Copied</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                              </>
                            )}
                          </button>
                        </div>

                        <Link
                          href={`/posts/${post.slug}`}
                          className="flex items-center gap-1 text-primary hover:underline font-medium"
                        >
                          Read Story <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </main>

          {/* Right Column: Trending Topics & Search */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20">
            {/* Search Widget */}
            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Search className="h-4 w-4" /> Search Feed
                </h4>
                <form onSubmit={handleSearchSubmit}>
                  <Input
                    placeholder="Search by keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 text-xs"
                  />
                </form>
              </CardContent>
            </Card>

            {/* Trending Topics Widget */}
            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Trending Topics
                </h4>
                <div className="space-y-2">
                  {TRENDING_TOPICS.filter((t) => t !== "All").map((topic) => (
                    <div
                      key={topic}
                      onClick={() => setSelectedTag(topic)}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        selectedTag === topic
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>#{topic}</span>
                      <span className="text-[10px] text-muted-foreground">
                        Explore
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Info */}
            <div className="px-2 text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" /> BlogSphere Social Community
              </div>
              <p className="text-[11px]">
                Built with Next.js 14, MongoDB, Tailwind CSS, and shadcn/ui.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground mt-12">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} BlogSphere. Live MongoDB social feed.
        </div>
      </footer>
    </div>
  );
}
