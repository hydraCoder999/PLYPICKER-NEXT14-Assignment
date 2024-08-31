import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import ConnctDB from "@/utils/dbConnect";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await ConnctDB();
    const { email, password } = await request.json();
    console.log(email, password);

    if (!email || !password)
      return NextResponse.json(
        { message: "Email and Password is Required" },
        { status: 400 }
      );

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid Cradentials" },
        { status: 400 }
      );
    }

    const isPaswordMatch = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPaswordMatch) {
      return NextResponse.json(
        { message: "Invalid Cradentials" },
        { status: 400 }
      );
    }

    if (!user.isVerifiedUser) {
      return NextResponse.json(
        { message: "User is Not Valid Please Validate The User" },
        { status: 400 }
      );
    }

    const token = await JWT.sign({ _id: user._id }, JWT_SECRET);

    const response = NextResponse.json(
      {
        user,
        message: "User Login succefully",
      },
      { status: 200 }
    );

    //set Cookies
    response.cookies.set("authtoken", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours Expiry
    });

    return response;
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Login Error" }, { status: 400 });
  }
}
