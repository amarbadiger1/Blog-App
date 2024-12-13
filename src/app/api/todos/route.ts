import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },

      orderBy: { createdAt: "desc" },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    });

    const totalItems = await prisma.todo.count({
      where: {
        id: userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return NextResponse.json({
      todos,
      currentPage: page,
      totalPages,
    });
  } catch (error: any) {
    console.log("Error in Todos", error);
    return NextResponse.json(
      { message: "Server Error while todos reading", success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { todos: true },
    });
    console.log(user);

    if (!user) {
      return NextResponse.json(
        { message: "User not Found", success: false },
        { status: 404 }
      );
    }
    if (!user.issubscribed && user.todos.length >= 3) {
      return NextResponse.json(
        { message: "Subscribe for more", success: false },
        { status: 403 }
      );
    }
    const { title } = await request.json();
    const todo = await prisma.todo.create({
      data: {
        title,
        userId,
      },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch (error: any) {
    console.log("Error in Todos subscribe for more", error);
    return NextResponse.json(
      { message: "Server Error while taking data", success: false },
      { status: 500 }
    );
  }
}
