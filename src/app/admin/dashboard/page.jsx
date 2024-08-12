"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layout";
import { FaUsers, FaBox, FaClipboardList, FaCog } from "react-icons/fa";

function AdminDashboard() {
  const [counts, setCounts] = useState({
    users: 0,
    products: 0,
    orders: 0,
    settings: null,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}users`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}products`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}orders`),
        ]);

        setCounts({
          users: usersRes.data.data.length,
          products: productsRes.data.data.length,
          orders: ordersRes.data.data.length,
          settings: null,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const dashboardItems = [
    {
      title: "Pengguna",
      icon: FaUsers,
      count: counts.users,
      link: "/admin/users",
      bgColor: "bg-blue-500",
    },
    {
      title: "Produk",
      icon: FaBox,
      count: counts.products,
      link: "/admin/products",
      bgColor: "bg-green-500",
    },
    {
      title: "Pesanan",
      icon: FaClipboardList,
      count: counts.orders,
      link: "/admin/orders",
      bgColor: "bg-yellow-500",
    },
    {
      title: "Pengaturan",
      icon: FaCog,
      count: counts.settings,
      link: "/admin/settings",
      bgColor: "bg-red-500",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${item.bgColor} text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                {item.count !== null && (
                  <p className="text-3xl font-bold">{item.count}</p>
                )}
              </div>
              <item.icon className="text-4xl" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <>
      <AdminDashboard />
    </>
  );
}