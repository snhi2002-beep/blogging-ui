"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, ArrowLeft, Loader2, Sparkles, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const suggestedTags = [
  "Technology",
  "Next.js",
  "Engineering",
  "Design",
  "Architecture",
  "TypeScript",
  "Tutorials",
  "Career",
];

export default function WritePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = React.useState("");
  const [tag, setTag] = React.useState("Technology");
  const [description, setDescription] = React.useState("");
  const [content, setContent] = React.useState("");
  const [coverImage, setCoverImage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const wordCount = React.useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const estimatedMinutes = React.useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("Please enter an article title.");
      return;
    }

    if (!content.trim()) {
      setErrorMessage("Article content cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tag,
          description,
          content,
          coverImage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to publish article.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/posts/${data.post.slug}`);
      router.refresh();
    } catch {
      setErrorMessage("A network error occurred while publishing. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur z-50">
        <div className="container mx-auto max-w-5xl flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-80">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 font-bold text-xl">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Drafting Story</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{wordCount} words (~{estimatedMinutes} min read)</span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || authLoading}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Publish Story
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-md bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Article Metadata</CardTitle>
              <CardDescription>
                Configure the primary information for your new article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Scaling Next.js with MongoDB and Server Components"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag">Category / Tag</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {suggestedTags.map((t) => (
                    <Badge
                      key={t}
                      variant={tag === t ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => setTag(t)}
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
                <Input
                  id="tag"
                  placeholder="Custom tag (e.g. AI, Microservices)"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Excerpt / Summary</Label>
                <Input
                  id="description"
                  placeholder="Brief synopsis displayed on article cards and search results (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={300}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
                <Input
                  id="coverImage"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Story Body *</CardTitle>
              <CardDescription>
                Write your full post using plain text or Markdown formatting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your story here... You can use paragraphs, lists, code snippets, and reflections."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[360px] text-base leading-relaxed resize-y font-mono"
                required
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Article"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
