"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useRouter } from 'next/navigation';
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}orders`);
      console.log("API response:", response.data);
      if (Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      } else {
        console.error("Data yang diterima bukan array:", response.data);
        setError("Format data tidak sesuai");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Terjadi kesalahan saat mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: id });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-500';
      case 'IN_PROGRESS':
        return 'text-blue-500';
      case 'COMPLETED':
        return 'text-green-500';
      case 'SHIPPED':
        return 'text-purple-500';
      case 'CANCELLED':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleDetailClick = (orderId) => {
    router.push(`/admin/orders/${orderId}`);
  };

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus pesanan ini?");
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}orders/${orderId}`);
        setOrders(orders.filter(order => order.id !== orderId));
        alert("Pesanan berhasil dihapus");
      } catch (error) {
        console.error('Error deleting order:', error);
        alert("Gagal menghapus pesanan");
      }
    }
  };

  const handleEditStatus = (orderId, currentStatus) => {
    setEditingOrderId(orderId);
    setNewStatus(currentStatus);
  };

  const handleSaveStatus = async (orderId) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      setEditingOrderId(null);
      alert("Status pesanan berhasil diperbarui");
    } catch (error) {
      console.error('Error updating order status:', error);
      alert("Gagal memperbarui status pesanan");
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Daftar Pesanan</h1>
        {!Array.isArray(orders) || orders.length === 0 ? (
          <p className="text-center py-4">Tidak ada pesanan</p>
        ) : (
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">ID Pesanan</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Tanggal</th>
                  <th scope="col" className="px-6 py-3">Total Item</th>
                  <th scope="col" className="px-6 py-3">Total Harga</th>
                  <th scope="col" className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.id}</td>
                    <td className={`px-6 py-4 ${getStatusColor(order.status)}`}>
                      {editingOrderId === order.id ? (
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="mt-1 block w-full"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      ) : (
                        order.status
                      )}
                    </td>
                    <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">{order.items.length}</td>
                    <td className="px-6 py-4">Rp {order.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button 
                        onClick={() => handleDetailClick(order.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-xs sm:text-sm flex items-center"
                      >
                        <FaEye className="mr-2" /> Detail
                      </button>
                      {editingOrderId === order.id ? (
                        <button 
                          onClick={() => handleSaveStatus(order.id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-xs sm:text-sm flex items-center"
                        >
                          Simpan
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleEditStatus(order.id, order.status)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-xs sm:text-sm flex items-center"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-xs sm:text-sm flex items-center"
                      >
                        <FaTrash className="mr-2" /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Order;