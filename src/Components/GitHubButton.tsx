import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function GitHubButton(): React.ReactNode {
  return (
    <div className="absolute right-2 bottom-5 z-1">
      <Link href={"/"}>
        <button className="p-2 bg-black rounded-full">
          <Image
            src={"/github-logo.png"}
            alt="githublogo"
            width={20}
            height={20}
            className="rounded-full invert"
          ></Image>
        </button>
      </Link>
    </div>
  );
}
