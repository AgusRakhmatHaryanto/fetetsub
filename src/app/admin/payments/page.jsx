"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminPaymentProof() {
  const [paymentProofs, setPaymentProofs] = useState([]);
  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);

  useEffect(() => {
    fetchPaymentProofs();
  }, []);

  const fetchPaymentProofs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}payment-proof`
      );
      if (response.status !== 200) {
        throw new Error("Gagal mengambil data bukti pembayaran");
      }
      const data = response.data;
      if (Array.isArray(data.data)) {
        setPaymentProofs(data.data);
        fetchOrders(data.data);
      } else {
        console.error("Data yang diterima bukan array:", data);
        setError("Format data tidak sesuai");
      }
    } catch (error) {
      console.error("Error fetching payment proofs:", error);
      setError("Terjadi kesalahan saat mengambil data bukti pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (paymentProofs) => {
    try {
      const orderIds = paymentProofs.map((proof) => proof.orderId);
      const uniqueOrderIds = [...new Set(orderIds)];
      const ordersData = await Promise.all(
        uniqueOrderIds.map(async (orderId) => {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}orders/${orderId}`
          );
          if (response.status !== 200) {
            throw new Error(
              `Gagal mengambil data pesanan untuk orderId: ${orderId}`
            );
          }
          return {
            orderId,
            status: response.data.data.status,
            paymentStatus: response.data.data.paymentStatus,
          };
        })
      );
      const ordersMap = ordersData.reduce((acc, order) => {
        acc[order.orderId] = {
          status: order.status,
          paymentStatus: order.paymentStatus,
        };
        return acc;
      }, {});
      setOrders(ordersMap);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Terjadi kesalahan saat mengambil data pesanan");
    }
  };

  const handleApprove = async (orderId) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}orders/${orderId}`,
        {
          paymentStatus: "ACC",
        }
      );
      if (response.status !== 200) {
        throw new Error("Gagal menyetujui bukti pembayaran");
      }
      toast.success("Bukti pembayaran berhasil disetujui");
      fetchPaymentProofs();
    } catch (error) {
      console.error("Error approving payment proof:", error);
      toast.error("Terjadi kesalahan saat menyetujui bukti pembayaran");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}payment-proof/${id}/reject`
      );
      if (response.status !== 200) {
        throw new Error("Gagal menolak bukti pembayaran");
      }
      toast.success("Bukti pembayaran berhasil ditolak");
      fetchPaymentProofs();
    } catch (error) {
      console.error("Error rejecting payment proof:", error);
      toast.error("Terjadi kesalahan saat menolak bukti pembayaran");
    }
  };

  const handleViewDetails = (proof) => {
    setSelectedProof(proof);
  };

  const getOrderStatus = (orderId) => {
    return orders[orderId] || { status: "Tidak Diketahui", paymentStatus: "Tidak Diketahui" };
  };

  if (loading) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">Memuat...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manajemen Bukti Pembayaran</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Bukti Pembayaran</th>
                <th className="py-3 px-6 text-left">Order ID</th>
                <th className="py-3 px-6 text-left">Status Pesanan</th>
                <th className="py-3 px-6 text-left">Status Pembayaran</th>
                <th className="py-3 px-6 text-left">Tanggal Upload</th>
                <th className="py-3 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {paymentProofs.map((proof) => (
                <tr
                  key={proof.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">
                    <img
                      src={proof.imageUrl}
                      alt="Bukti Pembayaran"
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-6 text-left">{proof.orderId}</td>
                  <td className="py-3 px-6 text-left">
                    {getOrderStatus(proof.orderId).status}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {getOrderStatus(proof.orderId).paymentStatus}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(proof.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => handleApprove(proof.orderId)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() => handleReject(proof.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded mr-2"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => handleViewDetails(proof)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded"
                      >
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedProof && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">
                Detail Bukti Pembayaran
              </h2>
              <img
                src={selectedProof.imageUrl}
                alt="Bukti Pembayaran"
                className="w-full mb-4 rounded"
              />
              <p>
                <strong>Order ID:</strong> {selectedProof.orderId}
              </p>
              <p>
                <strong>Status Pesanan:</strong>{" "}
                {getOrderStatus(selectedProof.orderId).status}
              </p>
              <p>
                <strong>Status Pembayaran:</strong>{" "}
                {getOrderStatus(selectedProof.orderId).paymentStatus}
              </p>
              <p>
                <strong>Status Bukti Pembayaran:</strong> {selectedProof.status}
              </p>
              <p>
                <strong>Tanggal Upload:</strong>{" "}
                {new Date(selectedProof.createdAt).toLocaleString()}
              </p>
              <button
                onClick={() => setSelectedProof(null)}
                className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </>
  );
}