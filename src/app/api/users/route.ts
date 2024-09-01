import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import UserModel from "@/models/user.model";
import ConnctDB from "@/utils/dbConnect";
import VERIFY_EMAIL_TEMPLATE from "@/Template/VerifyEmailTemplate";
import { sendEmailService } from "@/utils/SendEmailService";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { firstName, lastName, email, password, confirmPassword, role } =
      await request.json();
    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }
    await ConnctDB();
    const isUserAlreadyExist = await UserModel.findOne({
      email: email,
    });

    if (isUserAlreadyExist) {
      return NextResponse.json(
        { message: "User already exist" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const token = crypto.randomBytes(32).toString("hex");
    const verifyUserExpired = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create the user
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      role,
      verifyUserToken: token,
      verifyUserExpired,
    });

    // Send verification email
    const verificationUrl = `${process.env.BASE_URL}/verify/${token}`;

    const emailSubject = "Your verification link for authentication";
    const emailHtml = VERIFY_EMAIL_TEMPLATE(
      user.firstName + user.lastName,
      verificationUrl
    );
    const emailOptions = {
      to: user.email,
      subject: emailSubject,
      html: emailHtml,
    };
    await sendEmailService(emailOptions);

    return NextResponse.json(
      {
        message:
          "User is Registered. Please check your email for verification.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        message: "Failed to create user",
      },
      { status: 400 }
    );
  }
}
