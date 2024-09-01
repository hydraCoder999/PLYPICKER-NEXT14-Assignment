import ProductModel from "@/models/product.model";
import ConnctDB from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  try {
    const skip = (page - 1) * limit;

    await ConnctDB();
    const products = await ProductModel.find().skip(skip).limit(limit);
    const totalProducts = await ProductModel.countDocuments();

    return NextResponse.json(
      {
        message: "Products Fetched Successfully",
        products,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch the products:", error);
    return NextResponse.json(
      {
        message: "Failed to Fetch the Products",
      },
      { status: 400 }
    );
  }
}

// export async function GET(req: NextRequest): Promise<NextResponse> {
//   try {
//     await ConnctDB();
//     const products = await ProductModel.find();

//     return NextResponse.json(
//       {
//         message: "Products Fetched Successfully",
//         products,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       {
//         message: "Failed to Fetch the Products",
//       },
//       { status: 400 }
//     );
//   }
// }
