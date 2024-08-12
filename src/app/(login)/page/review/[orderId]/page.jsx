"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';

export default function ReviewPage({ params }) {
  const { orderId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/login');
        return;
      }

      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}reviews`, {
          orderId,
          userId,
          productId,
          rating,
          description,
        });
        toast.success('Review berhasil dikirim');
        router.push('/page/order');
      } catch (error) {
        console.error('Error submitting review:', error);
        toast.error('Terjadi kesalahan saat mengirim review');
      }
    }
  };

  const onStarClick = (nextValue) => {
    setRating(nextValue);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tulis Review</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
            Rating
          </label>
          <StarRatingComponent 
            name="rating" 
            starCount={5}
            value={rating}
            onStarClick={onStarClick}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Kirim Review
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}