export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch session user:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
