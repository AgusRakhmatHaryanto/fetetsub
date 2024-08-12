"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from "@/app/components/admin/Navigation";

export default function NewPaymentProof() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPaymentProof, setNewPaymentProof] = useState({ orderId: '', senderName: '', amount: 0, paymentImage: null });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}orders`);
      if (response.status !== 200) {
        throw new Error('Gagal mengambil data pesanan');
      }
      const data = response.data;
 
      const filteredOrders = data.data.filter(order => !order.paymentProof && order.paymentStatus !== 'PAYED' && order.paymentStatus !== 'ACC');
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Terjadi kesalahan saat mengambil data pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentProof({ ...newPaymentProof, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewPaymentProof({ ...newPaymentProof, paymentImage: e.target.files[0] });
  };

  const handleAddPaymentProof = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('orderId', newPaymentProof.orderId);
    formData.append('senderName', newPaymentProof.senderName);
    formData.append('amount', newPaymentProof.amount);
    formData.append('paymentImage', newPaymentProof.paymentImage);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}payment-proof`, formData);
      if (response.status !== 200) {
        throw new Error('Gagal menambahkan bukti pembayaran');
      }

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}orders/${newPaymentProof.orderId}`, {
        paymentStatus: 'PAYED'
      });
      toast.success('Bukti pembayaran berhasil ditambahkan');
      setNewPaymentProof({ orderId: '', senderName: '', amount: 0, paymentImage: null });
      fetchOrders();
    } catch (error) {
      console.error('Error adding payment proof:', error);
      toast.error('Terjadi kesalahan saat menambahkan bukti pembayaran');
    }
  };

  if (loading) {
    return <AdminLayout><div className="container mx-auto px-4 py-8">Memuat...</div></AdminLayout>;
  }

  if (error) {
    return <AdminLayout><div className="container mx-auto px-4 py-8 text-red-500">{error}</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tambah Bukti Pembayaran Baru</h1>
        <form onSubmit={handleAddPaymentProof} className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-700">Order ID:</label>
            <select
              name="orderId"
              value={newPaymentProof.orderId}
              onChange={handleInputChange}
              className="mt-1 block w-full"
              required
            >
              <option value="">Pilih Pesanan</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.id} - {order.status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nama Pengirim:</label>
            <input
              type="text"
              name="senderName"
              value={newPaymentProof.senderName}
              onChange={handleInputChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Jumlah:</label>
            <input
              type="number"
              name="amount"
              value={newPaymentProof.amount}
              onChange={handleInputChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Bukti Pembayaran:</label>
            <input
              type="file"
              name="paymentImage"
              onChange={handleFileChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Tambah Bukti Pembayaran
          </button>
        </form>
        <ToastContainer />
      </div>
    </AdminLayout>
  );
}