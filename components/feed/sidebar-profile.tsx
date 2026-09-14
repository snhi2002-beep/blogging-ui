"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function SidebarProfile() {
  const { user } = useAuth();

  if (user) {
    return (
      <Card className="shadow-sm">
        <CardContent className="pt-6 text-center space-y-3">
          <Avatar className="h-16 w-16 mx-auto border-2">
            {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
            <AvatarFallback className="text-lg font-bold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-base leading-tight">{user.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
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
    );
  }

  return (
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
  );
}
