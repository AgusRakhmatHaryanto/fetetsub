'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Tetsu Berkah Tralis. All rights reserved.
        </div>
        <ul className="flex space-x-4 items-center">
          <li><a onClick={() => router.push('/page/about')} className="cursor-pointer">About Us</a></li>
          <li><a onClick={() => router.push('/page/contact')} className="cursor-pointer">Contact</a></li>
          <li><a onClick={() => router.push('/page/privacy')} className="cursor-pointer">Privacy Policy</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;