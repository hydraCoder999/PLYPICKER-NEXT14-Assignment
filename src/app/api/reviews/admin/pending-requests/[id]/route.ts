import ReviewModel from "@/models/reviews.model";
import UserModel from "@/models/user.model";
import ConnctDB from "@/utils/dbConnect";
import { VerifyToken } from "@/utils/VerifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("authtoken")?.value;

    // Verify the token
    const { valid, decoded, message } = await VerifyToken(token);

    if (!valid) {
      // Handle invalid token scenario
      return NextResponse.json(
        { message: message || "Unauthorized" },
        { status: 401 }
      );
    }

    await ConnctDB();

    if (typeof decoded === "object" && decoded !== null && "_id" in decoded) {
      const userId = (decoded as { _id: string })._id;
      const isAdminUser = await UserModel.findById(userId);

      if (!isAdminUser || isAdminUser.role !== "ADMIN") {
        return NextResponse.json(
          { message: "Unauthorized User" },
          { status: 403 }
        );
      }

      const review = await ReviewModel.findById(id)
        .populate("refProduct")
        .populate("teamMember", "-password");

      if (!review) {
        return NextResponse.json(
          { message: "Review Submission Not Found  not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Review Submission data updated successfully",
          reviewData: review,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return NextResponse.redirect("/");
    }
    return NextResponse.json(
      {
        message: "Review Fetching Error",
      },
      {
        status: 400,
      }
    );
  }
}
