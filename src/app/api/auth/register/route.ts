import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, name } = body;

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "ユーザー名、メールアドレス、パスワードは必須です。" },
        { status: 400 }
      );
    }

    // Validate username: alphanumeric + underscore, lowercase, 3-20 chars
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          error:
            "ユーザー名は小文字の英数字またはアンダースコアで3〜20文字にしてください。",
        },
        { status: 400 }
      );
    }

    // Check if username already taken
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return NextResponse.json(
        { error: "このユーザー名はすでに使用されています。" },
        { status: 409 }
      );
    }

    // Check if email already taken
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "このメールアドレスはすでに登録されています。" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        name: name || null,
      },
    });

    // Return user without passwordHash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "ユーザー登録中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
