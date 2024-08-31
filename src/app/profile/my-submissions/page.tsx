"use client";
import Banner from "@/Components/Banner";
import DeletePopUpWindow from "@/Components/DeletePopUpWindow";
import Loading from "@/Components/Loading";
import { UserContext } from "@/Context/UserContext";
import { httpAxios } from "@/utils/Axioshelper";
import { SUBMISSION_STATUS, USER_TYPES } from "@/utils/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface SubmissionProps {
  _id: string;
  createdAt: string;
  status: string;
}

export default function Page(): React.ReactNode {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [submissions, setSubmissions] = useState<SubmissionProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(
    null
  );

  // Calculate the indices for the current page
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = submissions.slice(
    indexOfFirstSubmission,
    indexOfLastSubmission
  );

  const totalPages = Math.ceil(submissions.length / submissionsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (!user || user.role === USER_TYPES.ADMIN) {
    router.push("/");
  }

  const FetchMySubmissions = async () => {
    setLoading(true);
    try {
      const response = await httpAxios.get(
        "/api/products/submissions/teammember"
      );
      setSubmissions(response.data.mysubmissions);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  const DeleteMySubmission = async () => {
    if (!submissionToDelete) return;
    setLoading(true);
    try {
      const response = await httpAxios.delete(
        "/api/products/submissions/teammember",
        {
          data: {
            submissionId: submissionToDelete,
          },
        }
      );
      toast.success("Submission deleted successfully!");
      await FetchMySubmissions();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
    setOpenDeletePopUp(false);
    setSubmissionToDelete(null);
  };

  useEffect(() => {
    FetchMySubmissions();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="container h-[90vh] flex items-center justify-center flex-col">
        <h1 className="font-bold text-4xl mb-4">No submissions Found</h1>
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
      <Banner heading="My Submission" path="Profile > My Submissions" />

      {/* Submissions Table Container */}
      <div className="w-full max-w-5xl p-4 space-y-4 bg-white rounded-md shadow-md mt-10 mx-auto border-[1.5px] border-black">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 border-b-2 border-gray-300 whitespace-nowrap">
                  Request ID
                </th>
                <th className="p-3 border-b-2 border-gray-300 whitespace-nowrap">
                  Submission Date
                </th>
                <th className="p-3 border-b-2 border-gray-300 whitespace-nowrap">
                  Status
                </th>
                <th className="p-3 border-b-2 border-gray-300 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSubmissions.map((submission) => (
                <tr key={submission?._id}>
                  <td className="p-3 border-b border-gray-200">
                    {submission?._id.slice(0, 10)}...
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    {submission?.createdAt.split("T")[0]}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    <span
                      className={`px-2 py-1 text-sm font-semibold rounded-full ${
                        submission?.status === SUBMISSION_STATUS.APPROVED
                          ? "text-green-800 bg-green-200"
                          : submission?.status === SUBMISSION_STATUS.REJECTED
                          ? "text-red-800 bg-red-200"
                          : "text-yellow-800 bg-yellow-200"
                      }`}
                    >
                      {submission?.status}
                    </span>
                  </td>
                  <td className="p-3 border-b border-gray-200 flex gap-2">
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-gray-300"
                      disabled={
                        submission?.status === SUBMISSION_STATUS.APPROVED ||
                        submission?.status === SUBMISSION_STATUS.REJECTED
                      }
                      onClick={() => {
                        setSubmissionToDelete(submission._id);
                        setOpenDeletePopUp(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-black rounded-md hover:bg-orange-600 disabled:bg-gray-300"
            onClick={() => handlePageChange(currentPage - 1)}
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
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 text-sm font-medium text-white bg-black rounded-md hover:bg-orange-600 disabled:bg-gray-300"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {openDeletePopUp && (
        <DeletePopUpWindow
          onClose={() => setOpenDeletePopUp(false)}
          onDelete={DeleteMySubmission}
        />
      )}
    </div>
  );
}
