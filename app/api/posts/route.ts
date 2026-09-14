export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { slugify, calculateReadTime } from "@/lib/posts";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");
    const authorId = searchParams.get("author");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const query: Record<string, any> = { published: true };

    if (tag && tag.toLowerCase() !== "all") {
      query.tag = { $regex: new RegExp(`^${tag}$`, "i") };
    }

    if (authorId) {
      query.author = authorId;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tag: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate("author", "name email avatar role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query),
    ]);

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to create a post." },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Invalid session. Please sign in again." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, content, tag, coverImage } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Post title is required" }, { status: 400 });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Post content is required" }, { status: 400 });
    }

    await connectToDatabase();

    const authorUser = await User.findById(payload.userId);
    if (!authorUser) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    let baseSlug = slugify(title);
    if (!baseSlug) {
      baseSlug = `post-${Date.now()}`;
    }
    let slug = baseSlug;
    let counter = 1;
    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const postDescription =
      description && description.trim()
        ? description.trim()
        : content.replace(/[#*`_]/g, "").slice(0, 160).trim() + "...";

    const readTime = calculateReadTime(content);

    const newPost = await Post.create({
      title: title.trim(),
      slug,
      description: postDescription,
      content,
      tag: tag?.trim() || "General",
      coverImage: coverImage?.trim() || "",
      readTime,
      author: payload.userId,
      published: true,
      likes: [],
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate("author", "name email avatar role")
      .lean();

    return NextResponse.json(
      { message: "Post published successfully", post: populatedPost },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}
