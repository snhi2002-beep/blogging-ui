"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Calendar,
  Clock,
  Globe,
  MapPin,
  Share2,
  Heart,
  Bookmark,
  Sparkles,
  PenSquare,
  LogOut,
  Trash2,
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

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = React.useState<"articles" | "about" | "saved">("articles");
  const [userPosts, setUserPosts] = React.useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = React.useState(true);

  const displayName = user ? user.name : "Guest Author";
  const displayEmail = user ? user.email : "guest@example.com";
  const displayBio =
    user?.bio ||
    "Writer and developer publishing stories on architecture, frontend frameworks, and fullstack applications.";
  const displayAvatar =
    user?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`;

  const fetchUserPosts = React.useCallback(async (authorId: string) => {
    try {
      setLoadingPosts(true);
      const res = await fetch(`/api/posts?author=${authorId}`);
      if (res.ok) {
        const data = await res.json();
        setUserPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Failed to load user posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  React.useEffect(() => {
    if (user?.id) {
      fetchUserPosts(user.id);
    } else {
      setLoadingPosts(false);
    }
  }, [user, fetchUserPosts]);

  const handleDeletePost = async (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setUserPosts((prev) => prev.filter((p) => p.slug !== slug));
      } else {
        alert("Failed to delete post");
      }
    } catch {
      alert("Error deleting post");
    }
  };

  const totalLikes = React.useMemo(() => {
    return userPosts.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);
  }, [userPosts]);

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
            <Link href="/profile" className="text-primary font-semibold">
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
                  <Button variant="ghost" size="sm" onClick={() => logout()} className="gap-1.5">
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button size="sm">Sign In</Button>
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* Cover Banner */}
        <div className="h-48 sm:h-64 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="container mx-auto max-w-5xl px-4">
          {/* Profile Header Card */}
          <div className="relative -mt-20 sm:-mt-24 mb-8 bg-card border rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-card shadow-md">
                  <AvatarImage src={displayAvatar} alt={displayName} />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {displayName}
                    </h1>
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Sparkles className="h-3 w-3 text-amber-500" />{" "}
                      {user ? user.role.toUpperCase() : "AUTHOR"}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {displayEmail}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <Link href="/write">
                  <Button className="gap-1.5">
                    <PenSquare className="h-4 w-4" /> New Article
                  </Button>
                </Link>
                <Button variant="outline" size="icon" title="Share Profile">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bio & Meta Info */}
            <div className="pt-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 max-w-3xl leading-relaxed">
                {displayBio}
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Global Author
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" /> blogsphere.dev
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Connected with MongoDB
                </span>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-xl font-bold tracking-tight">
                    {userPosts.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Published Articles</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-xl font-bold tracking-tight">
                    {totalLikes}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Likes Received</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-xl font-bold tracking-tight">
                    {user ? "Active" : "Guest"}
                  </div>
                  <div className="text-xs text-muted-foreground">Account Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b mb-8">
            <button
              onClick={() => setActiveTab("articles")}
              className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "articles"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              My Articles ({userPosts.length})
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "about"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              About & Topics
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "saved"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Saved Posts
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === "articles" && (
            <div>
              {loadingPosts ? (
                <div className="py-12 flex justify-center items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span>Loading articles...</span>
                </div>
              ) : userPosts.length === 0 ? (
                <div className="text-center py-16 border rounded-xl bg-card space-y-4">
                  <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-semibold">No articles published yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Share your ideas, code tutorials, and design tips with readers around the world.
                  </p>
                  <Link href="/write">
                    <Button className="gap-2">
                      <PenSquare className="h-4 w-4" /> Write an Article
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userPosts.map((article) => (
                    <Link
                      key={article._id}
                      href={`/posts/${article.slug}`}
                      className="block group"
                    >
                      <Card className="flex flex-col h-full justify-between hover:shadow-md transition-shadow group-hover:border-primary/50">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{article.tag}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {article.readTime}
                            </span>
                          </div>
                          <CardTitle className="text-xl leading-snug group-hover:text-primary transition-colors">
                            {article.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {article.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex items-center justify-between pt-0 text-xs text-muted-foreground border-t mt-4 p-4">
                          <span>
                            {new Date(article.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3.5 w-3.5" /> {article.likes?.length || 0}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:bg-destructive/10"
                              onClick={(e) => handleDeletePost(article.slug, e)}
                              title="Delete post"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6 max-w-3xl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Author Background</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>{displayBio}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Specialties</CardTitle>
                  <CardDescription>
                    Core technologies used across your stories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Next.js", "MongoDB", "TypeScript", "Tailwind CSS", "React", "Node.js"].map(
                      (skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="text-center py-16 border rounded-xl bg-card space-y-3">
              <Bookmark className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">No bookmarks yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Articles you bookmark while browsing will appear here for easy reading later.
              </p>
            </div>
          )}
        </div>
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
