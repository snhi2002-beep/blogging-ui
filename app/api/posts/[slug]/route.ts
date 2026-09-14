export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { calculateReadTime } from "@/lib/posts";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToDatabase();
    const { slug } = params;

    let query: Record<string, any> = { slug };
    if (mongoose.Types.ObjectId.isValid(slug)) {
      query = { $or: [{ slug }, { _id: slug }] };
    }

    const post = await Post.findOne(query)
      .populate("author", "name email avatar role bio")
      .lean();

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load article" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { slug } = params;
    const post = await Post.findOne({ slug });

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (
      post.author.toString() !== payload.userId &&
      payload.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own articles" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, content, tag, coverImage, published } = body;

    if (title !== undefined) post.title = title.trim();
    if (description !== undefined) post.description = description.trim();
    if (content !== undefined) {
      post.content = content;
      post.readTime = calculateReadTime(content);
    }
    if (tag !== undefined) post.tag = tag.trim();
    if (coverImage !== undefined) post.coverImage = coverImage.trim();
    if (published !== undefined) post.published = Boolean(published);

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name email avatar role")
      .lean();

    return NextResponse.json({ message: "Article updated", post: updatedPost });
  } catch (error: any) {
    console.error("Failed to update post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { slug } = params;
    const post = await Post.findOne({ slug });

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (
      post.author.toString() !== payload.userId &&
      payload.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own articles" },
        { status: 403 }
      );
    }

    await Post.deleteOne({ _id: post._id });

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete article" },
      { status: 500 }
    );
  }
}
