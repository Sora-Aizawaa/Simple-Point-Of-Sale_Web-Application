// File: Nav.jsx
import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import Dropdown from "@/Components/Dropdown";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";

export default function Nav({ user }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="flex items-center">
            <h2 className="font-semibold text-xl text-gray-800 leading-tight relative">
                <span onClick={toggleDropdown} className="cursor-pointer">
                    Master Data &#9663;
                </span>
                {dropdownOpen && (
                    <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <ul className="py-1">
                            <li>
                                <Link
                                    href="/daftar-item"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Daftar Item
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/kasir"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Kasir
                                </Link>
                            </li>
                            {/* Tambahkan lebih banyak Link sesuai kebutuhan */}
                        </ul>
                    </div>
                )}
            </h2>

            {/* <div className="ms-3 relative">
                <Dropdown>
                    <Dropdown.Trigger>
                        <span className="inline-flex rounded-md">
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                            >
                                {user.name}
                                <svg
                                    className="ms-2 -me-0.5 h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </span>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                        <Dropdown.Link href={route("profile.edit")}>
                            Profile
                        </Dropdown.Link>
                        <Dropdown.Link
                            href={route("logout")}
                            method="post"
                            as="button"
                        >
                            Log Out
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div> */}
        </div>
    );
}
