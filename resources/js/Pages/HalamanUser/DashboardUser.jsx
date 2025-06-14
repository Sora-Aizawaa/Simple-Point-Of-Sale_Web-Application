import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import HeaderUser from "@/LayoutsUser/HeaderUser";

const DashboardUser = ({ auth }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const products = [
        {
            src: "/images/logo.png",
            name: "Produk 1",
            deskripsi:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            price: "$330.00 - $449.00",
        },
        { src: "/path-to-image2.jpg", name: "Produk 2", price: "$77.00" },
        {
            src: "/path-to-image3.jpg",
            name: "Produk 3",
            price: "$312.00 - $499.00",
        },
        {
            src: "/path-to-image4.jpg",
            name: "Produk 4",
            price: "$78.00",
            salePrice: "$65.00",
            sale: true,
        },
        {
            src: "/path-to-image5.jpg",
            name: "Produk 5",
            price: "$33.00",
            salePrice: "$22.00",
            sale: true,
        },
    ];

    return (
        <>
            <Head title="Halaman User" />
            <HeaderUser>
                {/* BERITA HARI INI*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 ">
                    <div className="bg-red-500 text-white p-6 flex flex-col justify-center items-start w-full h-[50vh] md:h-full rounded-lg">
                        <p className="text-sm font-semibold mb-2 uppercase tracking-wide">
                            - Berita Hari Ini -
                        </p>
                        <h2 className="text-2xl font-extrabold leading-relaxed mb-4">
                            "Sedang cari laptop bekas yang masih oke dan gak
                            bikin kantong bolong? Di sini, kamu bisa dapetin
                            laptop dengan harga terjangkau, masih siap pakai,
                            dan pastinya punya performa yang oke buat berbagai
                            kebutuhan sehari-hari. Cek sekarang, siapa tahu ada
                            yang cocok buat kamu!"
                        </h2>
                        {/* <p className="text-sm italic mb-4">
                            Fulfill your tech needs at unbeatable prices!
                        </p>
                        <button className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg shadow-md transform hover:scale-105 transition duration-200 ease-in-out">
                            Shop Now
                        </button> */}
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 mx-8 my-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Laptop</h2>
                        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                            Lihat Semua
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-8">
                        {products.map((item, index) => (
                            <div
                                key={index}
                                className="relative bg-white shadow-lg rounded-lg p-6 flex flex-col items-center"
                            >
                                {item.sale && (
                                    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-sm font-bold rounded">
                                        Terjual
                                    </span>
                                )}
                                <img
                                    src={item.src}
                                    alt={item.name}
                                    className="w-full h-48 object-cover mb-4 rounded cursor-pointer"
                                    onClick={() => setSelectedProduct(item)}
                                />
                                <h3 className="text-lg font-bold">
                                    {item.name}
                                </h3>
                                {item.sale ? (
                                    <>
                                        <p className="text-gray-500 text-lg font-semibold line-through">
                                            {item.price}
                                        </p>
                                        <p className="text-green-500 text-lg font-semibold">
                                            {item.salePrice}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-gray-500 text-lg font-semibold">
                                        {item.price}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* footer */}
                <footer className="bg-[#0a0325] text-white py-10 px-8 md:px-16 mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Welcome Section */}
                        <div>
                            <h3 className="text-lg font-bold">Tentang Kami</h3>
                            <p className="text-sm mt-2">
                                Doctor Laptop Merupakan Website yang menyediakan
                                berbagai macam laptop bekas berkualitas dengan
                                harga terjangkau dan perbaikan laptop dengan
                                harga murah, kualitas perbaikan dijamin oke.
                            </p>
                        </div>

                        {/* More about store & Key Links */}
                        <div>
                            <h3 className="text-lg font-bold">
                                More about store
                            </h3>
                            <ul className="text-sm mt-2 space-y-1">
                                <li>Multiple Branches</li>
                                <li>Take Franchise</li>
                                <li>Scheduled Offers</li>
                                <li>More Links</li>
                            </ul>
                            <h3 className="text-lg font-bold mt-6">
                                Metode Pembayaran
                            </h3>
                            <ul className="text-sm mt-2 space-y-1">
                                <li>Qris</li>
                                <li>Gopay</li>
                                <li>Shopeepay</li>
                                <li>Transfer Bank</li>
                                <li>Virtual Account</li>
                            </ul>
                        </div>

                        {/* Popular Products */}
                        <div>
                            <h3 className="text-lg font-bold">
                                Popular Products
                            </h3>
                            <ul className="text-sm mt-2 space-y-3">
                                <li className="flex items-center gap-3">
                                    <img
                                        src="/images/logo.png"
                                        alt="Product 1"
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <p>Vestibulum ante ipsum...</p>
                                        <p className="text-yellow-500 font-bold">
                                            $56.00
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3">
                                    <img
                                        src="/path-to-image2.jpg"
                                        alt="Product 2"
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <p>Curabitur ultricies ante...</p>
                                        <p className="text-yellow-500 font-bold">
                                            $88.00
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3">
                                    <img
                                        src="/path-to-image3.jpg"
                                        alt="Product 3"
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <p>Sed pretium quam lacinia...</p>
                                        <p className="line-through text-gray-400">
                                            $88.00
                                        </p>
                                        <p className="text-yellow-500 font-bold">
                                            $74.00
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Details & Local Stores */}
                        <div>
                            <h3 className="text-lg font-bold">
                                Contact details
                            </h3>
                            <p className="text-sm mt-4">
                                Address: Jalan Gst Sulung Lelanang, Desa Pasir,
                                Kecamatan Mempawah Hilir, 78919. <br /> Buka :
                                Senin - Sabtu <br />
                                Jam : 08.00 - 16.00 WIB
                            </p>
                            <p className="text-sm">
                                WhatsApp: +62 895 7017 91492
                            </p>
                            <p className="text-sm">E-mail: shopnow@store.com</p>
                            <h3 className="text-lg font-bold mt-6">
                                Melayani Perbaikan Laptop di Kota
                            </h3>
                            <ul className="text-sm mt-2 space-y-1">
                                <li>Mempawah</li>
                                <li>Singkawang</li>
                                <li>Pontianak</li>
                            </ul>
                        </div>
                    </div>

                    {/* Social Media & Copyright */}
                    <div className="mt-10 flex flex-col md:flex-row items-center justify-between text-sm border-t border-gray-700 pt-6">
                        <div className="flex space-x-4">
                            {/* <a href="#" className="hover:text-gray-400">
                                Facebook
                            </a>
                            <a href="#" className="hover:text-gray-400">
                                Twitter
                            </a> */}
                            <a href="#" className="hover:text-gray-400">
                                Instagram
                            </a>
                            <a href="#" className="hover:text-gray-400">
                                Whatsapp
                            </a>
                        </div>
                        <p className="mt-4 md:mt-0">
                            Copyright | Doctor Laptop | Developed by Muhammad
                            Reza Anggawirya
                        </p>
                    </div>
                </footer>
            </HeaderUser>

            {/* Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
                    <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 mx-8 my-2 w-full max-w-6xl relative">
                        {/* Tombol Close */}
                        <button
                            className="absolute top-4 right-4 bg-red-500 text-white text-2xl p-2 w-10 h-10 rounded-lg flex items-center justify-center"
                            onClick={() => setSelectedProduct(null)}
                        >
                            ×
                        </button>

                        {/* Konten Modal */}
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Gambar Produk */}
                            <img
                                src={selectedProduct.src}
                                alt={selectedProduct.name}
                                className="w-32 md:w-48 h-auto object-cover rounded-lg"
                            />

                            {/* Detail Produk */}
                            <div className="w-full flex flex-row justify-between gap-4">
                                <div className="flex flex-col justify-center w-2/3">
                                    <h2 className="text-3xl font-bold">
                                        {selectedProduct.name}
                                    </h2>

                                    {/* Harga */}
                                    <p className="text-2xl text-gray-700">
                                        {selectedProduct.price}
                                    </p>

                                    <p className="text-2xl text-gray-700 w-full text-right">
                                        {selectedProduct.deskripsi}
                                    </p>

                                    {/* Harga Diskon (jika ada) */}
                                    {selectedProduct.sale && (
                                        <p className="text-2xl text-red-500 font-bold">
                                            {selectedProduct.salePrice}
                                        </p>
                                    )}

                                    {/* Status Stok */}
                                    <p className="text-lg text-green-600 font-semibold">
                                        (In Stock)
                                    </p>
                                </div>

                                {/* Tombol Tambah ke Keranjang */}
                                <div className="flex items-center space-x-4 justify-center w-1/3">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-2">
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-full"
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.max(
                                                            quantity - 1,
                                                            1
                                                        )
                                                    )
                                                }
                                            >
                                                -
                                            </button>
                                            <span className="text-xl">
                                                {quantity}
                                            </span>
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded-full"
                                                onClick={() =>
                                                    setQuantity(quantity + 1)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-xl font-semibold"
                                            onClick={() =>
                                                console.log("Add to Cart")
                                            }
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DashboardUser;
