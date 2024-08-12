'use client'

import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaImage, FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}categories`);
                console.log('Response:', response);
                const result = response.data;
                console.log('Result:', result);
                setCategories(result.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const toggleProducts = (id) => {
        const updatedCategories = categories.map(category => {
            if (category.id === id) {
                category.showProducts = !category.showProducts;
            }
            return category;
        });
        setCategories(updatedCategories);
    };

    const handleEdit = (category) => {
        setEditingCategory(category.id);
        setNewCategoryName(category.name);
    };

    const handleSave = async (id) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}categories/${id}`, { name: newCategoryName });
            const updatedCategories = categories.map(category => {
                if (category.id === id) {
                    category.name = newCategoryName;
                }
                return category;
            });
            setCategories(updatedCategories);
            setEditingCategory(null);
            toast.success('Category updated successfully');
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Error updating category');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}categories/${id}`);
            setCategories(categories.filter(category => category.id !== id));
            toast.success('Category deleted successfully');
        } catch (error) {
            console.error('Error deleting category:', error.response ? error.response.data : error.message);
            toast.error('Error deleting category');
        }
    };

    const handleAddCategory = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}categories`, { name: newCategory });
            setCategories([...categories, response.data.data]);
            setNewCategory("");
            toast.success('Category added successfully');
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error('Error adding category');
        }
    };

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add new category"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <button
                    onClick={handleAddCategory}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                    Add Category
                </button>
            </div>
            <ToastContainer />
            <table className="min-w-full bg-white text-center">
                <thead>
                    <tr>
                        <th className="py-2">Category ID</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <React.Fragment key={category.id}>
                            <tr className="bg-gray-100 my-2 p-4 border border-gray-300 rounded">
                                <td className="border px-4 py-2 align-middle">{category.id}</td>
                                <td className="border px-4 py-2 align-middle">
                                    {editingCategory === category.id ? (
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    ) : (
                                        category.name
                                    )}
                                </td>
                                <td className="border px-4 py-2 align-middle">
                                    <button onClick={() => toggleProducts(category.id)} className="text-blue-500 hover:text-blue-700 mr-2">
                                        {category.showProducts ? 'Hide Products' : 'Show Products'}
                                    </button>
                                    {editingCategory === category.id ? (
                                        <button onClick={() => handleSave(category.id)} className="text-green-500 hover:text-green-700 mr-2">
                                            Save
                                        </button>
                                    ) : (
                                        <button onClick={() => handleEdit(category)} className="text-yellow-500 hover:text-yellow-700 mr-2">
                                            <FaEdit />
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-700">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                            {category.showProducts && (
                                <tr key={`products-${category.id}`}>
                                    <td colSpan="3">
                                        <div className="mt-4">
                                            <table className="min-w-full bg-white text-center">
                                                <thead>
                                                    <tr>
                                                        <th className="py-2">Product ID</th>
                                                        <th className="py-2">Name</th>
                                                        <th className="py-2">Image</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {category.products && category.products.length > 0 ? (
                                                        category.products.map((product) => (
                                                            <tr key={product.id}>
                                                                <td className="border px-4 py-2 align-middle">{product.product?.id}</td>
                                                                <td className="border px-4 py-2 align-middle">{product.product?.name}</td>
                                                                <td className="border px-4 py-2 align-middle">
                                                                    {product.product?.image ? (
                                                                        <img src={product.product.image} alt={product.product.name} className="w-16 h-16 object-cover mx-auto"/>
                                                                    ) : (
                                                                        <FaImage className="w-16 h-16 text-gray-400 mx-auto" />
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3" className="border px-4 py-2 align-middle">Tidak ada produk untuk kategori ini</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}