import { useState } from "react";
import Image from "next/image";
import Dashboard from "../../components/Dashboard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import logo from "../../public/logo.png";

export default function Home() {



  return (
    <div className="bg-gray-200 h-screen">
      <Navbar />
        <div className="content-section m-12 w-auto h-4/5 bg-theme-color text-center flex rounded-lg">
          <div className="intro-text flex-1 ml-8 sm:mr-4 text-white items-center justify-center flex flex-col leading-10 w-full">
            <div className="max-w-xl">
              <h1 className="font-extrabold text-4xl mb-10 ">LeetCode Scheduler</h1>
              <p className="text-xl leading-relaxed pb-10">Introducing Leetcode Scheduler! This application facilitates the tracking of your Leetcode question completions and offers scheduling based on spaced-repetition learning techniques to optimize your learning process. Embark on your journey to Leetcode mastery today!</p>
              <button className="m-4">Login</button>
            </div>
          </div>
          <div className="hidden md:flex flex-1 items-center mr-10 rounded-lg ">
            <Image  src="/homeQuestions.png" alt="Questions" layout="responsive" width={100} height={100}  />

          </div>
        </div>

      <Footer />
    </div>
  );
}