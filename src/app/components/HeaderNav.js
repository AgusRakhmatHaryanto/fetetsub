'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa'; 

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Added state for userId
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!userId && !!token);
      setUserId(userId); // Set userId state
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <a onClick={() => router.push('/')} className="text-xl font-bold cursor-pointer">
          Tetsu Berkah Tralis
        </a>
        <ul className="flex space-x-4 items-center">
          <li><a onClick={() => router.push('/page/product')} className="cursor-pointer">Produk</a></li>
          <li><a onClick={() => router.push('/page/cart')} className="cursor-pointer">Cart</a></li>
          <li><a onClick={() => router.push('/page/order')} className="cursor-pointer">Pesanan</a></li>
          {isLoggedIn ? (
            <>
              <li>
                <a onClick={() => router.push(`/page/profile/${userId}`)} className="cursor-pointer">
                  <FaUser className="inline-block mr-1" /> Profil
                </a>
              </li>
              <li><button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link href="/register" className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">Register</Link></li>
              <li><Link href="/login" className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded">Login</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;