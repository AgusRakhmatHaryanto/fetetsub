"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";

export default function OrderDetail({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProgress, setShowProgress] = useState({}); // State untuk mengelola visibilitas progress
  const [progressData, setProgressData] = useState({}); // State untuk menyimpan data progress
  const { orderId } = params;
  const router = useRouter();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}orders/${orderId}`
      );
      setOrder(response.data.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Terjadi kesalahan saat mengambil detail pesanan");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressData = async (orderItemId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}progress/order-item/${orderItemId}`
      );
      setProgressData((prev) => ({
        ...prev,
        [orderItemId]: response.data.data,
      }));
    } catch (error) {
      console.error("Error fetching progress data:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleProgress = (itemId) => {
    setShowProgress((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    if (!showProgress[itemId]) {
      fetchProgressData(itemId);
    }
  };

  const handleReview = (orderItemId, productId) => {
    router.push(`/page/review/${orderId}?orderItemId=${orderItemId}&productId=${productId}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">Memuat...</div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  if (!order)
    return (
      <div className="flex justify-center items-center h-screen">
        Pesanan tidak ditemukan
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Detail Pesanan</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Status Pesanan" value={order.status} />
          <InfoItem label="Status Pembayaran" value={order.paymentStatus} />
          <InfoItem label="Metode Pembayaran" value={order.paymentMethod} />
          <InfoItem label="Catatan" value={order.note} />
          <InfoItem label="Tanggal Dibuat" value={formatDate(order.createdAt)} />
          <InfoItem label="Tanggal Diupdate" value={formatDate(order.updatedAt)} />
          <InfoItem label="Pembeli" value={order.user?.username} />
          <InfoItem label="Alamat" value={order.street ? `${order.street}, ${order.village}, ${order.district}, ${order.city}, ${order.province}, ${order.postalCode}` : "Tidak ada alamat"} />
          <div className="flex items-center">
            <span className="font-semibold">Bukti Pembayaran:</span>
            <span className="ml-2">
              {order.paymentProof ? (
                <a
                  href={order.paymentProof.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Lihat Bukti Pembayaran
                </a>
              ) : (
                "Tidak ada bukti pembayaran"
              )}
            </span>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Daftar Item</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg mb-6">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Nama Produk</th>
              <th scope="col" className="px-6 py-3">Ukuran</th>
              <th scope="col" className="px-6 py-3">Jumlah</th>
              <th scope="col" className="px-6 py-3">Harga</th>
              <th scope="col" className="px-6 py-3">Progress</th>
              <th scope="col" className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">
                    {item.product ? item.product.name : "Produk tidak ditemukan"}
                  </td>
                  <td className="px-6 py-4">{item.size}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">Rp {item.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleProgress(item.id)}
                      className="text-blue-500 hover:underline"
                    >
                      {showProgress[item.id] ? "Sembunyikan" : "Tampilkan"} Progress
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleReview(item.id, item.product.id)}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Review
                      </button>
                    )}
                  </td>
                </tr>
                {showProgress[item.id] && progressData[item.id] && (
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {progressData[item.id].map((progress, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <p className="font-semibold">{progress.description}</p>
                            <p className="text-gray-600">{formatDate(progress.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-xl">Total Harga:</span>
          <span className="text-xl">Rp {order.totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="mb-4">
      <span className="font-semibold">{label}:</span>{" "}
      <span className="ml-2">{value || "N/A"}</span>
    </div>
  );
}