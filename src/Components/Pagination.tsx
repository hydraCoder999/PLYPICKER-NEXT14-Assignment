"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center mt-4">
      <button
        className="px-3 py-1 text-sm font-medium text-white bg-black rounded-md hover:bg-orange-600 disabled:bg-gray-300"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <button
        className="px-3 py-1 text-sm font-medium text-white bg-black rounded-md hover:bg-orange-600"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
