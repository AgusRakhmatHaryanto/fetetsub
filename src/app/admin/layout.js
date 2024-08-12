import { Inter } from "next/font/google";
import Sidebar from "@/app/components/SideBar";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({ children }) {
  return (
    <div className={`flex min-h-screen ${inter.className} bg-gray-50`}>
      <Sidebar />
      <main className="flex-grow p-6 bg-white shadow-md rounded-lg">{children}</main>
    </div>
  );
}