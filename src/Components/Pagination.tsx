import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  totalPages,
}) => {
  console.log(totalPages, currentPage);

  return (
    <div className="flex justify-center my-5 gap-10">
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-orange-600 disabled:bg-gray-300"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <button
        disabled={currentPage == totalPages}
        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-orange-600 disabled:bg-gray-300"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
