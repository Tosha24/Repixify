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
          <h1 className=" text-6xl text-center font-semibold mb-4 font text-lime-200 max-w-[900px]">
            From ordinary to extraordinary in seconds.
          </h1>
          <p className="text-center text-lime-50 max-w-[900px] text-3xl">
            Transform, enhance, create.{" "}
            <span className="text-slate-200/20 font-medium text-4xl">
              Welcome to Repixify✨
            </span>
          </p>
        </div>

        <button className=" bg-btnColor text-btnText hover:bg-btnHover transition duration-300 ease-in-out p-3 mt-4 rounded-[8px] font-bold text-xl">
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
