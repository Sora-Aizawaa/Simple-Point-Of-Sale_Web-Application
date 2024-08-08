import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";

export default function Nav({ user }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="relative">
                <h2
                    className="font-semibold text-xl text-gray-800 leading-tight cursor-pointer"
                    onClick={toggleDropdown}
                >
                    Master Data &#9663;
                </h2>
                {dropdownOpen && (
                    <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <ul className="py-1">
                            <li>
                                <Link
                                    href="/data-admin"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Data Admin
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/daftar-item"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Data Barang
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/data-pembeli"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Data Pembeli
                                </Link>
                            </li>

                            {/* Add more links as needed */}
                        </ul>
                    </div>
                )}
            </div>
            <NavLink
                href="/kasir"
                className="font-semibold text-xl text-gray-800 leading-tight cursor-pointer"
            >
                Kasir
            </NavLink>
        </div>
    );
}
