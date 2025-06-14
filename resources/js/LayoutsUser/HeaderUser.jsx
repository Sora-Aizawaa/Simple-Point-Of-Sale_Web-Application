import React, { useState, useRef, useEffect } from "react"; // Add this import

export default function HeaderUser({ children, title }) {
    // PANEL SAMPING CART, PERSON, HEART
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [panelContent, setPanelContent] = useState("cart"); // "cart", "profile", "favorites"

    // Fungsi untuk toggle panel
    const togglePanel = () => setIsPanelOpen(!isPanelOpen);

    // Fungsi untuk mengubah konten panel sesuai dengan tombol yang diklik
    const handleIconClick = (content) => {
        setPanelContent(content);
        setIsPanelOpen(true); // Open the panel when clicking an icon
    };

    // DROPDOWN SEMUA BUTTON KATEGORI
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
    const dropdownRef = useRef(null); // Reference for the dropdown container
    const buttonRef = useRef(null); // Reference for the "All Categories" button

    // Toggle the dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        // Add event listener for clicks on the document
        document.addEventListener("click", handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-100">
            {/* Top Bar */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
            />
            <div className="bg-blue-900 text-white text-sm py-4 px-8 flex text-left border-b border-white border-opacity-30 overflow-hidden">
                <div
                    className="whitespace-nowrap"
                    style={{
                        animation: "slideText 10s linear infinite",
                    }}
                >
                    Selamat Datang Di Website Doctors Laptop
                </div>
                <style>
                    {`
                        @keyframes slideText {
                            0% { transform: translateX(100%); }
                            100% { transform: translateX(-100%); }
                        }
                    `}
                </style>
                <span className="hidden md:inline absolute right-12 top-4 text-xl font-bold">
                    WhatsApp: (+62) 895 7017 91492
                </span>
            </div>

            {/* Header */}
            <header className="bg-blue-900 text-white py-4 px-8 flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="h-10 mr-2"
                    />
                    <h1 className="text-3xl font-bold">
                        Doctors<span className="text-blue-500">Laptop</span>
                    </h1>
                </div>
                <nav className="hidden md:flex space-x-6 ">
                    {/* <a href="#" className="hover:text-yellow-400">
                        Home
                    </a> */}
                    {/* <a href="#" className="hover:text-yellow-400">
                        Tentang Kami
                    </a> */}
                    <a href="#" className="hover:text-yellow-400">
                        Belanja
                    </a>
                    <a href="#" className="hover:text-yellow-400">
                        Perbaikan Laptop & Computer
                    </a>
                    {/* <a href="#" className="hover:text-yellow-400">
                        Vendor Membership
                    </a>
                    <a href="#" className="hover:text-yellow-400">
                        Store List
                    </a> */}
                    <a href="#" className="hover:text-yellow-400">
                        Blog
                    </a>

                    <a href="#" className="hover:text-yellow-400">
                        Teknisi
                    </a>
                </nav>

                {/* Side Panel */}
                <div
                    className={`fixed top-0 right-0 w-100 h-full bg-white text-black p-4 transform ${
                        isPanelOpen ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-300 ease-in-out`}
                >
                    <h2 className="text-2xl font-bold">
                        {panelContent === "cart"
                            ? "Your Cart"
                            : panelContent === "profile"
                            ? "Your Profile"
                            : "Your Favorites"}
                    </h2>
                    <div className="space-y-4 mt-4">
                        {panelContent === "cart" && (
                            <div>
                                <p>Your cart items will be displayed here.</p>
                                {/* Add your cart content */}
                            </div>
                        )}
                        {panelContent === "profile" && (
                            <div>
                                <p>
                                    Your profile details will be displayed here.
                                </p>
                                {/* Add your profile content */}
                            </div>
                        )}
                        {panelContent === "favorites" && (
                            <div>
                                <p>
                                    Your favorite items will be displayed here.
                                </p>
                                {/* Add your favorites content */}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={togglePanel}
                        className="absolute top-4 right-4 text-black text-2xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className="flex space-x-4 items-center p-4">
                    {/* Icon Keranjang Belanja */}
                    <button
                        onClick={() => handleIconClick("cart")}
                        className="p-2 hover:text-yellow-500"
                    >
                        <i className="fa-solid fa-cart-shopping text-xl text-white-700"></i>
                    </button>

                    {/* Icon Profil User */}
                    <button
                        onClick={() => handleIconClick("profile")}
                        className="p-2 hover:text-yellow-500"
                    >
                        <i className="fa-solid fa-user text-xl text-white-700"></i>
                    </button>

                    {/* Icon Barang yang Disukai */}
                    <button
                        onClick={() => handleIconClick("favorites")}
                        className="p-2 hover:text-yellow-500"
                    >
                        <i className="fa-regular fa-heart text-xl text-white-700"></i>
                    </button>
                </div>
            </header>

            {/* Search Bar */}
            <div className="flex items-center bg-white px-8 py-4 shadow">
                {/* Search Bar and Dropdown Button */}
                <div className="flex items-center relative">
                    {/* Button */}
                    <button
                        ref={buttonRef}
                        onClick={toggleDropdown}
                        className="bg-blue-600 px-4 py-2 text-white font-bold rounded"
                    >
                        Semua Kategori
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute top-full mt-2 bg-white border rounded shadow-lg w-48 py-2 z-10"
                        >
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-black hover:bg-gray-200"
                                    >
                                        Category 1
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-black hover:bg-gray-200"
                                    >
                                        Category 2
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-black hover:bg-gray-200"
                                    >
                                        Category 3
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-black hover:bg-gray-200"
                                    >
                                        Category 4
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    placeholder="Cari Barang..."
                    className="w-72 max-w-full px-4 py-2 border border-gray-300 rounded mx-4"
                />

                <div className="flex items-center space-x-10">
                    <div className="whitespace-nowrap overflow-hidden w-full">
                        <p className="animate-marquee text-black-700 text-sm full">
                            Alamat Kantor: Jl. Gst. Sulung Lelanang, Desa Pasir,
                            Kecamatan Mempawah Hilir, Kabupaten Mempawah,
                            Provinsi Kalimantan Barat, Buka : Senin-Sabtu, Jam :
                            08.00-16.00
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }

                .animate-marquee {
                    display: inline-block;
                    white-space: nowrap;
                    animation: marquee 40s linear infinite;
                }
            `}</style>

            {/* Tambahkan ini agar Hero Section bisa tampil */}
            {children}
        </div>
    );
}
