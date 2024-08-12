import { Inter } from "next/font/google";
import Header from "@/app/components/HeaderNav";
import Footer from "@/app/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function PageLayout({ children }) {
  return (
    <div className={`flex flex-col min-h-screen ${inter.className} bg-gray-50`}>
      <Header />
      <main className="flex-grow p-6">{children}</main>
      <Footer />
    </div>
  );
}