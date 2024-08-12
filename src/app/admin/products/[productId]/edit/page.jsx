"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";

function DropdownCheckbox({ options, selectedValues, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length > 0 ? `${selectedValues.length} dipilih` : "Pilih kategori"}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label key={option.id} className="flex items-center px-3 py-2 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.id)}
                onChange={() => onChange(option.id)}
                className="mr-2"
              />
              {option.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditProduct() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
  });
  const [imageProduct, setImageProduct] = useState(null);
  const router = useRouter();
  const { productId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}categories`);
        setCategories(categoriesResponse.data.data);

        if (productId) {
          const productResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}products/${productId}`);
          const productData = productResponse.data.data;
          console.log(productData);
          setFormData({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            categories: productData.categories ? productData.categories.map(category => category.categoryId) : [],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal mengambil data");
      }
    };
    fetchData();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (categoryId) => {
    const updatedCategories = formData.categories.includes(categoryId)
      ? formData.categories.filter(id => id !== categoryId)
      : [...formData.categories, categoryId];
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleImageChange = (e) => {
    setImageProduct(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formData.categories.forEach(category => formDataToSend.append("categories", category));
    if (imageProduct) {
      formDataToSend.append("imageProduct", imageProduct);
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}products/${productId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Produk berhasil diperbarui");
      router.back();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Gagal memperbarui produk");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Produk</h1>
      <ToastContainer position="top-right" autoClose={3000} />

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nama Produk
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Harga
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categories">
            Kategori
          </label>
          <DropdownCheckbox
            options={categories}
            selectedValues={formData.categories}
            onChange={handleCategoryChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageProduct">
            Gambar Produk
          </label>
          <input
            type="file"
            id="imageProduct"
            name="imageProduct"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}