"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

export default function OrderPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState(null);

  const [street, setStreet] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const items = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItems(items);
      setUserId(localStorage.getItem('userId'));
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}users/${userId}`);
        const userData = response.data.data;
        setUser(userData);
        setStreet(userData.street || '');
        setVillage(userData.village || '');
        setDistrict(userData.district || '');
        setCity(userData.city || '');
        setProvince(userData.province || '');
        setPostalCode(userData.postalCode || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + ((item.price || 0) * (item.size || 1)), 0);
  };

  const formatSize = (size) => {
    return size.toString().replace('.', ',');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.');
      return;
    }
    setLoading(true);

    const orderItems = cartItems.map(item => ({
      productId: item.id,
      size: item.size || 0,
      price: item.price || 0,
    }));

    const totalPrice = calculateTotal();

    const orderData = {
      userId: userId,
      note,
      items: orderItems,
      totalPrice: totalPrice,
      street,
      village,
      district,
      city,
      province,
      postalCode,
    };

    console.log('Order Data:', orderData);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}orders`, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Order Response:', response.data);

      // Bersihkan keranjang
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cartItems');
      }

      toast.success('Pesanan berhasil dibuat!');
      router.push(`/page/order`);

    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout Pesanan</h1>
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
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout Pesanan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex justify-between items-center mb-4 pb-4 border-b">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Ukuran: {item.size ? `${formatSize(parseFloat(item.size).toFixed(3))} m²` : ''}
                </p>
              </div>
              <p className="font-bold">
                Rp {((item.price || 0) * (item.size || 1)).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="font-semibold">Total</p>
            <p className="font-bold text-xl">Rp {calculateTotal().toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Informasi Pesanan</h2>
          <form onSubmit={handleSubmitOrder}>
            <div className="mb-4">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700">Catatan Pesanan</label>
              <textarea
                id="note"
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Tambahkan catatan untuk pesanan Anda (opsional)"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">Jalan</label>
              <input
                id="street"
                name="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="village" className="block text-sm font-medium text-gray-700">Desa</label>
              <input
                id="village"
                name="village"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">Kecamatan</label>
              <input
                id="district"
                name="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Kota</label>
              <input
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="province" className="block text-sm font-medium text-gray-700">Provinsi</label>
              <input
                id="province"
                name="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Kode Pos</label>
              <input
                id="postalCode"
                name="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Memproses...' : 'Buat Pesanan'}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}