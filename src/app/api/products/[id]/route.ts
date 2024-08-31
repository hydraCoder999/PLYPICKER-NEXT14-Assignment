import ProductModel from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const productData = await ProductModel.findById(id);
    return NextResponse.json(
      {
        message: "Product is Found",
        productData: productData,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something Wrong",
      },
      {
        status: 500,
      }
    );
  }
}
