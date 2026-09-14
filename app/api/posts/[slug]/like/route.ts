import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Please log in to like this post" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    await connectToDatabase();
    const { slug } = params;
    const post = await Post.findOne({ slug });

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const userObjectId = new mongoose.Types.ObjectId(payload.userId);
    const existingIndex = post.likes.findIndex((id) =>
      id.equals(userObjectId)
    );

    let liked = false;
    if (existingIndex > -1) {
      post.likes.splice(existingIndex, 1);
      liked = false;
    } else {
      post.likes.push(userObjectId);
      liked = true;
    }

    await post.save();

    return NextResponse.json({
      liked,
      likesCount: post.likes.length,
    });
  } catch (error: any) {
    console.error("Failed to toggle like:", error);
    return NextResponse.json(
      { error: error.message || "Failed to toggle like" },
      { status: 500 }
    );
  }
}
