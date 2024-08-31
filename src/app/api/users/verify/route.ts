import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import JWT from "jsonwebtoken";
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams);

    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      verifyUserToken: token,
      verifyUserExpired: { $gt: new Date() }, // Check if token is still valid
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    user.isVerifiedUser = true;
    user.verifyUserToken = undefined;
    user.verifyUserExpired = undefined;
    await user.save();

    const authtoken = await JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET as string
    );

    const response = NextResponse.json(
      {
        message: "User successfully verified",
        user,
      },
      { status: 200 }
    );

    //set Cookies
    response.cookies.set("authtoken", authtoken, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours Expiry
    });

    return response;
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { message: "Failed to verify user" },
      { status: 500 }
    );
  }
}
