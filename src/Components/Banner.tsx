import React from "react";

interface BannerProps {
  heading: string;
  path: string;
}

export default function Banner({ heading, path }: BannerProps) {
  return (
    <div className="w-full banner-bg p-5  flex flex-col  ">
      <div className="container md:max-w-[80%] mx-auto ">
        <h1 className="text-2xl font-bold text-black mb-4 md:text-5xl capitalize">
          {heading}
        </h1>
        <p className="text-md font-bold text-black md:text-xl capitalize">
          Home &gt; {path}
        </p>
      </div>
    </div>
  );
}
