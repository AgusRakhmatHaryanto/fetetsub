"use client"

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import FormatCurrency from '@/app/components/FormatCurrency';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const items = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItems(items);
    }
  }, []);

  const handleRemoveItem = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }
    toast.success('Produk berhasil dihapus dari keranjang!');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + ((item.price || 0) * (item.size || 1)), 0);
  };

  const formatSize = (size) => {
    return size.toString().replace('.', ',');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Keranjang Belanja</h1>
        <p className="mb-4">Keranjang belanja Anda kosong.</p>
        <Link href="/page/product" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Kembali ke Halaman Produk
        </Link>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Keranjang Belanja</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Ringkasan Keranjang</h2>
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${item.size}`} className="flex justify-between items-center mb-4 pb-4 border-b">
              <div className="flex items-center">
                <img
                  src={item.coverImage || 'https://via.placeholder.com/80'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div>
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Ukuran: {item.size ? `${formatSize(parseFloat(item.size).toFixed(3))} m²` : ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    Harga per m²: <FormatCurrency value={item.price || 0} />
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="font-bold text-lg mr-4">
                  Total: <FormatCurrency value={(item.price || 0) * (item.size || 1)} />
                </p>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="font-semibold text-lg">Total</p>
            <p className="font-bold text-xl"><FormatCurrency value={calculateTotal()} /></p>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Informasi Pembayaran</h2>
          <p className="mb-4">Silakan periksa kembali pesanan Anda sebelum melanjutkan ke pembayaran.</p>
          <Link href="/page/checkout" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline block text-center">
            Lanjutkan ke Checkout
          </Link>
          <Link href="/page/product" className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline block text-center mt-4">
            Tambah Produk Lain
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}