import React from 'react';
import Sidebar from './SideBar';
import Link from 'next/link';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard flex">
            <Sidebar />
            <div className="content flex-grow p-4">
                <h1>Admin Dashboard</h1>
                <ul>
                    <li><Link href="/admin/users">Users Page</Link></li>
                    <li><Link href="/admin/products">Products Page</Link></li>
                    <li><Link href="/admin/categories">Categories Page</Link></li>
                    <li><Link href="/admin/orders">Orders Page</Link></li>
                    <li><Link href="/admin/reviews">Reviews Page</Link></li>
                    <li><Link href="/admin/progress">Progress Page</Link></li>
                    <li><Link href="/admin/order-item">Order Items Page</Link></li>
                    <li><Link href="/admin/payment-proof">Payment Proofs Page</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;