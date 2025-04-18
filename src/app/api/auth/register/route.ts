import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    console.log("Registration attempt for email:", email);

    if (!name || !email || !password) {
      console.log("Missing fields:", { name, email, password: !!password });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    console.log("Password hashed successfully");

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    console.log("User created successfully:", { id: user.id, email: user.email });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 