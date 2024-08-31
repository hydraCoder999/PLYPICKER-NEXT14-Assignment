"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { httpAxios } from "@/utils/Axioshelper";
import Banner from "@/Components/Banner";
import Loading from "@/Components/Loading";
import { toast } from "react-toastify";
import Link from "next/link";
import { UserContext } from "@/Context/UserContext";
import { PendingReview, USER_TYPES } from "@/utils/types";

export default function PendingReviewsPage() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const fetchPendingReviews = async () => {
    setLoading(true);
    try {
      const response = await httpAxios.get(
        "/api/reviews/admin/pending-requests"
      );
      setReviews(response.data.pendingReviews);
    } catch (error: any) {
      toast.error("Error fetching pending requests.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role !== USER_TYPES.ADMIN) {
      router.push("/404"); // Redirect to custom 404 page
    }
  }, [user, router]);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="container h-[90vh] flex items-center justify-center flex-col">
        <h1 className="font-bold text-4xl mb-4"> No Pending Requests Found</h1>
        <Link href={"/"}>
          <button className="p-2 p-4 bg-orange-500 text-white text-md rounded-lg">
            Go To Home Page
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container pb-8">
      <Banner heading="Pending Requests" path="Dashboard > Pending Requests" />

      <div className="w-full max-w-5xl p-4 space-y-4 bg-white rounded-md shadow-md mt-10 mx-auto border-[1.5px] border-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 border-b-2 border-gray-300">Request ID</th>
                <th className="p-3 border-b-2 border-gray-300">Product ID</th>
                <th className="p-3 border-b-2 border-gray-300">Request Date</th>
                <th className="p-3 border-b-2 border-gray-300">User Name</th>
                <th className="p-3 border-b-2 border-gray-300">Review</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((review) => (
                <tr key={review._id}>
                  <td className="p-3 border-b border-gray-200">
                    {review._id.slice(0, 10)}...
                  </td>
                  <Link href={`/product/${review.refProduct._id}`}>
                    {" "}
                    <td className="p-3 border-b border-gray-200 cursor-pointer text-blue-900">
                      {review.refProduct._id.toString().slice(0, 10)}...
                    </td>
                  </Link>
                  <td className="p-3 border-b border-gray-200">
                    {review.createdAt.split("T")[0]}
                  </td>
                  <td className="p-3 border-b border-gray-200 capitalize">
                    {review.teamMember.firstName +
                      " " +
                      review.teamMember.lastName}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    <Link href={`/pending-requests/${review._id}`}>
                      <button className="px-3 py-1 text-white bg-orange-500 rounded-md hover:bg-black">
                        Review
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-black rounded-md hover:bg-orange-600 disabled:bg-gray-300"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                currentPage === index + 1
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-black rounded-md hover:bg-orange-600 disabled:bg-gray-300"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
