"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PaymentPage({ params }) {
  const router = useRouter();
  const { orderId } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}orders/${orderId}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Terjadi kesalahan saat mengambil data pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Pilih file bukti pembayaran terlebih dahulu');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('paymentImage', selectedFile);
    formData.append('orderId', orderId);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}payment-proof`, formData);
      toast.success('Bukti pembayaran berhasil diunggah');
      setSelectedFile(null);
      fetchOrder(); // Refresh order data
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast.error('Terjadi kesalahan saat mengunggah bukti pembayaran');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Memuat...</div>;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Pesanan tidak ditemukan</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pembayaran Pesanan</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <p className="text-lg font-semibold mb-2">Nomor Pesanan: {order.id}</p>
        <p className="mb-2">Status: {order.status}</p>
        <p className="mb-2">Metode Pembayaran: {order.paymentMethod}</p>
        <p className="mb-4">Tanggal Pesanan: {new Date(order.createdAt).toLocaleString()}</p>
        <h2 className="text-xl font-semibold mb-4">Item Pesanan:</h2>
        <ul className="mb-4">
          {order.items.map((item, index) => {
            const productData = item.product || item.rawProduct;
            return (
              <li key={index} className="mb-2">
                {productData ? productData.name : 'Produk tidak tersedia'} - Jumlah: {item.quantity} 
                {item.size > 0 && `(${item.size} m²)`} - 
                Rp {(item.price * item.quantity).toLocaleString()}
              </li>
            );
          })}
        </ul>
        <p className="text-xl font-bold mb-4">Total: Rp {order.totalPrice.toLocaleString()}</p>
        {order.status === 'PENDING' && !order.paymentProof && (
          <div className="space-y-4">
            <div>
              <input type="file" onChange={handleFileChange} accept="image/*" className="mb-2" />
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                {uploading ? 'Mengunggah...' : 'Unggah Bukti Pembayaran'}
              </button>
            </div>
          </div>
        )}
        {order.paymentProof && (
          <div className="mt-4">
            <p className="font-semibold">Bukti Pembayaran:</p>
            <img src={order.paymentProof.imageUrl} alt="Bukti Pembayaran" className="mt-2 max-w-xs" />
            {order.status === 'PAID' && (
              <p className="text-green-500 font-semibold mt-2">Pembayaran telah diterima</p>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}