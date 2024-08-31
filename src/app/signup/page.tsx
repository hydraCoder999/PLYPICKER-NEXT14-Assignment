"use client";
import { httpAxios } from "@/utils/Axioshelper";
import { USER_TYPES } from "@/utils/types";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // Validation
    let valid = true;
    const newErrors = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      role: "",
    };

    if (firstName.trim() === "") {
      newErrors.firstName = "First name is required";
      valid = false;
    }
    if (firstName.length < 4) {
      newErrors.firstName = "First name at least 4 character";
      valid = false;
    }
    if (lastName.trim() === "") {
      newErrors.lastName = "Last name is required";
      valid = false;
    }

    if (email.length < 4) {
      newErrors.email = "Email must be at least 4 characters long";
      valid = false;
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    if (!role || role.trim() == "") {
      newErrors.role = "Role is required";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setLoading(true);
      try {
        const response = await httpAxios.post("/api/users", {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          confirmPassword,
          role,
        });
        toast.success(response.data.message);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      {/* Signup Form Container */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="w-full flex gap-3">
            {/* First Name Input */}
            <div>
              <label
                htmlFor="text"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your First Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>
            {/* Last Name Input */}
            <div>
              <label
                htmlFor="text"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Last Name
              </label>
              <input
                type="text"
                id="Lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your Last Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>
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

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmpassword"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmpassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Role Selection (Radio Buttons) */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Select Role
            </label>
            <div className="w-full flex items-center gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="team-member"
                  name="role"
                  value={USER_TYPES.TEAM_MEMBER}
                  checked={role === USER_TYPES.TEAM_MEMBER}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="team-member"
                  className="ml-2 text-sm text-gray-700"
                >
                  Team Member
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value={USER_TYPES.ADMIN}
                  checked={role === USER_TYPES.ADMIN}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="admin" className="ml-2 text-sm text-gray-700">
                  Admin
                </label>
              </div>
            </div>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600"
            >
              {loading ? "Loading.... " : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="text-right">
          <Link href="/login">
            <p className="text-blue-500 hover:underline">
              Already have an account?
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
