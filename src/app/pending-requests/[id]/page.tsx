"use client";
import Banner from "@/Components/Banner";
import Loading from "@/Components/Loading";
import { UserContext } from "@/Context/UserContext";
import { SUBMISSION_STATUS } from "@/models/reviews.model";
import { httpAxios } from "@/utils/Axioshelper";
import { USER_TYPES, UserInterface, PendingReview } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [dataSubmissionloading, setDataSubmissionloading] = useState(false);
  const [reviewData, setReviewData] = useState<PendingReview>();
  const router = useRouter();
  const { user } = useContext(UserContext);

  const fecthTheReview = async () => {
    setLoading(true);
    try {
      const resposne = await httpAxios.get(
        `/api/reviews/admin/pending-requests/${id}`
      );

      setReviewData(resposne.data.reviewData);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  const ApprovedRequestHandler = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setDataSubmissionloading(true);
    if (reviewData) {
      try {
        const resposne = await httpAxios.put(`/api/reviews/admin/approved`, {
          request_id: reviewData._id,
        });

        setReviewData(resposne.data.updatedReviewData);
        toast.success("Request is Approved Successfully ");
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    }
    setDataSubmissionloading(false);
  };

  const RejectRequestHandler = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setDataSubmissionloading(true);
    if (reviewData) {
      try {
        const resposne = await httpAxios.put(`/api/reviews/admin/reject`, {
          request_id: reviewData._id,
        });

        setReviewData(resposne.data.updatedReviewData);
        toast.success("Request is Rejected Successfully ");
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    }
    setDataSubmissionloading(false);
  };
  useEffect(() => {
    if (user?.role !== USER_TYPES.ADMIN) {
      router.push("/404");
    }
  }, [user, router]);

  useEffect(() => {
    fecthTheReview();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!reviewData) {
    return (
      <div className="container h-[90vh] flex items-center justify-center flex-col">
        <h1 className="font-bold text-4xl mb-4"> No review found</h1>
        <Link href={"/pending-requests"}>
          <button className="p-2 p-4 bg-orange-500 text-white text-md">
            Go To Pending Reviews
          </button>
        </Link>
      </div>
    );
  }
  return (
    <div className="container min-h-screen w-full pb-10">
      <Banner
        heading={`Pending Request`}
        path={`Dashboard > Pending Request > ${reviewData._id}`}
      />

      <div className="flex flex-col lg:flex-row lg:space-x-8 mx-auto max-w-6xl mt-8">
        {/* Team Member Details Section */}
        <div className="bg-white p-6 shadow-lg rounded-lg mb-8 border-2 md:max-w-[300px] text-wrap">
          <h2 className="text-xl font-bold mb-4">Submitted By</h2>
          <div className="space-y-4">
            <div className="flex items-start flex-wrap">
              <span className="font-semibold ">Reuest Id:</span>
              <p className="ml-1break-words">{reviewData._id}</p>
            </div>
            <div className="flex items-center flex-wrap">
              <span className="font-semibold ">First Name:</span>
              <p className="ml-1  break-words">
                {reviewData.teamMember.firstName}
              </p>
            </div>
            <div className="flex items-center flex-wrap">
              <span className="font-semibold ">Last Name:</span>
              <p className="ml-1  break-words">
                {reviewData.teamMember.lastName}
              </p>
            </div>
            <div className="flex items-center flex-wrap">
              <span className="font-semibold ">Email:</span>
              <p className="ml-1  break-words">{reviewData.teamMember.email}</p>
            </div>
            <div className="flex items-center flex-wrap">
              <span className="font-semibold ">Submission Date:</span>
              <p className="ml-1  break-words">
                {reviewData.createdAt.split("T")[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Product Comparison Section */}
        <div className="flex-1 space-y-6">
          {/* Original Product Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg border-2 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Original Product Details</h2>
            <div className="flex flex-col lg:flex-row lg:space-x-6 flex-1">
              <img
                src={reviewData.refProduct.image}
                alt={reviewData.refProduct.productName}
                className="w-full lg:w-1/3 h-64 object-cover rounded-lg"
              />
              <div className="mt-4 lg:mt-0 lg:w-2/3">
                <div className="mb-2 flex items-start">
                  <span className="font-semibold w-40">Product Name:</span>
                  <p className="">{reviewData.refProduct.productName}</p>
                </div>
                <div className="mb-2 flex items-start">
                  <span className="font-semibold w-40">Description:</span>
                  <p className="">{reviewData.refProduct.productDescription}</p>
                </div>
                <div className="mb-2 flex items-start">
                  <span className="font-semibold w-40">Price:</span>
                  <p className="">${reviewData.refProduct.price}</p>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold w-40">Department:</span>
                  <p className="">{reviewData.refProduct.department}</p>
                </div>
              </div>
            </div>
          </div>

          {/* New Request Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg border-2 flex flex-col">
            <h2 className="text-xl font-bold mb-4">New Request Details</h2>
            <div className="flex flex-col lg:flex-row lg:space-x-6 flex-1">
              <img
                src={reviewData.image}
                alt={reviewData.productName}
                className="w-full lg:w-1/3 h-64 object-cover rounded-lg"
              />
              <div className="mt-4 lg:mt-0 lg:w-2/3">
                <div className="mb-2 flex items-start">
                  <span className="font-semibold w-40">Product Name:</span>
                  <p className="">{reviewData.productName}</p>
                </div>
                <div className="mb-2 flex items-start">
                  <span className="font-semibold w-40">Description:</span>
                  <p className="">{reviewData.productDescription}</p>
                </div>
                <div className="mb-2 flex items-start">
                  <span className="font-semibold w-40">Price:</span>
                  <p className="">${reviewData.price}</p>
                </div>
                <div className="flex items-start">
                  <span className="font-semibold w-40">Department:</span>
                  <p className="">{reviewData.department}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        {reviewData.status !== "Pending" ? (
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold">
              Request is Alredy Checked and Status is{" "}
              <span
                className={`mx-2 ${
                  reviewData.status === "Approved"
                    ? "bg-green-300 "
                    : "bg-red-300 "
                }py-2 px-3`}
              >
                {reviewData.status}
              </span>
            </h1>
            <Link href={"/pending-requests"}>
              {" "}
              <button className="my-6 bg-orange-500 text-white rounded-xl py-2 px-5  cursor-pointer">
                Go to Pending Requests
              </button>
            </Link>
          </div>
        ) : (
          <>
            <button
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600"
              disabled={dataSubmissionloading}
              onClick={ApprovedRequestHandler}
            >
              {dataSubmissionloading ? "loading.... " : "Approve Request"}
            </button>
            <button
              disabled={dataSubmissionloading}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600"
              onClick={RejectRequestHandler}
            >
              {dataSubmissionloading ? "loading.... " : "Reject Request"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
