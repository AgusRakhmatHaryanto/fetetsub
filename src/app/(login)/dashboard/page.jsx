"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FormatCurrency from '@/app/components/FormatCurrency';

export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`);

        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const galleryImages = [
    '/welding1.jpg',
    '/welding2.jpg',
    '/welding3.jpg',
    '/welding4.jpg',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Jumbotron Header */}
      <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-2">Selamat Datang di Dashboard Bengkel Las</h1>
        <p className="text-xl">Temukan layanan las terbaik untuk kebutuhan Anda</p>
      </div>

      {/* Featured Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Layanan Unggulan</h2>
        {loading ? (
          <p>Memuat layanan...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={product.coverImage || "https://via.placeholder.com/300x200"} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.description.substring(0, 100)}...</p>
                  <p className="text-blue-600 font-bold"><FormatCurrency value={product.price || 0} /></p>
                  <Link href={`/product/${product.id}`} className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-6">
          <Link href="/page/product" className="text-blue-500 hover:underline">
            Lihat Semua Layanan
          </Link>
        </div>
      </div>

      {/* Gallery Slider */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Galeri Kami</h2>
        <Carousel 
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
        >
          {galleryImages.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Gallery image ${index + 1}`} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}