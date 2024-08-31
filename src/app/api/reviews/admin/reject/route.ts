import ProductModel from "@/models/product.model";
import ReviewModel, { SUBMISSION_STATUS } from "@/models/reviews.model";
import UserModel from "@/models/user.model";
import ConnctDB from "@/utils/dbConnect";
import { VerifyToken } from "@/utils/VerifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("authtoken")?.value;

    const { request_id } = await request.json();

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

      const updatedReview = await ReviewModel.findByIdAndUpdate(
        request_id,
        {
          status: SUBMISSION_STATUS.REJECTED,
          admin: isAdminUser._id,
        },
        {
          new: true,
        }
      )
        .populate("refProduct")
        .populate("teamMember", "-password");

      if (!updatedReview) {
        return NextResponse.json(
          { message: "Review Request not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Request Reject Successfully",
          updatedReviewData: updatedReview,
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
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return NextResponse.redirect("/");
    }

    return NextResponse.json(
      {
        message: "Somethin Went wrong while Getting the Pending Reviews",
      },
      {
        status: 400,
      }
    );
  }
}
