"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role 
    phone: "",
    street: "",
    village: "",
    district: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const [photoProfile, setPhotoProfile] = useState(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      if (
        !userData.username ||
        !userData.email ||
        !userData.password
      ) {
        throw new Error("Username, email, dan password wajib diisi.");
      }

      // Cek apakah email sudah digunakan
      const emailCheckResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}users/email/${userData.email}`);
      if (emailCheckResponse.data.exists) {
        throw new Error("Email sudah digunakan.");
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

      toast.success('Registrasi berhasil! Silakan login.');
      router.push(`/login`);
    } catch (error) {
      console.error("Error registering user:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(`Kesalahan: ${error.response.data.message}`);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan saat registrasi. Silakan coba lagi.");
      }
      toast.error(error.message || 'Terjadi kesalahan saat registrasi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Daftar Akun Baru
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Kesalahan!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={userData.username}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nama Lengkap
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={userData.name}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={userData.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={userData.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Nomor Telepon
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    value={userData.phone}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="photoProfile" className="block text-sm font-medium text-gray-700">
                  Foto Profil
                </label>
                <div className="mt-1">
                  <input
                    id="photoProfile"
                    name="photoProfile"
                    type="file"
                    onChange={handleFileChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Alamat
                </label>
                <div className="mt-1">
                  <input
                    id="street"
                    name="street"
                    type="text"
                    required
                    value={userData.street}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Jalan"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="village" className="block text-sm font-medium text-gray-700">
                  Desa
                </label>
                <div className="mt-1">
                  <input
                    id="village"
                    name="village"
                    type="text"
                    required
                    value={userData.village}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Desa"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  Kecamatan
                </label>
                <div className="mt-1">
                  <input
                    id="district"
                    name="district"
                    type="text"
                    required
                    value={userData.district}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Kecamatan"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Kota
                </label>
                <div className="mt-1">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={userData.city}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Kota"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                  Provinsi
                </label>
                <div className="mt-1">
                  <input
                    id="province"
                    name="province"
                    type="text"
                    required
                    value={userData.province}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Provinsi"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Kode Pos
                </label>
                <div className="mt-1">
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    required
                    value={userData.postalCode}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Kode Pos"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Link href="/login" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 mr-2">
                Kembali
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Memproses...' : 'Daftar'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}