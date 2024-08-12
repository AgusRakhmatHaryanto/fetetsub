"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import axios from 'axios';

export default function OrderPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('BELUM_BAYAR');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'));
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    if (!userId) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/v1/orders/user/${userId}`);
      setOrders(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Terjadi kesalahan saat mengambil data pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (orderId) => {
    router.push(`/page/payment/${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}api/v1/orders/${orderId}/`);
      toast.success('Pesanan berhasil dibatalkan');
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Terjadi kesalahan saat membatalkan pesanan');
    }
  };

  const handleViewDetails = (orderId) => {
    router.push(`/page/order/${orderId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'BELUM_BAYAR') return order.status === 'PENDING';
    if (activeTab === 'DIPROSES') return order.status === 'IN_PROGRESS';
    if (activeTab === 'SELESAI') return order.status === 'COMPLETED';
    return false;
  });

  if (loading) return <div className="container mx-auto px-4 py-8">Memuat...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Riwayat Pesanan</h1>
        <p className="mb-4">Anda belum memiliki pesanan.</p>
        <Link href="/page/product" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Mulai Berbelanja
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Riwayat Pesanan</h1>
      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'BELUM_BAYAR' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('BELUM_BAYAR')}
          >
            Belum Bayar
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'DIPROSES' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('DIPROSES')}
          >
            Diproses
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'SELESAI' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('SELESAI')}
          >
            Selesai
          </button>
        </nav>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 border">ID Pesanan</th>
              <th scope="col" className="px-6 py-3 border">Status</th>
              <th scope="col" className="px-6 py-3 border">Total Harga</th>
              <th scope="col" className="px-6 py-3 border">Tanggal Pesanan</th>
              <th scope="col" className="px-6 py-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="bg-white border-b">
                <td className="px-6 py-4 border">{order.id}</td>
                <td className="px-6 py-4 border">{order.status}</td>
                <td className="px-6 py-4 border">Rp {order.totalPrice.toLocaleString()}</td>
                <td className="px-6 py-4 border">{formatDate(order.createdAt)}</td>
                <td className="px-6 py-4 border">
                  <button
                    onClick={() => handleViewDetails(order.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                  >
                    Detail
                  </button>
                  {order.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handlePayment(order.id)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                      >
                        Bayar
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Batalkan
                      </button>
                    </>
                  )}
                  {order.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      Lihat Progress
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
}