import { React, useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Nav from "@/Layouts/Nav";

export default function Kasir({ auth, items }) {
    const [itemsState, setItemsState] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [cart, setCart] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (Array.isArray(items)) {
            setItemsState(items);
        } else {
            console.error("Invalid items prop:", items);
        }
    }, [items]);

    // Debugging: Log itemsState to ensure it's an array
    console.log("Items State:", itemsState);

    // CART

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (cartItem) => cartItem.kode_item === item.kode_item
            );
            if (existingItem) {
                // If item is already in cart, update quantity
                return prevCart.map((cartItem) =>
                    cartItem.kode_item === item.kode_item
                        ? { ...cartItem, qty: cartItem.qty + 1 }
                        : cartItem
                );
            }
            // If item is not in cart, add it
            return [...prevCart, { ...item, qty: 1 }];
        });
    };

    const incrementQuantity = (kode_item) => {
        setCart((prevCart) =>
            prevCart.map((cartItem) =>
                cartItem.kode_item === kode_item
                    ? { ...cartItem, qty: cartItem.qty + 1 }
                    : cartItem
            )
        );
    };

    const decrementQuantity = (kode_item) => {
        setCart((prevCart) =>
            prevCart.map((cartItem) =>
                cartItem.kode_item === kode_item
                    ? { ...cartItem, qty: Math.max(cartItem.qty - 1, 1) } // Ensure qty does not go below 1
                    : cartItem
            )
        );
    };

    const subtotal = cart.reduce((acc, item) => acc + item.harga * item.qty, 0);
    const tax = 0; // Example tax value
    const totalBeforeDiscount = subtotal + tax;
    const total = totalBeforeDiscount - discount;

    const formatPrice = (price) => {
        const priceNumber = parseFloat(price);
        return priceNumber % 1 === 0
            ? `Rp.${priceNumber.toLocaleString()}`
            : `Rp.${priceNumber.toFixed(2).replace(/\.00$/, "")}`;
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<Nav auth={auth} />}>
            <Head title="Halaman Kasir" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-1 flex">
                    <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden mb-8 mr-4">
                        <div className="p-6 text-black">
                            <div className="flex justify-end items-center space-x-2 mb-5">
                                <input
                                    type="text"
                                    className="px-4 py-2 border rounded-lg"
                                    placeholder="Cari Kode/Nama"
                                    // value={searchTerm}
                                    // onChange={handleSearchChange}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {itemsState.length > 0 ? (
                                    itemsState.map((item) => (
                                        <div
                                            key={item.kode_item}
                                            className="border rounded-lg overflow-hidden"
                                        >
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.nama_item}
                                                    className="w-full h-48 object-cover"
                                                />
                                            )}
                                            <div className="p-4">
                                                <h1 className="text-lg font-bold">
                                                    {item.nama_item}
                                                </h1>
                                                <p className="text-xl text-red-500 mb-2">
                                                    {formatPrice(item.harga)}
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    Stok: {item.stok}{" "}
                                                    {item.satuan}
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    Jenis: {item.jenis}
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    Merk: {item.merk}
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    Kode: {item.kode_item}
                                                </p>
                                                <div className="flex justify-between mt-4">
                                                    <button
                                                        onClick={() =>
                                                            addToCart(item)
                                                        }
                                                        className="flex-1 bg-blue-500 text-white rounded-full px-4 py-2 mx-1"
                                                    >
                                                        Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-700">
                                        No items available
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3 bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                        <div className="p-6 text-black">
                            <h2 className="text-xl font-bold mb-4">
                                Current Order
                            </h2>
                            {cart.length > 0 ? (
                                cart.map((order) => (
                                    <div
                                        key={order.kode_item}
                                        className="flex items-center mb-4"
                                    >
                                        <img
                                            src={order.image}
                                            alt={order.nama_item}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg">
                                                {order.nama_item}
                                            </h3>
                                            <p className="text-gray-700">
                                                {formatPrice(order.harga)} x{" "}
                                                {order.qty}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <button
                                                onClick={() =>
                                                    decrementQuantity(
                                                        order.kode_item
                                                    )
                                                }
                                                className="bg-red-500 text-white rounded-full px-4 py-2"
                                            >
                                                -
                                            </button>
                                            <span className="px-4">
                                                {order.qty}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    incrementQuantity(
                                                        order.kode_item
                                                    )
                                                }
                                                className="bg-green-500 text-white rounded-full px-4 py-2"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-700">Cart is empty</p>
                            )}
                            <div className="border-t pt-4 mt-4">
                                <p className="text-gray-700">
                                    Subtotal: {formatPrice(subtotal.toFixed(2))}
                                </p>
                                <p className="text-gray-700">
                                    Discount: {formatPrice(discount.toFixed(2))}
                                </p>
                                <p className="text-gray-700">
                                    Total sales tax:
                                    {formatPrice(tax.toFixed(2))}
                                </p>
                                <div className="flex items-center mt-2 mb-4">
                                    <label className="text-gray-700 mr-2">
                                        Discount:
                                    </label>
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) =>
                                            setDiscount(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className="border rounded px-2 py-1"
                                    />
                                </div>
                                <p className="text-xl font-bold mt-2">
                                    Total: {formatPrice(total.toFixed(2))}
                                </p>
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="flex-1 bg-green-500 text-white rounded-full px-4 py-2 mr-2"
                                    onClick={handleOpenModal}
                                >
                                    Cash
                                </button>
                                <button className="flex-1 bg-orange-500 text-white rounded-full px-4 py-2 ml-2">
                                    Payment
                                </button>
                            </div>

                            {isModalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto relative">
                                        <button
                                            onClick={handleCloseModal}
                                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                        >
                                            &times;
                                        </button>
                                        <h3 className="text-lg font-bold">
                                            Invoice
                                        </h3>
                                        <div className="mt-4">
                                            {itemsState.length > 0 ? (
                                                <div>
                                                    {itemsState.map((item) => (
                                                        <div
                                                            key={item.kode_item}
                                                            className="flex items-center mb-4"
                                                        >
                                                            <img
                                                                src={item.image}
                                                                alt={
                                                                    item.nama_item
                                                                }
                                                                className="w-16 h-16 object-cover rounded"
                                                            />
                                                            <div className="ml-4 flex-1">
                                                                <h3 className="text-lg">
                                                                    {
                                                                        item.nama_item
                                                                    }
                                                                </h3>
                                                                <p className="text-gray-700">
                                                                    {item.harga}{" "}
                                                                    x{" "}
                                                                    {item.stok}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="border-t pt-4 mt-4">
                                                        <p className="text-gray-700">
                                                            Subtotal:{" "}
                                                            {subtotal.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                        <p className="text-gray-700">
                                                            Discount:{" "}
                                                            {discount.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                        <p className="text-gray-700">
                                                            Total sales tax:{" "}
                                                            {tax.toFixed(2)}
                                                        </p>
                                                        <p className="text-xl font-bold mt-2">
                                                            Total:{" "}
                                                            {total.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-700">
                                                    No items available
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                        <div className="p-6 text-black">
                            <div className="product-detail">
                                <div className="relative">
                                    <img
                                        src="https://via.placeholder.com/300" 
                                        alt="Product"
                                        className="w-full h-auto"
                                    />
                                 
                                </div>
                                <div className="p-4">
                                    <div className="flex space-x-2">
                                        <span className="bg-red-500 text-white rounded-full px-2">
                                            Recommended
                                        </span>
                                        <span className="bg-red-500 text-white rounded-full px-2">
                                            Imported
                                        </span>
                                    </div>
                                    <h1 className="text-lg font-bold mt-2">
                                        Imported M6 Ribeye 450~500g
                                    </h1>
                                    <p className="text-xl text-red-500 mt-1">
                                        ¥299
                                    </p>
                                    <p className="text-sm text-gray-700 mt-1">
                                        The main component of Omega-3 fatty
                                        acids in Australian beef is AL linolenic
                                        acid, which is an essential fatty acid
                                        for the human body and is beneficial to
                                        health.
                                    </p>
                                    <div className="flex justify-between mt-4">
                                        <button className="flex-1 bg-yellow-500 text-black rounded-full px-4 py-2 mx-1">
                                            Shop
                                        </button>
                                        <button className="flex-1 bg-gray-300 text-black rounded-full px-4 py-2 mx-1">
                                            Wishlist
                                        </button>
                                        <button className="flex-1 bg-red-500 text-white rounded-full px-4 py-2 mx-1">
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </AuthenticatedLayout>
    );
}
