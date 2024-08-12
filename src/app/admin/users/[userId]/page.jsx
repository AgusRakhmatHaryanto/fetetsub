"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import AdminLayout from "@/app/components/admin/Navigation";

export default function UserById() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getById = async (id) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}users/${id}`
        );
        setUser(response.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getById(userId);
    }
  }, [userId]);

  const handleEditUser = () => router.push(`/admin/users/${userId}/edit`);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!user) return <div className="text-center mt-8">User not found</div>;

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Detail Pengguna</h1>
        <button
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleEditUser}
        >
          Edit User
        </button>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">Informasi Akun</h2>
              <InfoItem label="Username" value={user.username} />
              <InfoItem label="Email" value={user.email} />
              <InfoItem label="Role" value={user.role} />
              <InfoItem
                label="Verified"
                value={user.isVerified ? "Yes" : "No"}
              />
              <InfoItem
                label="Created At"
                value={format(
                  new Date(user.createdAt),
                  "dd MMMM yyyy, HH:mm:ss",
                  { locale: id }
                )}
              />
              <InfoItem
                label="Updated At"
                value={format(
                  new Date(user.updatedAt),
                  "dd MMMM yyyy, HH:mm:ss",
                  { locale: id }
                )}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Informasi Profil</h2>
              <InfoItem label="Nama Lengkap" value={user.name} />
              <InfoItem label="Phone" value={user.phone} />
              <div className="mb-4">
                <span className="font-semibold">Avatar:</span>
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="rounded-full mt-2"
                  />
                ) : (
                  <span className="ml-2">No avatar</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Alamat</h2>

            <div>
              <InfoItem label="Street" value={user.street} />
              <InfoItem label="Village" value={user.village} />
              <InfoItem label="District" value={user.district} />
              <InfoItem label="City" value={user.city} />
              <InfoItem label="Province" value={user.province} />
              <InfoItem label="Postal Code" value={user.postalCode} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="mb-2">
      <span className="font-semibold">{label}:</span>{" "}
      <span>{value || "N/A"}</span>
    </div>
  );
}