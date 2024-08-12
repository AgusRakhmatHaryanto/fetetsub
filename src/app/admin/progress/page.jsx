"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Progress = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}orders`);
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const handleOrderItemClick = (orderItemId) => {
    router.push(`/admin/progress/${orderItemId}`);
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center h-screen">
          <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div> {/* Indikator pemuatan */}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Daftar Pesanan</h1>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID Pesanan</th>
              <th className="py-2 px-4 border-b">Pengguna</th>
              <th className="py-2 px-4 border-b">Total Harga</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.user.name}</td>
                <td className="py-2 px-4 border-b">{formatRupiah(order.totalPrice)}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => setOrders(orders.map(o => o.id === order.id ? { ...o, showItems: !o.showItems } : o))}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    {order.showItems ? "Sembunyikan Item" : "Lihat Item"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.map((order) => (
          order.showItems && (
            <div key={order.id} className="mt-4">
              <h2 className="text-xl font-bold mb-2">Item Pesanan untuk Order ID: {order.id}</h2>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">ID Item</th>
                    <th className="py-2 px-4 border-b">Produk</th>
                    <th className="py-2 px-4 border-b">Ukuran (m²)</th>
                    <th className="py-2 px-4 border-b">Harga (Rp)</th>
                    <th className="py-2 px-4 border-b">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{item.id}</td>
                      <td className="py-2 px-4 border-b">{item.product.name}</td>
                      <td className="py-2 px-4 border-b">{item.size} m²</td>
                      <td className="py-2 px-4 border-b">{formatRupiah(item.price)}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleOrderItemClick(item.id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Kelola Progress
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ))}
      </div>
    </>
  );
};

export default Progress;