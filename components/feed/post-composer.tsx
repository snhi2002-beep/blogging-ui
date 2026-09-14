"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const TAGS = [
  "Technology",
  "Next.js",
  "Engineering",
  "Design",
  "Architecture",
  "Tutorials",
  "Career",
];

export function PostComposer() {
  const router = useRouter();
  const { user } = useAuth();

  const [composerTitle, setComposerTitle] = React.useState("");
  const [composerContent, setComposerContent] = React.useState("");
  const [composerTag, setComposerTag] = React.useState("Technology");
  const [composerImage, setComposerImage] = React.useState("");
  const [showImageInput, setShowImageInput] = React.useState(false);
  const [isPosting, setIsPosting] = React.useState(false);
  const [postError, setPostError] = React.useState<string | null>(null);

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

      setComposerTitle("");
      setComposerContent("");
      setComposerImage("");
      setShowImageInput(false);
      router.refresh();
    } catch {
      setPostError("Network error while creating post.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="shadow-sm border">
      <CardContent className="pt-4 space-y-3">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            {user?.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
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

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <select
              value={composerTag}
              onChange={(e) => setComposerTag(e.target.value)}
              className="text-xs border rounded-md px-2 py-1 bg-background text-muted-foreground"
            >
              {TAGS.map((tag) => (
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
  );
}
