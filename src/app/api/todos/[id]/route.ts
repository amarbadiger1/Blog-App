import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const todoId = params.id;

    const todo = await prisma.todo.findUnique({ where: { id: userId } });
    if (!todo) {
      return NextResponse.json(
        { message: "Todo not found", success: false },
        { status: 404 }
      );
    }

    if (todo.userId !== userId) {
      return NextResponse.json(
        { message: "FOrbidden", success: false },
        { status: 403 }
      );
    }

    await prisma.todo.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "Todo deleted successfully", success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("Error in Todos delete", error);
    return NextResponse.json(
      { message: "Server Error while deleting the todo", success: false },
      { status: 500 }
    );
  }
}
