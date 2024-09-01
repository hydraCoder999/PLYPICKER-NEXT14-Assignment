import ReviewModel from "@/models/reviews.model";
import UserModel from "@/models/user.model";
import ConnctDB from "@/utils/dbConnect";
import { USER_TYPES } from "@/utils/types";
import { VerifyToken } from "@/utils/VerifyToken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authtoken")?.value;
  try {
    // const token = await request.cookies.get("authtoken")?.value;

    const { valid, decoded, message } = await VerifyToken(token);

    if (!valid) {
      return NextResponse.json(
        { message: message || "Unauthorized Access" },
        { status: 401 }
      );
    }

    await ConnctDB();

    if (typeof decoded === "object" && decoded !== null && "_id" in decoded) {
      const userId = (decoded as { _id: string })._id;
      const isUserExits = await UserModel.findById(userId);

      if (!isUserExits) {
        return NextResponse.json(
          { message: "Unauthorized Access" },
          { status: 404 }
        );
      }
      const matchCondition =
        isUserExits.role === USER_TYPES.ADMIN
          ? { admin: isUserExits._id }
          : { teamMember: isUserExits._id };

      const result = await ReviewModel.aggregate([
        {
          $match: matchCondition,
        },
        {
          $facet: {
            totalRequests: [{ $count: "count" }],
            approvedRequests: [
              { $match: { status: "Approved" } },
              { $count: "count" },
            ],
            rejectedRequests: [
              { $match: { status: "Rejected" } },
              { $count: "count" },
            ],
          },
        },
      ]);

      const [data] = result;
      return NextResponse.json({
        message: "Review data",
        reviewDetails: {
          totalRequests: data.totalRequests[0]?.count || 0,
          approvedRequests: data.approvedRequests[0]?.count || 0,
          rejectedRequests: data.rejectedRequests[0]?.count || 0,
        },
      });
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
        message: "Something went Wrong",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
