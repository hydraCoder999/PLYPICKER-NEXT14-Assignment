"use client";
import React, { useContext, useEffect, useState } from "react";
import { ProductProps } from "@/Components/ProductCard";
import { UserContext } from "@/Context/UserContext";
import { httpAxios } from "@/utils/Axioshelper";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Banner from "@/Components/Banner";
import ImageEditor from "@/Components/ImageEditor";
import { USER_TYPES } from "@/utils/types";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [productData, setProductData] = useState<ProductProps>({
    _id: "",
    id: "",
    productName: "",
    price: "",
    image: "",
    productDescription: "",
    department: "",
  });

  const [initialProductData, setInitialProductData] =
    useState<ProductProps>(productData);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await httpAxios(`/api/products/${id}`);
        setProductData(response.data.productData);
        setInitialProductData(response.data.productData);
      } catch (error) {
        toast.error("Product Not Found");
        router.push("/");
      }
    };

    fetchProduct();
  }, [id, router, user]);

  const handleImageUpload = (url: string) => {
    setProductData((prevData) => ({
      ...prevData,
      image: url,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const hasDataChanged = () => {
    const initialData = { ...initialProductData };
    const currentData = { ...productData };

    // Convert price to string for consistent comparison
    if (initialData.price !== undefined && currentData.price !== undefined) {
      initialData.price = initialData.price.toString();
      currentData.price = currentData.price.toString();
    }

    return JSON.stringify(initialData) !== JSON.stringify(currentData);
  };

  const handleSaveData = async () => {
    try {
      setLoading(true);
      if (user && user.role === USER_TYPES.ADMIN) {
        const response = await httpAxios.put(
          `/api/products/submissions/admin`,
          productData
        );
        console.log(response.data);

        toast.success(response.data.message);
        setProductData(response.data.product);
        setInitialProductData(response.data.product);
      } else if (user && user.role === USER_TYPES.TEAM_MEMBER) {
        const response = await httpAxios.post(
          `/api/products/submissions/teammember`,
          productData
        );

        toast.success(response.data.message);
        router.push("/profile/my-submissions");
      }
    } catch (error) {
      toast.error("Failed to update product data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <Banner heading="Product Details" path={`Product > ${productData._id}`} />
      <div className="flex flex-col lg:flex-row w-full min-h-screen items-center justify-center p-3">
        <div className="relative lg:w-1/2 w-full mb-8 lg:mb-0 flex flex-col justify-center items-center">
          <div className="relative w-full max-w-sm rounded-lg shadow-md">
            <img
              src={productData.image}
              alt={productData.productName}
              className="w-full"
            />
            <div
              onClick={() => setIsImageEditorOpen(true)}
              className="w-10 h-10  flex items-center justify-center absolute top-2 right-2 z-1  bg-white p-2 rounded-full cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                className="w-8 h-8"
                viewBox="0 0 32 32"
              >
                <path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product ID
            </label>
            <input
              type="text"
              name="_id"
              value={productData._id}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={productData.productName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="text"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Description
            </label>
            <textarea
              name="productDescription"
              value={productData.productDescription}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={productData.department}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>

          {user && (
            <>
              {loading ? (
                <button
                  disabled={true}
                  className="bg-gray-400 cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                  loading
                </button>
              ) : (
                <button
                  onClick={handleSaveData}
                  disabled={!hasDataChanged} // Button is disabled if data hasn't changed
                  className={`mt-4 ${
                    hasDataChanged()
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out`}
                >
                  {user.role === USER_TYPES.ADMIN
                    ? "Save Data"
                    : "Submit Request"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {isImageEditorOpen && (
        <ImageEditor
          image={productData.image}
          onClose={() => setIsImageEditorOpen(false)}
          onImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
}
