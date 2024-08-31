"use client";
import Banner from "@/Components/Banner";
import { UserContext } from "@/Context/UserContext";
import { httpAxios } from "@/utils/Axioshelper";
import { USER_TYPES } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface D {
  totalRequests: string;
  approvedRequests: string;
  rejectedRequests: string;
}

export default function Page(): React.ReactNode {
  const { user, setLoading } = useContext(UserContext);
  const [reviewDetails, setReviewDetails] = useState<D>();
  const fetchReviewDetails = async () => {
    try {
      const response = await httpAxios.get("/api/users/reviewdata");
      console.log(response);

      setReviewDetails(response.data.reviewDetails);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchReviewDetails();
  }, []);
  return (
    <div className="container pb-8">
      <Banner heading="Profile Page" path="Profile" />
      <div className="w-full max-w-3xl p-4 space-y-4 bg-white rounded-md shadow-md mt-10 mx-auto border-[1.5px] border-black">
        <div className="w-full py-2 flex items-center gap-5 pb-5 border-b-[2px] flex-col">
          <Image
            src={"/profile.png"}
            alt="profile-image"
            width={130}
            height={130}
            className="rounded-full border-[3px]"
          ></Image>
          <div>
            <h1 className="text-2xl font-bold text-gray-700">
              {user?.firstName + " " + user?.lastName}
            </h1>
            <p className="text-md font-light text-orange-800">{user?.email}</p>
          </div>
        </div>{" "}
        <div className="w-full py-2 flex flex-col items-center gap-5 pt-5 ">
          <div className="w-full flex items-center flex-col justify-between gap-3 md:flex-row">
            <div className="w-full">
              <label
                htmlFor="First Name"
                className="block mb-2 text-lg font-medium text-gray-600"
              >
                First Name
              </label>
              <input
                type="First Name"
                id="First Name"
                value={user?.firstName}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none "
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="Last Name"
                className="block mb-2 text-lg font-medium text-gray-600"
              >
                Last Name
              </label>
              <input
                type="Last Name"
                id="Last Name"
                value={user?.lastName}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none "
              />
            </div>
          </div>
          <div className="w-full flex items-center flex-col justify-between gap-3 md:flex-row">
            <div className="w-full">
              <label
                htmlFor="Email"
                className="block mb-2 text-lg font-medium text-gray-600"
              >
                Email
              </label>
              <input
                type="Email"
                id="Email"
                value={user?.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none "
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="Role"
                className="block mb-2 text-lg font-medium text-gray-600"
              >
                Role
              </label>
              <input
                type="Role"
                id="Role"
                value={user?.role}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none "
              />
            </div>
          </div>
          <div className="w-full flex items-center flex-col justify-between gap-3 md:flex-row mt-5">
            {/* Total Requests Card */}
            <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Total Requests
              </h3>
              <p className="text-4xl font-bold text-blue-600">
                {reviewDetails ? reviewDetails?.totalRequests : 0}
              </p>
            </div>

            {/* Approved Requests Card */}
            <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Approved Requests
              </h3>
              <p className="text-4xl font-bold text-green-600">
                {" "}
                {reviewDetails ? reviewDetails?.approvedRequests : 0}
              </p>
            </div>

            {/* Rejected Requests Card */}
            <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Rejected Requests
              </h3>
              <p className="text-4xl font-bold text-red-600">
                {" "}
                {reviewDetails ? reviewDetails?.rejectedRequests : 0}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-end gap-4">
          {user?.role === USER_TYPES.TEAM_MEMBER && (
            <Link href={"/profile/my-submissions"}>
              <button className="bg-green-900 text-white rounded-xl py-2 px-5 cursor-pointer">
                My Submissions
              </button>
            </Link>
          )}
          {user?.role === USER_TYPES.ADMIN && (
            <Link href={"/pending-requests"}>
              <button className="bg-yellow-400 text-black font-bold rounded-xl py-2 px-5  cursor-pointer">
                Pending Requests
              </button>
            </Link>
          )}
          <button
            disabled
            className="bg-orange-500 text-white rounded-xl py-2 px-5 opacity-70 cursor-pointer"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
