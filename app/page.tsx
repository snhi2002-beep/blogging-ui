"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Calendar, Clock, ArrowRight, Search, Sparkles, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const posts = [
  {
    id: 1,
    title: "Building Modern Web Apps with Next.js 14 & shadcn/ui",
    description: "Explore the architectural patterns and component libraries shaping the modern React ecosystem.",
    date: "Sep 14, 2026",
    readTime: "5 min read",
    tag: "Next.js",
    author: "Jane Doe",
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS and Design Systems",
    description: "How to structure accessible, themeable, and maintainable styles for scalable UI projects.",
    date: "Sep 10, 2026",
    readTime: "8 min read",
    tag: "Tailwind CSS",
    author: "Alex Rivers",
  },
  {
    id: 3,
    title: "The Evolution of Frontend Engineering",
    description: "From static site generators to edge computing and server components: what developers need to know.",
    date: "Sep 05, 2026",
    readTime: "6 min read",
    tag: "Engineering",
    author: "Chris Vance",
  },
];

export default function Home() {
  const { user, logout, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur z-50">
        <div className="container mx-auto max-w-5xl flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>BlogSphere</span>
          </div>
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

            {!loading && (
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
            Fullstack MongoDB & Next.js 14
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Stories, insights, and ideas for builders.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Welcome to your new blogging platform. Equipped with MongoDB connection, JWT sessions, and production-grade authentication.
          </p>
          <div className="flex max-w-md mx-auto items-center gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-9" />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </section>

        {/* Featured Posts */}
        <section id="articles" className="py-12 container mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Latest Articles</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.tag}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 leading-snug">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between pt-0 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{post.author}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {post.date}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
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
