'use client'
import React,{useState} from 'react'
import { useRouter } from 'next/navigation'
import { ClockCircleOutlined } from '@ant-design/icons';
import OauthLoginDialog from '../dialog/OauthLoginDialog';
import { useSession, signOut} from 'next-auth/react';
import { Button } from "@material-tailwind/react";
import Link from 'next/link';

const Navbar = () => {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const {data: session, status} = useSession();

    const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  
  return (
    <nav className="bg-theme-color text-white *:first-letter:text-center h-16 p-1 fixed w-screen z-20">
    <div className="px-8 mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {/* Logo Div */}
          <div className="logo m-3">
            <Link href="/" className="flex items-center">
              <ClockCircleOutlined style={{ fontSize: '2rem' }} />
              <span className="pl-3 text-xl font-bold ">LeetCode Scheduler</span>
            </Link>
          </div>
          {/* Primary Div */}
          <div className="hidden md:flex items-center space-x-5 pr-3 ">
            {status === "authenticated" && <Link href="questions"><span className="hover:text-gray-400 text-md">Questions</span></Link> }
          </div>
        </div>
        {/* Secondary Div */}
        <div className="hidden md:flex items-center space-x-1">
        {status === "authenticated" ? (
          <Button 
            color="white" 
            size='sm' 
            onClick={() => {
              signOut()
            }}
          >
            Logout
          </Button>
        ):(
          <OauthLoginDialog/>
        )}
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