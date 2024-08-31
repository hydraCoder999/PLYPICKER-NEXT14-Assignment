import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-[hsl(0, 0%, 0%)] font-roboto">
      <h1 className="relative text-[clamp(5rem,40vmin,20rem)] font-extrabold m-0 mb-4 tracking-[1rem] text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300 animate-swing">
        404
      </h1>

      <div className="text-center max-w-[clamp(16rem,90vmin,25rem)] leading-[1.5]">
        <h2 className="mb-4 text-lg font-bold">We can't find that page</h2>
        <p className="mb-12 text-sm font-light">
          We're fairly sure that page used to be here, but seems to have gone
          missing. We do apologize on its behalf.
        </p>
        <Link
          href="/"
          className="inline-block px-16 py-4 text-sm uppercase bg-[hsl(0, 0%, 0%)] text-[hsl(0,0%,4%)] rounded-full shadow-md transition hover:bg-orange-500 hover:text-white"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
