"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  Share2,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface Author {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  bio?: string;
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
  author: Author;
  likes: string[];
  createdAt: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user } = useAuth();

  const [post, setPost] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [likesCount, setLikesCount] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isLiking, setIsLiking] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${slug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Article not found");
          return;
        }

        setPost(data.post);
        setLikesCount(data.post.likes?.length || 0);

        if (user && data.post.likes) {
          setIsLiked(data.post.likes.includes(user.id));
        }
      } catch {
        setError("Failed to load article details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, user]);

  const handleLike = async () => {
    if (!user) {
      router.push(`/login?from=/posts/${slug}`);
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const res = await fetch(`/api/posts/${slug}/like`, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      console.error("Failed to like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete article");
      }
    } catch {
      alert("Error deleting article");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading story...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 px-4 text-center">
        <h2 className="text-2xl font-bold">Article not found</h2>
        <p className="text-muted-foreground max-w-md">
          {error || "The article you are looking for might have been removed or does not exist."}
        </p>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Button>
        </Link>
      </div>
    );
  }

  const isAuthor = user && (user.id === post.author?._id || user.role === "admin");
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur z-50">
        <div className="container mx-auto max-w-4xl flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>BlogSphere</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/write">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Write
              </Button>
            </Link>
            {user ? (
              <Link href="/profile">
                <Avatar className="h-8 w-8">
                  {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Story Container */}
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to all articles
        </Link>

        {/* Story Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{post.tag}</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.description}
          </p>

          {/* Author bar */}
          <div className="flex items-center justify-between py-4 border-y">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border">
                {post.author?.avatar ? (
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                ) : null}
                <AvatarFallback className="font-semibold">
                  {post.author?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm sm:text-base">
                  {post.author?.name}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> Published on {formattedDate}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={handleLike}
                disabled={isLiking}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{likesCount}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} title="Share">
                <Share2 className="h-4 w-4" />
              </Button>
              {isAuthor && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  title="Delete article"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Optional Cover Image */}
        {post.coverImage && (
          <div className="my-8 rounded-xl overflow-hidden border">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full max-h-[400px] object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <article className="my-8 space-y-4 text-base sm:text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
          {post.content}
        </article>

        <Separator className="my-10" />

        {/* Author Bio Footer */}
        <div className="p-6 rounded-xl border bg-card flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-14 w-14 border-2">
            {post.author?.avatar ? (
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
            ) : null}
            <AvatarFallback className="text-lg font-bold">
              {post.author?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-base">Written by {post.author?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {post.author?.bio ||
                "Writer and software enthusiast sharing thoughts and deep dives on BlogSphere."}
            </p>
          </div>
          <Link href="/profile">
            <Button variant="outline" size="sm">
              View Profile
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground mt-12">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} BlogSphere. Powered by Next.js & MongoDB.
        </div>
      </footer>
    </div>
  );
}
