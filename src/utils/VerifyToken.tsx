import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const VerifyToken = async (token: string | undefined) => {
  if (!token) {
    return { valid: false, message: "Token is required" };
  }

  try {
    // Verify the token using JWT
    const decoded = JWT.verify(token, JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, message: "Invalid or expired token" };
  }
};
