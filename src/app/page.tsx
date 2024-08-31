import GitHubButton from "@/Components/GitHubButton";
import React from "react";

export default function Home() {
  return (
    <div className="w-full min-h-[90vh]  flex flex-col justify-center items-center bg-white p-4">
      <h1 className="text-5xl md:text-[20vh] font-bold text-center text-black mb-4">
        PLYPICKER
      </h1>
      <h2 className="text-3xl md:text-[18vh] font-semibold text-center text-orange-500 mb-4">
        NEXT JS 14
      </h2>
      <h3 className="text-xl md:text-[13vh] font-medium text-center text-gray-600 md:mt-10">
        INTERNSHIP TASK
      </h3>
      <GitHubButton />
    </div>
  );
}
