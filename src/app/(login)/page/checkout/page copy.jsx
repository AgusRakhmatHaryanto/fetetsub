"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

export default function OrderPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + ((item.sellingPrice || 0) * item.quantity * (item.size || 1)), 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.');
      return;
    }
    setLoading(true);

    const orderItems = cartItems.map(item => ({
      ...(item.type === 'finished' ? { productId: item.id } : { rawProductId: item.id }),
      quantity: item.quantity,
      ...(item.size && { size: item.size }),
    }));

    const totalPrice = calculateTotal();

    const orderData = {
      userId: userId,
      paymentMethod,
      note,
      items: orderItems,
      totalPrice: totalPrice,
    };

    console.log('Order Data:', orderData);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Gagal membuat pesanan');
      }

      const result = await response.json();
      console.log('Order Response:', result);

      // Bersihkan keranjang
      localStorage.removeItem('cartItems');

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
      <h1 className="text-3xl font-bold mb-8">Checkout Pesanan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex justify-between items-center mb-4 pb-4 border-b">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Jumlah: {item.quantity} {item.size ? `(${item.size} m²)` : ''}
                </p>
              </div>
              <p className="font-bold">
                Rp {((item.sellingPrice || 0) * item.quantity * (item.size || 1)).toLocaleString()}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <p className="font-semibold">Total</p>
            <p className="font-bold text-xl">Rp {calculateTotal().toLocaleString()}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Informasi Pesanan</h2>
          <form onSubmit={handleSubmitOrder}>
            <div className="mb-4">
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Metode Pembayaran</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="BANK_TRANSFER">Transfer Bank</option>
                <option value="ON_SITE">Bayar di Tempat</option>
              </select>
            </div>
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