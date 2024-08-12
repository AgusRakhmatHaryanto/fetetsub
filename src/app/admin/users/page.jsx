"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FaPencilAlt,
  FaTrashAlt,
  FaInfoCircle,
  FaUserPlus,
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}users/`);
      if (Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        console.error("Data received is not an array:", response.data);
        setError("Format data tidak sesuai");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Terjadi kesalahan saat mengambil data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = (userId) => {
    setUserToDelete(userId);
    setShowConfirmation(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}users/${userToDelete}`);
      setUsers(users.filter((user) => user.id !== userToDelete));
      setShowConfirmation(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Gagal menghapus pengguna");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Menambahkan teks di tengah halaman
    const title = "Users List";
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2;
    doc.text(title, textX, 16);

    doc.autoTable({
      startY: 20,
      head: [["ID", "Username", "Email", "Role", "Avatar"]],
      body: users.map((user) => [
        user.id,
        user.username,
        user.email,
        user.role,
        // user.profiles[0]?.avatarUrl || "N/A",
      ]),
      styles: { fontSize: 10, cellPadding: 3, halign: "center" },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        halign: "center",
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 30, halign: "center" },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 50, halign: "center" },
        3: { cellWidth: 20, halign: "center" },
        4: { cellWidth: 30, halign: "center" },
      },
      margin: { left: (pageWidth - 150) / 2, right: (pageWidth - 150) / 2 }, // Margin kiri dan kanan untuk menengah tabel
      tableWidth: "auto",
      theme: "grid",
      didDrawPage: (data) => {
        // Menambahkan teks di tengah halaman pada setiap halaman
        doc.text(title, textX, 16);
      },
    });

    doc.save("users.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      users.map((user) => ({
        ID: user.id,
        Username: user.username,
        Email: user.email,
        Role: user.role,
        Avatar: user.avatarUrl || "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  if (loading) return <><div className="flex justify-center items-center h-screen">Memuat...</div></>;
  if (error) return <><div className="flex justify-center items-center h-screen text-red-500">{error}</div></>;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manajemen Pengguna</h1>
        <div className="flex justify-between items-center mb-6">
          <Link
            className="btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            href="/admin/users/new"
          >
            <FaUserPlus className="mr-2" />
            Tambah Pengguna Baru
          </Link>
          <div>
            <button
              onClick={exportPDF}
              className="btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center mr-2"
            >
              <FaFilePdf className="mr-2" />
              Export PDF
            </button>
            <button
              onClick={exportExcel}
              className="btn bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <FaFileExcel className="mr-2" />
              Export Excel
            </button>
          </div>
        </div>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Avatar</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-gray-400">No Avatar</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/users/${user.id}`} className="text-green-600 hover:text-green-900 mr-3">
                      <FaInfoCircle className="inline-block w-5 h-5" />
                    </Link>
                    <Link href={`/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      <FaPencilAlt className="inline-block w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDeleteConfirmation(user.id)} className="text-red-600 hover:text-red-900">
                      <FaTrashAlt className="inline-block w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Konfirmasi */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-bold mb-4">Konfirmasi Penghapusan</h2>
              <p className="mb-6">Apakah Anda yakin ingin menghapus pengguna ini?</p>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded mr-2 hover:bg-gray-400"
                  onClick={() => setShowConfirmation(false)}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleDeleteUser}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}