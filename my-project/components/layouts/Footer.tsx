import React from 'react';

const Footer = () => {
  return (
    <div className='fixed inset-x-0 bottom-0 bg-theme-color text-white p-4 text-center'>
      © {new Date().getFullYear()} Pak Shing Kan. All rights reserved.
    </div>
  );
};

export default Footer;