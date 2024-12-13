import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { message: "User Not found ", success: false },
        { status: 404 }
      );
    }

    const subscriptionEnds = new Date();
    subscriptionEnds.setMonth(subscriptionEnds.getMonth() + 1);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { issubscribed: true, subscriptionEnd: subscriptionEnds },
    });

    return NextResponse.json(
      {
        message: "Subscription Successfully completed",
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("Error while updating subscription", error);
    return NextResponse.json(
      { message: "Server Error while subscription", success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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
      select: {
        issubscribed: true,
        subscriptionEnd: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: "User Not found ", success: false },
        { status: 404 }
      );
    }

    const now = new Date();

    if (user.subscriptionEnd && user.subscriptionEnd < now) {
      await prisma.user.update({
        where: { id: userId },
        data: { issubscribed: true, subscriptionEnd: null },
      });
      return NextResponse.json({
        issubscribed: false,
        subscriptionEnd: null,
      });
    }
    return NextResponse.json({
      issubscribed: user.issubscribed,
      subscriptionEnd: user.subscriptionEnd,
    });
  } catch (error: any) {
    console.log("Error while updating subscription", error);
    return NextResponse.json(
      { message: "Server Error while subscription", success: false },
      { status: 500 }
    );
  }
}
