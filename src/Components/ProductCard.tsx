"use client";
import Link from "next/link";
import React from "react";

export interface ProductProps {
  _id: string;
  id: string;
  productName: string;
  price: string;
  image: string;
  productDescription: string;
  department: string;
}

const ProductCard: React.FC<ProductProps> = ({
  _id,
  id,
  productName,
  price,
  image,
  productDescription,
  department,
}) => {
  return (
    <div
      key={id}
      className="w-[400px]  border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 mb-4  bg-white"
    >
      <img
        src={image}
        alt={productName}
        className="w-full h-48 object-cover rounded-t-lg"
      />

      <div className="p-4 flex flex-col justify-between h-full">
        <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
          {productName}
        </h2>
        <p className="text-sm font-medium text-gray-500 mb-2">
          Department: {department}
        </p>
        <p className="text-gray-600 mb-4 line-clamp-3 overflow-hidden">
          {productDescription}
        </p>{" "}
        <p className="text-lg md:text-xl font-semibold text-green-600 mb-4">
          ₹ {price}
        </p>
        <Link href={`/product/${_id}`}>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md mt-auto">
            Product Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
