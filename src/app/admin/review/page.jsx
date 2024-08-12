"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import StarRatingComponent from 'react-star-rating-component';

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      setReviewsLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}reviews/product/${productId}`);
      setReviews(response.data.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviewsError("Terjadi kesalahan saat mengambil review");
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleShowReviewClick = (productId) => {
    if (selectedProductId === productId) {
      setSelectedProductId(null);
      setReviews([]);
    } else {
      setSelectedProductId(productId);
      fetchReviews(productId);
    }
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
        <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID Produk</th>
              <th className="py-2 px-4 border-b">Nama Produk</th>
              <th className="py-2 px-4 border-b">Harga (Rp)</th>
              <th className="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{product.id}</td>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleShowReviewClick(product.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    {selectedProductId === product.id ? "Sembunyikan Review" : "Tampilkan Review"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedProductId && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Review untuk Produk ID: {selectedProductId}</h2>
            {reviewsLoading ? (
              <div className="flex justify-center items-center">
                <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div> {/* Indikator pemuatan */}
              </div>
            ) : reviewsError ? (
              <div className="text-red-500">{reviewsError}</div>
            ) : (
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">ID Review</th>
                    <th className="py-2 px-4 border-b">Pengguna</th>
                    <th className="py-2 px-4 border-b">Rating</th>
                    <th className="py-2 px-4 border-b">Komentar</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{review.id}</td>
                      <td className="py-2 px-4 border-b">{review.user.name}</td>
                      <td className="py-2 px-4 border-b">
                        <StarRatingComponent 
                          name={`rating-${review.id}`} 
                          starCount={5}
                          value={review.rating}
                          editing={false}
                        />
                      </td>
                      <td className="py-2 px-4 border-b">{review.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Products;