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
  MessageSquare,
  Bookmark,
  Sparkles,
  Award,
  PenSquare,
  Check,
  Plus,
} from "lucide-react";

const author = {
  name: "Jane Doe",
  username: "janedoe",
  role: "Senior Frontend Engineer & Tech Writer",
  bio: "Writing about modern frontend architecture, TypeScript, React ecosystem, and design systems. Building the future of the open web.",
  location: "San Francisco, CA",
  website: "https://janedoe.dev",
  joined: "March 2024",
  stats: {
    articles: 28,
    reads: "142.5K",
    followers: 4820,
    following: 312,
  },
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "UI/UX Design",
    "Web Performance",
    "GraphQL",
  ],
};

const userArticles = [
  {
    id: 1,
    title: "Building Modern Web Apps with Next.js 14 & shadcn/ui",
    description:
      "A deep dive into server components, streaming architecture, and composable UI primitives for enterprise scale.",
    date: "Sep 14, 2026",
    readTime: "5 min read",
    tag: "Next.js",
    likes: 342,
    comments: 48,
    featured: true,
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS and Design Systems",
    description:
      "How to structure accessible, themeable, and scalable CSS variable systems without polluting component logic.",
    date: "Sep 10, 2026",
    readTime: "8 min read",
    tag: "Tailwind CSS",
    likes: 219,
    comments: 26,
    featured: false,
  },
  {
    id: 3,
    title: "Understanding React Server Components Under the Hood",
    description:
      "Demystifying React Flight protocol, client boundaries, and how bundle size is drastically reduced.",
    date: "Aug 28, 2026",
    readTime: "10 min read",
    tag: "React",
    likes: 512,
    comments: 63,
    featured: false,
  },
  {
    id: 4,
    title: "Micro-frontends in 2026: Real-World Lessons",
    description:
      "When to adopt module federation versus monorepos, trade-offs in CI/CD pipelines, and developer experience.",
    date: "Aug 15, 2026",
    readTime: "7 min read",
    tag: "Architecture",
    likes: 189,
    comments: 19,
    featured: false,
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState<"articles" | "about" | "saved">("articles");
  const [isFollowing, setIsFollowing] = React.useState(false);

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
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
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
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&q=80&fit=crop"
                    alt={author.name}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    JD
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {author.name}
                    </h1>
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Sparkles className="h-3 w-3 text-amber-500" /> Pro Writer
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    @{author.username} · {author.role}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  className="gap-1.5"
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? (
                    <>
                      <Check className="h-4 w-4" /> Following
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Follow
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon" title="Share Profile">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="gap-1.5 hidden sm:inline-flex">
                  <PenSquare className="h-4 w-4" /> Write Post
                </Button>
              </div>
            </div>

            {/* Bio & Meta Info */}
            <div className="pt-6 space-y-4">
              <p className="text-sm sm:text-base text-foreground/90 max-w-3xl leading-relaxed">
                {author.bio}
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {author.location}
                </span>
                <a
                  href={author.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Globe className="h-4 w-4" /> {author.website.replace("https://", "")}
                </a>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Joined {author.joined}
                </span>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-xl font-bold tracking-tight">
                    {author.stats.articles}
                  </div>
                  <div className="text-xs text-muted-foreground">Articles Published</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-xl font-bold tracking-tight">
                    {author.stats.reads}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Views</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-xl font-bold tracking-tight">
                    {author.stats.followers.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-xl font-bold tracking-tight">
                    {author.stats.following}
                  </div>
                  <div className="text-xs text-muted-foreground">Following</div>
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
              Articles ({userArticles.length})
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userArticles.map((article) => (
                <Card
                  key={article.id}
                  className="flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{article.tag}</Badge>
                        {article.featured && (
                          <Badge variant="secondary" className="gap-1 text-[11px]">
                            <Award className="h-3 w-3" /> Featured
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-xl leading-snug">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between pt-0 text-xs text-muted-foreground border-t mt-4 p-4">
                    <span>{article.date}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 hover:text-destructive cursor-pointer transition-colors">
                        <Heart className="h-3.5 w-3.5" /> {article.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" /> {article.comments}
                      </span>
                      <span className="hover:text-primary cursor-pointer transition-colors">
                        <Bookmark className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6 max-w-3xl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Author Background</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Jane is a software architect with over a decade of experience designing and shipping high-performance web applications. She specializes in full-stack JavaScript/TypeScript architecture, distributed component libraries, and frontend performance optimization.
                  </p>
                  <p>
                    When she isn&apos;t writing code or technical guides, you can find her contributing to open-source developer tooling, speaking at conferences, or mentoring budding software engineers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Topics & Skills</CardTitle>
                  <CardDescription>
                    Areas of expertise and subjects regularly covered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {author.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
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
          © {new Date().getFullYear()} BlogSphere. Powered by Next.js & shadcn/ui.
        </div>
      </footer>
    </div>
  );
}
