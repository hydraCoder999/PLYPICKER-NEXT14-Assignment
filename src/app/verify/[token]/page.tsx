"use client";

import { useState, useContext, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { httpAxios } from "@/utils/Axioshelper";
import Image from "next/image";
import { UserContext } from "@/Context/UserContext";
import { toast } from "react-toastify";
import Link from "next/link";
import Loading from "@/Components/Loading";

export default function VerifyPage(): React.ReactNode {
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { token } = useParams();

  const handleVerify = async () => {
    if (!token) {
      setErrorMessage("Invalid or missing token.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await httpAxios.get(`/api/users/verify?token=${token}`);
      setIsVerified(true);
      toast.success(response.data.message);
    } catch (error: any) {
      console.error("Error verifying user:", error);
      setErrorMessage(error.response.data.message || "Verification failed.");
      toast.error(error.response.data.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-center mb-4">
              <Image
                src={
                  "https://firebasestorage.googleapis.com/v0/b/plypicker-assignment-6142d.appspot.com/o/images%2Flogo.png?alt=media&token=a6d631b2-e8a1-4f6e-bbd1-c2202ae1b2c7"
                }
                width={150}
                height={150}
                alt="logo"
              />
            </div>

            {!isVerified ? (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  Verify Your Account
                </h2>

                {errorMessage && (
                  <div className="text-center text-red-500 mb-4">
                    {errorMessage}
                  </div>
                )}

                <div className="text-center my-4">
                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  User Verified Successfully!
                </h2>
                <p className="text-gray-700 text-center mb-6">
                  Your account has been verified successfully. Please proceed to
                  log in.
                </p>
                <div className="text-center my-4">
                  <Link href="/login">
                    <button className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
                      Go to Login
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </Suspense>
    </>
  );
}
