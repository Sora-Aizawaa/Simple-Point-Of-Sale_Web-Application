// File: Dashboard.jsx
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Nav from "@/Layouts/Nav";

// Data contoh untuk login
const logins = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "Admin",
        accessCount: 5,
        date: "2024-07-25T08:30:00Z",
        catatan: "Tambah Data (kode-> 1276455332)",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "User",
        accessCount: 3,
        date: "2024-07-25T09:00:00Z",
        catatan: "Edit Data (Kode->8746889383)",
    },
    // Tambahkan data login lainnya di sini
];

const Dashboard = ({ auth }) => {
    const getFormattedDate = (date) => {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const getFormattedTime = (date) => {
        return new Date(date).toLocaleTimeString();
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<Nav user={auth.user} />}>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-1">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                        <div className="p-6 text-black">
                            <div className="text-3xl font-bold mb-2">
                                Selamat Datang, {auth.user.name}!
                            </div>
                            <div className="text-xl">{auth.user.email}</div>
                            <div className="mt-4">
                                <span className="inline-block bg-green-500 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2">
                                    {auth.user.role === "admin"
                                        ? "Admin"
                                        : "User"}
                                </span>
                                <span className="inline-block bg-green-500 text-white rounded-full px-3 py-1 text-sm font-semibold">
                                    {getFormattedDate(new Date())}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">
                                Daftar Login
                            </h2>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Peran
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jumlah Akses
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal Terakhir
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Waktu Terakhir
                                        </th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Catatan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logins.map((login, index) => (
                                        <tr key={login.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {login.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {login.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {login.role}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {login.accessCount}x
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {getFormattedDate(login.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {getFormattedTime(login.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {login.catatan}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

// Contoh penggunaan komponen
const App = () => {
    const auth = {
        user: {
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
        },
    };

    return <Dashboard auth={auth} />;
};

export default App;
