"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, PenSquare, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { SearchBar } from "@/components/feed/search-bar";

export function Header({
  searchQuery = "",
  selectedTag = "All",
}: {
  searchQuery?: string;
  selectedTag?: string;
}) {
  const { user, logout, loading } = useAuth();

  return (
    <header className="border-b sticky top-0 bg-background/80 backdrop-blur z-50">
      <div className="container mx-auto max-w-6xl flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>BlogSphere</span>
        </Link>

        {/* Quick search input */}
        <SearchBar
          initialSearch={searchQuery}
          selectedTag={selectedTag}
          className="hidden md:flex max-w-sm w-full mx-6"
        />

        <nav className="flex items-center gap-3">
          <Link href="/write">
            <Button size="sm" className="gap-1.5">
              <PenSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Write Post</span>
            </Button>
          </Link>

          {!loading && (
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
  );
}
