'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`);
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (productId) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus produk ini?");
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}products/${productId}`);
        setProducts(products.filter(product => product.id !== productId));
        alert("Produk berhasil dihapus");
      } catch (error) {
        console.error('Error deleting product:', error);
        alert("Gagal menghapus produk");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Produk (Admin)</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nama</th>
              <th className="py-2 px-4 border-b">Deskripsi</th>
              <th className="py-2 px-4 border-b">Deskripsi Lengkap</th>
              <th className="py-2 px-4 border-b">Harga</th>
              <th className="py-2 px-4 border-b">Gambar</th>
              <th className="py-2 px-4 border-b">Img ID</th>
              <th className="py-2 px-4 border-b">Kategori</th>
              <th className="py-2 px-4 border-b">Dibuat Pada</th>
              <th className="py-2 px-4 border-b">Diperbarui Pada</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{product.id}</td>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">{product.description}</td>
                <td className="py-2 px-4 border-b">{product.richDescription}</td>
                <td className="py-2 px-4 border-b">{product.price}</td>
                <td className="py-2 px-4 border-b">
                  {product.coverImage && (
                    <img src={product.coverImage} alt={product.name} className="w-16 h-16 object-cover" />
                  )}
                </td>
                <td className="py-2 px-4 border-b">{product.imgId}</td>
                <td className="py-2 px-4 border-b">
                  {product.categories.map((category) => category.category.name).join(', ')}
                </td>
                <td className="py-2 px-4 border-b">{new Date(product.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{new Date(product.updatedAt).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">
                  <button 
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEdit(product.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;