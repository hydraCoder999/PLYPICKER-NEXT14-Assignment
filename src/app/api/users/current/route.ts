import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import JWT from "jsonwebtoken";
import ConnctDB from "@/utils/dbConnect";
import UserModel from "@/models/user.model";

interface JwtPayload {
  _id: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const currentUserToken = req.cookies.get("authtoken")?.value;

    // Check if token is missing
    if (!currentUserToken) {
      return NextResponse.json(
        {
          message: "Token is missing. Please login again.",
          success: false,
        },
        { status: 200 }
      );
    }

    // Verify token
    const isVerifyToken = JWT.verify(
      currentUserToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload; // Assert the type of the decoded token

    await ConnctDB();
    // Fetch user if token is valid
    const User = await UserModel.findById(isVerifyToken._id).select(
      "-password"
    );

    return NextResponse.json(
      {
        message: "User found successfully",
        success: true,
        User,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        {
          message: "Token has expired. Please login again.",
          success: false,
        },
        { status: 401 }
      );
    } else if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        {
          message: "Invalid token. Please login again.",
          success: false,
        },
        { status: 401 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Seesion expired Login Again.",
          success: false,
        },
        { status: 500 }
      );
    }
  }
}
