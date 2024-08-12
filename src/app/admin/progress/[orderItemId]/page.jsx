"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const OrderItemProgress = ({ params }) => {
  const { orderItemId } = params;
  const [loading, setLoading] = useState(true);
  const [progresses, setProgresses] = useState([]);
  const [newProgress, setNewProgress] = useState({ description: "" });
  const [editingProgress, setEditingProgress] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [orderItemId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}progress/order-item/${orderItemId}`);
      setProgresses(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgress({ ...newProgress, [name]: value });
  };

  const handleAddProgress = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}progress/order-item/${orderItemId}`, newProgress);
      setProgresses([...progresses, response.data.data]);
      setNewProgress({ description: "" });
    } catch (error) {
      console.error("Error adding progress:", error);
      setError("Terjadi kesalahan saat menambahkan data");
    }
  };

  const handleEditProgress = async (id) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}progress/${id}`, { description: editingProgress.description });
      const updatedData = progresses.map((progress) =>
        progress.id === id ? response.data.data : progress
      );
      setProgresses(updatedData);
      setEditingProgress(null);
    } catch (error) {
      console.error("Error editing progress:", error);
      setError("Terjadi kesalahan saat mengedit data");
    }
  };

  const handleDeleteProgress = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}progress/${id}`);
      const updatedData = progresses.filter((progress) => progress.id !== id);
      setProgresses(updatedData);
    } catch (error) {
      console.error("Error deleting progress:", error);
      setError("Terjadi kesalahan saat menghapus data");
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div> {/* Indikator pemuatan */}
        </div>
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
        <h1 className="text-2xl font-bold mb-4">Progress untuk Item Pesanan ID: {orderItemId}</h1>
        <div className="mb-4">
          <input
            type="text"
            name="description"
            value={newProgress.description}
            onChange={handleInputChange}
            placeholder="Deskripsi"
            className="mr-2 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddProgress}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Tambah Progress
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID Progress</th>
              <th className="py-2 px-4 border-b">Deskripsi</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {progresses.map((progress) => (
              <tr key={progress.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{progress.id}</td>
                <td className="py-2 px-4 border-b">
                  {editingProgress && editingProgress.id === progress.id ? (
                    <input
                      type="text"
                      name="description"
                      value={editingProgress.description}
                      onChange={(e) => setEditingProgress({ ...editingProgress, description: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  ) : (
                    progress.description
                  )}
                </td>
                <td className="py-2 px-4 border-b flex space-x-2">
                  {editingProgress && editingProgress.id === progress.id ? (
                    <button
                      onClick={() => handleEditProgress(progress.id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Simpan
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingProgress(progress)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteProgress(progress.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrderItemProgress;