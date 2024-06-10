'use client'
import React,{useState} from 'react'
import Image from "next/image";
import { ClockCircleOutlined } from '@ant-design/icons';
import Footer from './Footer';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  
  return (
    <nav className="bg-theme-color text-white *:first-letter:text-center h-16 p-1 sticky w-screen">
    <div className="px-8 mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {/* Logo Div */}
          <div className="logo m-3">
            <a href="/" className="flex items-center">
              <ClockCircleOutlined style={{ fontSize: '2rem' }} />
              <span className="pl-3 text-xl font-bold ">LeetCode Scheduler</span>
            </a>
          </div>
          {/* Primary Div */}
          <div className="hidden md:flex items-center space-x-5 pr-3 ">
            <a href="/" className="hover:text-gray-400 text-md">About</a>
            <a href="" className="hover:text-gray-400 text-md">Questions</a>
          </div>
        </div>
        {/* Secondary Div */}
        <div className="hidden md:flex items-center space-x-1">
          <a href="/" className="py-2 px-3 bg-yellow-200 hover:bg-yellow-300 rounded-2xl hover:text-gray-400 transition duration-300">Login</a>
        </div>
        {/* Mobile Button */}
        <div className="md:hidden flex items-center">
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg> 
          </button>
        </div>
      </div>
    </div>
    {/* Mobile menu */}
    <div className={`mobile-menu ${isMobileMenuOpen?'':'hidden'}`}>
      <div className="md:hidden items-center bg-theme-color z-20">
        <a href="/" className="block py-5 px-10 text-md hover:hover:text-gray-500">About</a>
        <a href="/" className="block py-5 px-10 text-md hover:text-gray-500" >Questions</a>
      </div>
    </div>
    
  </nav>
    
  )
}

export default Navbar