// resources/js/Pages/Dashboard.jsx

import { React, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Nav from "@/Layouts/Nav";

const Dashboard = ({ auth }) => {
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
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Dashboard;
