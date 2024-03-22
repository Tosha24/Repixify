import Navbar from "@/components/shared/Navbar";
import { redirect } from "next/navigation";
import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

const Home = () => {
  return (
    <div className="w-full">
      <Navbar />
      <div
        style={{
          background: 'url("/bg.svg")',
          backgroundSize: "cover",
          backgroundAttachment: "fixed", // This keeps the background stationary as the user scrolls
        }}
        className="min-h-screen flex flex-col justify-center items-center text-white"
      >
        <div className=" flex flex-col justify-center items-center">
          <h1 className=" text-6xl text-center font-bold mb-4 font text-yellow-200/90 max-w-[900px]">
            From ordinary to extraordinary in seconds.
          </h1>
          <p className="text-center text-white max-w-[900px] text-3xl font-bold">
            Transform, enhance, create.{" "}
            <span className="text-lime-100 font-extrabold text-4xl">
              Welcome to Repixify✨
            </span>
          </p>
        </div>

        <button className=" bg-white text-black hover:bg-white/60 transition duration-300 ease-in-out p-3 mt-4 rounded-[8px] font-bold text-xl">
          <a href="/sign-up">Get Started</a>
          <span className="ml-2">
            <FaLongArrowAltRight className="inline" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Home;
