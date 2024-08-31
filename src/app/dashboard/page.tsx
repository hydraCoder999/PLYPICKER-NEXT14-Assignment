import Banner from "@/Components/Banner";
import ProductCard from "@/Components/ProductCard";
import { httpAxios } from "@/utils/Axioshelper";
import React from "react";

interface Product {
  _id: string;
  productName: string;
  price: string;
  image: string;
  productDescription: string;
  department: string;
  id: string;
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await httpAxios.get("/api/products", {});
    const products = res.data.products;

    return products;
  } catch (error: any) {
    console.error("Error fetching data:", error);

    return [];
  }
}

export default async function Page() {
  const products = await fetchProducts();
  return (
    <div className="w-full min-h-screen">
      <Banner heading="DashBoard" path="dashboard" />

      {/* Render the list of products */}
      <div className="p-4 flex flex-wrap items-center justify-center gap-5">
        {products &&
          products?.map((product) => (
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
    </div>
  );
}
