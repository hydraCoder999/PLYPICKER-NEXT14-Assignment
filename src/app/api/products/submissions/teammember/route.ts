import ProductModel from "@/models/product.model";
import ReviewModel from "@/models/reviews.model";
import UserModel from "@/models/user.model";
import ConnctDB from "@/utils/dbConnect";
import { VerifyToken } from "@/utils/VerifyToken";
import { NextRequest, NextResponse } from "next/server";

// Create a Sunmissions
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = request.cookies.get("authtoken")?.value;

    const { valid, decoded, message } = await VerifyToken(token);

    if (!valid) {
      return NextResponse.json(
        { message: message || "Unauthorized" },
        { status: 401 }
      );
    }

    if (typeof decoded === "object" && decoded !== null && "_id" in decoded) {
      const userId = (decoded as { _id: string })._id;
      const isUserExits = await UserModel.findById(userId);

      if (!isUserExits) {
        return NextResponse.json(
          { message: "Unauthorized User" },
          { status: 403 }
        );
      }

      const { _id, productName, price, image, productDescription, department } =
        await request.json();

      const product = await ProductModel.findById(_id);

      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }

      const review = await ReviewModel.create({
        refProduct: product._id,
        productName,
        price,
        image,
        productDescription,
        department,
        teamMember: isUserExits._id,
      });

      return NextResponse.json(
        {
          message: "Review Request submitted Successfully",
          review,
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
        message: "Failed to change the Product",
        error: error.message,
      },
      { status: 400 }
    );
  }
}

// Get My submissions
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const token = request.cookies.get("authtoken")?.value;

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
          { status: 403 }
        );
      }

      const mysubmissions = await ReviewModel.find({
        teamMember: isUserExits._id,
      }).sort({
        createdAt: -1,
      });

      return NextResponse.json(
        {
          message: "Your Submissions",
          mysubmissions,
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
        message: "Failed to change the Product",
        error: error.message,
      },
      { status: 400 }
    );
  }
}

// Delte Submission Request
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const token = request.cookies.get("authtoken")?.value;

    // Verify the token
    const { valid, decoded, message } = await VerifyToken(token);

    if (!valid) {
      return NextResponse.json(
        { message: message || "Unauthorized Access" },
        { status: 401 }
      );
    }

    await ConnctDB();

    // Check if decoded token has a valid user ID
    if (typeof decoded === "object" && decoded !== null && "_id" in decoded) {
      const userId = (decoded as { _id: string })._id;
      const isUserExists = await UserModel.findById(userId);

      if (!isUserExists) {
        return NextResponse.json(
          { message: "Unauthorized Access" },
          { status: 403 }
        );
      }

      const { submissionId } = await request.json();

      if (!submissionId) {
        return NextResponse.json(
          { message: "Submission ID is required" },
          { status: 400 }
        );
      }

      // Find the submission by ID
      const submission = await ReviewModel.findById(submissionId);

      if (!submission) {
        return NextResponse.json(
          { message: "Submission not found" },
          { status: 404 }
        );
      }

      // Check if the submission status is "Pending"
      if (submission.status !== "Pending") {
        return NextResponse.json(
          { message: "Only submissions with status 'Pending' can be deleted" },
          { status: 403 }
        );
      }

      // Delete the submission
      await ReviewModel.findByIdAndDelete(submissionId);

      return NextResponse.json(
        {
          message: "Submission deleted successfully",
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
        message: "Failed to delete the submission",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
