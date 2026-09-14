"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2, ArrowRight, Clock, Check } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export interface PostItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tag: string;
  coverImage?: string;
  readTime: string;
  createdAt: string;
  likes?: string[];
  author?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}

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

export function PostCard({ post }: { post: PostItem }) {
  const router = useRouter();
  const { user } = useAuth();

  const [likes, setLikes] = React.useState<string[]>(post.likes || []);
  const [copied, setCopied] = React.useState(false);

  const isLiked = Boolean(user && likes.includes(user.id));
  const likesCount = likes.length;

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login?from=/");
      return;
    }

    const nextLikes = isLiked
      ? likes.filter((id) => id !== user.id)
      : [...likes, user.id];

    setLikes(nextLikes);

    try {
      await fetch(`/api/posts/${post.slug}/like`, { method: "POST" });
    } catch (err) {
      console.error("Failed to like post:", err);
      setLikes(likes);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/posts/${post.slug}`;
    if (navigator.share) {
      navigator.share({ title: post.title, url });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="shadow-sm border hover:border-muted-foreground/30 transition-colors overflow-hidden">
      <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {post.author?.avatar ? (
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
              ) : null}
              <AvatarFallback className="font-semibold text-xs">
                {post.author?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-sm">
                  {post.author?.name || "Anonymous"}
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

      <CardContent className="px-4 sm:px-5 py-0 space-y-3">
        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-base sm:text-lg font-bold hover:text-primary transition-colors cursor-pointer leading-snug">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-foreground/90 line-clamp-3 leading-relaxed">
          {post.description || post.content}
        </p>

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

      <CardFooter className="px-4 sm:px-5 py-3 mt-3 border-t flex items-center justify-between text-muted-foreground text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 hover:text-destructive transition-colors ${
              isLiked ? "text-destructive font-semibold" : ""
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </button>

          <Link
            href={`/posts/${post.slug}`}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Discuss</span>
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
            title="Share post"
          >
            {copied ? (
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
}
