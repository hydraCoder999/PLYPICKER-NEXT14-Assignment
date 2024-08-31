"use client";
import { UserContext } from "@/Context/UserContext";
import { httpAxios } from "@/utils/Axioshelper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  // Handle form submission
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // Validation
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      try {
        const response = await httpAxios.post("/api/users/login", {
          email,
          password,
        });

        setUser(response.data.user);
        toast.success(response.data.message);
        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error: any) {
        console.log(error);
        setUser(null);
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
      {/* Login Form Container */}
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600"
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-right">
          <Link href="/signup">
            <p className="text-blue-500 hover:underline">
              Create a New account?
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
