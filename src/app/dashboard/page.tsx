"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Banner from "@/Components/Banner";
import ProductCard from "@/Components/ProductCard";
import Pagination from "@/Components/Pagination";

interface Product {
  _id: string;
  productName: string;
  price: string;
  image: string;
  productDescription: string;
  department: string;
  id: string;
}
interface ApiResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}
const ITEMS_PER_PAGE = 20;

const fetchProducts = async (page: number): Promise<ApiResponse> => {
  try {
    const res = await axios.get<ApiResponse>(
      `/api/products?page=${page}&limit=${ITEMS_PER_PAGE}`
    );
    return res.data;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return {
      products: [],
      totalPages: 1,
      currentPage: 1,
    };
  }
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts(currentPage);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    };

    loadProducts();
  }, [currentPage]);

  return (
    <div className="w-full min-h-screen">
      <Banner heading="Dashboard" path="dashboard" />

      <div className="p-4 flex flex-wrap items-center justify-center gap-5">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            id={product.id}
            productName={product.productName}
            price={product.price}
            image={product.image}
            productDescription={product.productDescription}
            department={product.department}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
          }
        }}
      />
    </div>
  );
}
