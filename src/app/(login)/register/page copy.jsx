"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { sendVerifyEmail } from "@/app/utils/message_send_email";
export default function Register() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [photoProfile, setPhotoProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setPhotoProfile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendVerifyEmail(userData.email, 'tokenacak')
    setIsLoading(true);

    try {
      if (
        !userData.username ||
        !userData.email ||
        !userData.password ||
        !userData.confirmPassword
      ) {
        throw new Error("Username, email, password, dan konfirmasi password wajib diisi.");
      }

      if (userData.password !== userData.confirmPassword) {
        throw new Error("Password dan konfirmasi password tidak cocok.");
      }

      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (key !== 'confirmPassword') {
          formData.append(key, userData[key]);
        }
      });
      if (photoProfile) {
        formData.append("photoProfile", photoProfile);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}users`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Registrasi berhasil! Silakan login.");
      router.push(`/login`);
    } catch (error) {
      console.error("Error registrasi:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Kesalahan: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan saat registrasi. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Registrasi</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Konfirmasi Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
            Nama Depan
          </label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
            Nama Belakang
          </label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Nomor Telepon
          </label>
          <input
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photoProfile">
            Foto Profil
          </label>
          <input
            type="file"
            name="photoProfile"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-blue-500 hover:text-blue-700">
          Login di sini
        </Link>
      </p>
    </div>
  );
}