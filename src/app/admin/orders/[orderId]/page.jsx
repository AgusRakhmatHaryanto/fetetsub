'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from "@/app/components/admin/Navigation";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [newItem, setNewItem] = useState({ productId: '', size: 0, price: 0 });
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { orderId } = useParams();

  useEffect(() => {
    fetchOrderAndProducts();
  }, []);

  const fetchOrderAndProducts = async () => {
    try {
      setLoading(true);
      const [orderResponse, productsResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}orders/${orderId}`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`),
      ]);
      setOrder(orderResponse.data.data);
      setProducts(productsResponse.data.data);
    } catch (err) {
      console.error('Error fetching order or products:', err);
      setError('Terjadi kesalahan saat mengambil data pesanan atau produk');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + (item.size * item.price), 0);
  };

  const updateOrderTotalPrice = async (updatedItems) => {
    const newTotalPrice = calculateTotalPrice(updatedItems);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}orders/${orderId}`, { totalPrice: newTotalPrice });
      setOrder({ ...order, items: updatedItems, totalPrice: newTotalPrice });
    } catch (error) {
      console.error('Error updating order total price:', error);
      alert('Gagal memperbarui total harga pesanan');
    }
  };

  const handleNewItemChange = (field, value) => {
    const updatedNewItem = { ...newItem, [field]: value };

    if (field === 'productId') {
      const selectedProduct = products.find(product => product.id === value);
      if (selectedProduct) {
        updatedNewItem.price = selectedProduct.price;
      }
    }

    setNewItem(updatedNewItem);
  };

  const handleAddItem = async () => {
    if (newItem.size <= 0) {
      alert('Ukuran tidak boleh 0 atau kurang');
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}order-item`, { ...newItem, orderId });
      const updatedItems = [...order.items, response.data.data];
      await updateOrderTotalPrice(updatedItems);
      setNewItem({ productId: '', size: 0, price: 0 });
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Gagal menambah item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (order.items.length <= 1) {
      alert('Pesanan tidak boleh memiliki 0 item');
      return;
    }

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}order-item/${itemId}`);
      const updatedItems = order.items.filter(item => item.id !== itemId);
      await updateOrderTotalPrice(updatedItems);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Gagal menghapus item');
    }
  };

  const handleEditItem = async (index) => {
    try {
      const { id, productId, size, price } = editingItem;
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}order-item/${id}`, { productId, size, price });
      const updatedItems = [...order.items];
      updatedItems[index] = response.data.data;
      await updateOrderTotalPrice(updatedItems);
      setEditingItem(null);
    } catch (error) {
      console.error('Error editing item:', error);
      alert('Gagal mengedit item');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
      </AdminLayout>
    );
  }

  const availableProducts = products.filter(product => !order.items.some(item => item.productId === product.id));

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Detail Pesanan</h1>
        {order && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold">Informasi Pesanan</h2>
              <p>ID Pesanan: {order.id}</p>
              <p>Nama Pengguna: {order.user.name}</p>
              <p>Status: {order.status}</p>
              <p>Tanggal: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Total Harga: Rp {order.totalPrice.toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-bold">Item Pesanan</h2>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Produk</th>
                    <th className="py-2 px-4 border-b">Ukuran</th>
                    <th className="py-2 px-4 border-b">Harga</th>
                    <th className="py-2 px-4 border-b">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">
                        {editingItem && editingItem.index === index ? (
                          <select
                            value={editingItem.productId}
                            onChange={(e) => {
                              const selectedProduct = products.find(product => product.id === e.target.value);
                              setEditingItem({ ...editingItem, productId: e.target.value, price: selectedProduct ? selectedProduct.price : editingItem.price });
                            }}
                            className="mt-1 block w-full"
                          >
                            <option value="">Pilih Produk</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          products.find(product => product.id === item.productId)?.name || 'Produk tidak ditemukan'
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {editingItem && editingItem.index === index ? (
                          <input
                            type="number"
                            value={editingItem.size}
                            onChange={(e) => setEditingItem({ ...editingItem, size: e.target.value })}
                            className="mt-1 block w-full"
                          />
                        ) : (
                          item.size
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {editingItem && editingItem.index === index ? (
                          <input
                            type="number"
                            value={editingItem.price}
                            readOnly
                            className="mt-1 block w-full"
                          />
                        ) : (
                          `Rp ${item.price.toLocaleString()}`
                        )}
                      </td>
                      <td className="py-2 px-4 border-b flex space-x-2">
                        {editingItem && editingItem.index === index ? (
                          <button
                            onClick={() => handleEditItem(index)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-xs sm:text-sm flex items-center"
                          >
                            Simpan
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingItem({ ...item, index })}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-xs sm:text-sm flex items-center"
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteItem(item.id)}
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
            <div className="mb-4">
              <h2 className="text-lg font-bold">Tambah Item Baru</h2>
              <div className="mb-2">
                <label className="block text-gray-700">Produk:</label>
                <select
                  value={newItem.productId}
                  onChange={(e) => handleNewItemChange('productId', e.target.value)}
                  className="mt-1 block w-full"
                >
                  <option value="">Pilih Produk</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Ukuran:</label>
                <input
                  type="number"
                  value={newItem.size}
                  onChange={(e) => handleNewItemChange('size', e.target.value)}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700">Harga:</label>
                <input
                  type="number"
                  value={newItem.price}
                  readOnly
                  className="mt-1 block w-full"
                />
              </div>
              <button
                onClick={handleAddItem}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-xs sm:text-sm flex items-center"
              >
                <FaPlus className="mr-2" /> Tambah Item
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;