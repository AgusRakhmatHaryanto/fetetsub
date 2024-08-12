"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const roles = ["admin", "bengkel", "customer", "toko"]; // Sesuaikan dengan enum Role di Prisma

export default function CreateUser() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    street: "",
    village: "",
    district: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const [photoProfile, setPhotoProfile] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPhotoProfile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (
        !userData.username ||
        !userData.email ||
        !userData.password ||
        !userData.role
      ) {
        throw new Error("Username, email, password, dan role wajib diisi.");
      }

      if (!roles.includes(userData.role)) {
        throw new Error("Role yang dipilih tidak valid.");
      }

      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key]);
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

      const userId = response.data.data.id;
      router.push(`/admin/users/${userId}`);
    } catch (error) {
      console.error("Error creating user:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(`Kesalahan: ${error.response.data.message}`);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan saat membuat pengguna. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buat Pengguna Baru</h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Kesalahan!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role"
          >
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={userData.role}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Pilih Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone"
          >
            Nomor Telepon
          </label>
          <input
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="photoProfile"
          >
            Foto Profil
          </label>
          <input
            type="file"
            name="photoProfile"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="street"
          >
            Alamat
          </label>
          <input
            type="text"
            name="street"
            value={userData.street}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Jalan"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="village"
            value={userData.village}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Desa"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="district"
            value={userData.district}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Kecamatan"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="city"
            value={userData.city}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Kota"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="province"
            value={userData.province}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Provinsi"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="postalCode"
            value={userData.postalCode}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Kode Pos"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Buat Pengguna
        </button>
      </form>
    </div>
  );
}