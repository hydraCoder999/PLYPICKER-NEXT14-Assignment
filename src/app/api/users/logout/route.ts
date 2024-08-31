import { NextRequest, NextResponse } from "next/server";
import JWT from "jsonwebtoken";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const authtoken = await req.cookies.get("authtoken")?.value;
  if (!authtoken) {
    return NextResponse.json(
      {
        message: "UnAuthorized Access",
      },
      {
        status: 401,
      }
    );
  }

  const decode = JWT.verify(authtoken, process.env.JWT_SECRET as string);

  //   console.log(decode);
  if (!decode) {
    return NextResponse.json(
      {
        message: "UnAuthorized Access",
      },
      {
        status: 401,
      }
    );
  }

  const response = NextResponse.json(
    {
      message: "LogOut Successfully",
    },
    {
      status: 200,
    }
  );

  response.cookies.set("authtoken", "", {
    expires: new Date(0),
  });

  return response;
}
