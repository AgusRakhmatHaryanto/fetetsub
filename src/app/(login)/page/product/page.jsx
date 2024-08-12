"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import FormatCurrency from '@/app/components/FormatCurrency';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`);
        const allProducts = response.data.data;
        setProducts(allProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Gagal memuat produk');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || product.categories.some(cat => cat.category.name === selectedCategory);
    return matchesSearchTerm && matchesCategory;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const uniqueCategories = [...new Set(products.flatMap(product => product.categories.map(cat => cat.category.name)))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Produk Kami</h1>
      
      <div className="mb-6 flex space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Semua Kategori</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center">Memuat produk...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link href={`/page/product/${product.id}`}>
                  <div className="cursor-pointer">
                    <img 
                      src={product.coverImage || 'https://via.placeholder.com/300x200'} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                      <p className="text-gray-600 mb-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          <FormatCurrency value={product.price || 0} />
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          {product.categories.map(cat => cat.category.name).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 border rounded ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
}