"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";
import { FaBox, FaShoppingCart } from 'react-icons/fa';
import StarRatingComponent from 'react-star-rating-component';
import FormatCurrency from "@/app/components/FormatCurrency";

export default function ProductDetail() {
  const { productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [size, setSize] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products/${productId}`);
        if (response.data.data) {
          setProduct(response.data.data);
        } else {
          setError("Produk tidak ditemukan");
          toast.error("Produk tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Terjadi kesalahan saat memuat produk");
        toast.error("Terjadi kesalahan saat memuat produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        throw new Error("Invalid date");
      }
      return format(date, 'PPpp', { locale: id });
    } catch (error) {
      console.error("Error parsing date:", error, "Date string:", dateString);
      return "Tanggal tidak valid";
    }
  };

  const handleOrder = () => {
    if (!size || isNaN(parseFloat(size)) || parseFloat(size) <= 0) {
      toast.error('Silakan masukkan ukuran yang valid');
      return;
    }

    if (product) {
      const parsedSize = parseFloat(size);
      if (typeof window !== 'undefined') {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existingProductIndex = cartItems.findIndex(item => 
          item.id === product.id && item.size === parsedSize
        );

        if (existingProductIndex !== -1) {
          cartItems[existingProductIndex].quantity += 1;
        } else {
          cartItems.push({ 
            ...product, 
            quantity: 1, 
            size: parsedSize 
          });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        toast.success('Produk berhasil ditambahkan ke keranjang!');
        setSize('');
      }
    }
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    if (parseFloat(value) < 0) {
      toast.error('Ukuran tidak boleh negatif');
      setSize('');
    } else {
      setSize(value);
    }
  };

  if (loading) return <div className="text-center py-10">Memuat...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-10">Produk tidak ditemukan</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto max-w-4xl relative">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-64 w-full object-cover md:w-64"
              src={product.coverImage || "https://via.placeholder.com/300x200"}
              alt={product.name}
            />
          </div>
          <div className="p-8 flex-1">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-2">
              {product.type === 'raw' ? <FaBox className="inline mr-2" /> : null}
              {product.categories.length > 0 ? product.categories.map(cat => cat.category.name).join(', ') : 'Tidak ada kategori'}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 whitespace-pre-line mb-4">{product.description}</p>
            
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Detail Produk</h2>
              <dl className="border-t border-gray-200">
                <div className="py-3 flex justify-between border-t border-gray-200">
                  <dt className="text-gray-500">Harga</dt>
                  <dd className="text-gray-900 font-semibold">
                    <FormatCurrency value={product.price || 0} />
                  </dd>
                </div>
                <div className="py-3 flex justify-between border-t border-gray-200">
                  <dt className="text-gray-500">Terakhir Diperbarui</dt>
                  <dd className="text-gray-900">
                    {formatDate(product.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Masukkan Ukuran (m²)</h3>
              <div className="mt-2">
                <input
                  type="number"
                  value={size}
                  onChange={handleSizeChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan ukuran dalam m²"
                  min="0.001"
                  step="0.001"
                />
              </div>
            </div>

            <div className="mt-6 text-center flex justify-center space-x-4">
              <button
                onClick={handleOrder}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                disabled={!size || isNaN(parseFloat(size)) || parseFloat(size) <= 0}
              >
                <FaShoppingCart className="mr-2" />
                Pesan Sekarang
              </button>
              <button
                onClick={() => router.back()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded inline-flex items-center"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Ulasan</h2>
          {product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <div className="flex items-center mb-2">
                    <StarRatingComponent 
                      name={`rating-${review.id}`} 
                      starCount={5}
                      value={review.rating}
                      editing={false}
                    />
                    <span className="ml-2 text-gray-600">{review.user.username}</span>
                  </div>
                  <p className="text-gray-700">{review.description}</p>
                  <p className="text-gray-500 text-sm">{formatDate(review.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Belum ada ulasan untuk produk ini.</p>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}