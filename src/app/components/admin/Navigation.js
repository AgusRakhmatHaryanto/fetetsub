"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBox,
  FaBoxes,
  FaClipboardList,
  FaUsers,
  FaCog,
  FaBars,
  FaTimes,
  FaList,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      if (typeof window !== 'undefined') {
        const userId = localStorage.getItem("userId");
        if (!!userId && userId === "customer") {
          router.push("/");
        }
        if (userId) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/${userId}`);
            const data = await response.json();
            setUserType(data.data.role);
          } catch (error) {
            console.error("Error fetching user type:", error);
          }
        }
      }
    };

    fetchUserType();
  }, [router]);

  const navItems = [
    {
      name: "Dashboard",
      icon: FaClipboardList,
      href: "/admin",
      access: ["admin", "toko", "bengkel"],
    },
    {
      name: "Category",
      icon: FaList,
      href: "/admin/categories",
      access: ["admin", "bengkel"],
    },
    {
      name: "Raw Products",
      icon: FaBox,
      href: "/admin/products/rawProduct",
      access: ["admin", "bengkel"],
    },
    {
      name: "Finished Products",
      icon: FaBoxes,
      href: "/admin/products/finishProduct",
      access: ["admin", "bengkel"],
    },
    {
      name: "Orders",
      icon: FaShoppingCart,
      href: "/admin/orders",
      access: ["admin", "toko"],
    },
    {
      name: "Payments",
      icon: FaMoneyBillWave,
      href: "/admin/payments",
      access: ["admin", "toko"],
    },
    { name: "Users", icon: FaUsers, href: "/admin/users", access: ["admin"] },
    {
      name: "Settings",
      icon: FaCog,
      href: "/admin/settings",
      access: ["admin", "toko", "bengkel"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.access.includes(userType)
  );

  return (
    <div
      className={`bg-gray-800 text-white h-screen fixed top-0 left-0 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-0 md:w-20"
      } overflow-hidden z-50`}
    >
      <div className="p-4 flex justify-between items-center">
        <span
          className={`font-bold text-xl ${
            isOpen ? "block" : "hidden md:block"
          }`}
        >
          Admin
        </span>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          <FaTimes />
        </button>
      </div>
      <nav>
        {filteredNavItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <span
              className={`flex items-center p-4 hover:bg-gray-700 ${
                pathname === item.href ? "bg-gray-700" : ""
              }`}
            >
              <item.icon className="mr-4" />
              <span className={isOpen ? "block" : "hidden md:block"}>
                {item.name}
              </span>
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isOpen ? "ml-64" : "ml-0 md:ml-20"
        }`}
      >
        <header className="bg-white shadow-md p-4 md:hidden">
          {!isOpen && (
            <button onClick={() => setIsOpen(true)} className="text-gray-800">
              <FaBars />
            </button>
          )}
        </header>
        <main className="p-6 bg-gray-100 min-h-screen">{children}</main>
      </div>
    </div>
  );
}