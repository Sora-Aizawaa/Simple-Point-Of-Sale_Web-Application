import { React, useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Nav from "@/Layouts/Nav";
import axios from "axios";

export default function Kasir({ auth, items, data_pembeli, onClose }) {
    const [itemsState, setItemsState] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [cart, setCart] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [dataPembeli, setDataPembeli] = useState([]);
    const [selectedPembeliId, setSelectedPembeliId] = useState(null);
    const [selectedPembeli, setSelectedPembeli] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState("");

    //PEMBELI
    useEffect(() => {
        if (Array.isArray(data_pembeli)) {
            setDataPembeli(data_pembeli);
        } else {
            console.error("Invalid data_pembeli prop:", data_pembeli);
        }
    }, [data_pembeli]);

    useEffect(() => {
        if (selectedPembeliId) {
            const pembeli = dataPembeli.find(
                (p) => p.id_pembeli === selectedPembeliId
            );
            setSelectedPembeli(pembeli);
        }
    }, [selectedPembeliId, dataPembeli]);

    const handleChange = (event) => {
        setSelectedPembeliId(parseInt(event.target.value, 10));
    };

    //ITEMS
    useEffect(() => {
        if (Array.isArray(items)) {
            setItemsState(items);
        } else {
            console.error("Invalid items prop:", items);
        }
    }, [items]);

    // Debugging: Log itemsState to ensure it's an array
    // console.log("Items :", itemsState);
    // console.log("Data Pembeli:", selectedPembeli);

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
        setPaymentMethod("Cash");

        sendPaymentCash()
            .then(() => {
                setIsModalOpen(true); // Open the modal after sending payment data successfully
            })
            .catch((error) => {
                console.error("Failed to send payment data:", error);
            });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const generateInvoiceNumber = () => {
        // Create a random number and pad it with zeros to ensure it's 8 digits long
        return `INV${Math.floor(10000000 + Math.random() * 90000000)}`;
    };
    const [invoiceNumber] = useState(generateInvoiceNumber());

    // SEARCH DATA
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        if (items) {
            const filtered = items.filter(
                (item) =>
                    item.kode_item
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.nama_item
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
            setFilteredItems(filtered);
        }
    }, [searchTerm, items]);

    const handleSearchChange = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    };

    const [paidAmount, setPaidAmount] = useState("");

    const calculateChange = () => {
        return Math.max(0, (parseFloat(paidAmount) || 0) - total);
    };

    //TANGGAL

    const currentDate = new Date();

    // Format tanggal ke format Y-m-d H:i:s
    const formattedDate = currentDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

    // BUTTON PAYMENT

    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

    const handleOpenPaymentModal = () => {
        sendPaymentDataToBackend()
            .then(() => {
                setPaymentModalOpen(true);
            })
            .catch((error) => {
                console.error("Failed to send payment data:", error);
            });
    };

    const handleClosePaymentModal = () => {
        setPaymentModalOpen(false);
    };

    //MIDTRANS PAYMENT
    const [snapToken, setSnapToken] = useState(null);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientKey, setClientKey] = useState("");

    useEffect(() => {
        // Fetch the client key from your Laravel backend
        axios
            .get("/midtrans-config")
            .then((response) => {
                setClientKey(response.data.clientKey); // Set the client key in state
            })
            .catch((error) => {
                console.error("Error fetching Midtrans config:", error);
            });
    }, []);

    useEffect(() => {
        // Fungsi untuk mendapatkan Snap Token
        const fetchSnapToken = async () => {
            try {
                const response = await axios.post("/generate-snap-token", {
                    order_id: invoiceNumber,
                    gross_amount: total,
                    customer_details: {
                        first_name: selectedPembeli?.nama.split(" ")[0],
                        last_name: selectedPembeli?.nama.split(" ")[1] || "",
                        email: selectedPembeli?.email,
                        phone: selectedPembeli?.nomor_telepon,
                    },
                    items: cart.map((item) => ({
                        id: item.kode_item,
                        price: item.harga,
                        quantity: item.qty,
                        name: item.nama_item,
                    })),
                });

                setSnapToken(response.data.snapToken);
            } catch (error) {
                setError(error);
            }
        };

        if (cart.length > 0 && selectedPembeli) {
            fetchSnapToken();
        }
    }, [cart, selectedPembeli]); // Kosongkan array dependensi untuk memanggil fungsi hanya sekali setelah mount

    // if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    useEffect(() => {
        // Dynamically load the Snap.js script
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", clientKey);
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup the script when the component unmounts
            document.body.removeChild(script);
        };
    }, [clientKey]);

    const handlePayment = () => {
        window.snap.pay(snapToken, {
            onSuccess: function (result) {
                document.getElementById("result-json").innerHTML +=
                    JSON.stringify(result, null, 2);

                // sendPaymentDataToBackend(result);
            },
            onPending: function (result) {
                document.getElementById("result-json").innerHTML +=
                    JSON.stringify(result, null, 2);
            },
            onError: function (result) {
                document.getElementById("result-json").innerHTML +=
                    JSON.stringify(result, null, 2);
            },
        });
    };

    // PAYMENT DATABASE
    const sendPaymentDataToBackend = async () => {
        // Data items dari cart
        const items = cart.map((item) => ({
            id_barang: item.id_barang,
            kode_barang: item.kode_item,
            price: item.harga,
            quantity: item.qty,
            subtotal_per_unit: item.harga * item.qty,
            nama_item: item.nama_item,
        }));

        // Data pembeli
        const customerDetails = {
            id_pembeli: selectedPembeli.id_pembeli,
            name: selectedPembeli.nama,
            email: selectedPembeli.email,
            phone: selectedPembeli.nomor_telepon,
        };

        // Data transaksi yang dikirim ke backend
        const dataToSend = {
            order_id: invoiceNumber,
            subtotal: subtotal,
            discount: discount,
            paid_amount: paidAmount,
            gross_amount: total,
            change: calculateChange(),
            transaction_time: formattedDate,
            items: items,
            customer_details: customerDetails,
            status_pembayaran: "Unpaid",
            metode_pembayaran: "bank_transfer",
            nama_bank: "BCA",
        };

        console.log("Data to send:", dataToSend); // Debugging data

        // Kirim data transaksi ke backend
        axios({
            method: "post",
            url: "/store",
            data: dataToSend,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                console.log("Response from server:", response.data);
                return response.data;
            })
            .catch((error) => {
                if (error.response) {
                    console.error(
                        "Failed to send payment data:",
                        error.response.data
                    );
                } else if (error.request) {
                    console.error(
                        "No response received from server:",
                        error.request
                    );
                } else {
                    console.error("Error setting up request:", error.message);
                }
                // Handle error appropriately
            });
    };

    // CASH DATABASE
    const sendPaymentCash = async () => {
        // Data items dari cart
        const items = cart.map((item) => ({
            id_barang: item.id_barang,
            price: item.harga,
            quantity: item.qty,
            subtotal_per_unit: item.harga * item.qty,
            nama_item: item.nama_item,
        }));

        // Data pembeli
        const customerDetails = {
            id_pembeli: selectedPembeli.id_pembeli,
            name: selectedPembeli.nama,
            email: selectedPembeli.email,
            phone: selectedPembeli.nomor_telepon,
        };

        // Data transaksi yang dikirim ke backend
        const dataToSend = {
            order_id: invoiceNumber,
            subtotal: subtotal,
            discount: discount,
            paid_amount: paidAmount,
            gross_amount: total,
            change: calculateChange(),
            transaction_time: formattedDate,
            items: items,
            customer_details: customerDetails,
            status_pembayaran: "Unpaid",
        };

        console.log("Data to send:", dataToSend); // Debugging data

        // Kirim data transaksi ke backend
        axios({
            method: "post",
            url: "/store2",
            data: dataToSend,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                console.log("Response from server:", response.data);
                return response.data;
            })
            .catch((error) => {
                if (error.response) {
                    console.error(
                        "Failed to send payment data:",
                        error.response.data
                    );
                } else if (error.request) {
                    console.error(
                        "No response received from server:",
                        error.request
                    );
                } else {
                    console.error("Error setting up request:", error.message);
                }
                // Handle error appropriately
            });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<Nav auth={auth} />}>
            <Head title="Halaman Kasir" />

            {/* <p>Snap Token: {snapToken}</p> */}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-1 flex">
                    <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden mb-8 mr-4">
                        <div className="p-6 text-black">
                            <div className="flex justify-end items-center space-x-2 mb-5">
                                <input
                                    type="text"
                                    className="px-4 py-2 border rounded-lg"
                                    placeholder="Cari Kode/Nama"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
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
                                            <p className="text-gray-700 font-semibold">
                                                Subtotal:{" "}
                                                {formatPrice(
                                                    order.harga * order.qty
                                                )}
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
                                    Potongan Harga:{" "}
                                    {formatPrice(discount.toFixed(2))}
                                </p>
                                <p className="text-gray-700">
                                    Uang Yang Dibayarkan:{" "}
                                    {paidAmount !== ""
                                        ? formatPrice(
                                              parseFloat(paidAmount).toFixed(2)
                                          )
                                        : "Rp0,00"}
                                </p>
                                <div className="flex items-center mt-2 mb-4">
                                    <label className="text-gray-700 mr-2">
                                        Potongan Harga:
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
                                        placeholder="Masukkan Potongan Harga"
                                    />
                                </div>
                                <div className="flex items-center mt-2 mb-4">
                                    <label className="text-gray-700 mr-2">
                                        Uang Yang Dibayarkan:
                                    </label>
                                    <input
                                        type="number"
                                        value={paidAmount}
                                        onChange={(e) =>
                                            setPaidAmount(
                                                e.target.value === ""
                                                    ? ""
                                                    : parseFloat(e.target.value)
                                            )
                                        }
                                        className="border rounded px-2 py-1"
                                        placeholder="Jumlah Uang"
                                    />
                                </div>
                                <div className="mb-4 flex items-center">
                                    <label
                                        htmlFor="pembeli-select"
                                        className="text-gray-700 font mr-4"
                                    >
                                        Pilih Pembeli:
                                    </label>
                                    <select
                                        id="pembeli-select"
                                        className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            -- Pilih Pembeli --
                                        </option>
                                        {dataPembeli.map((pembeli) => (
                                            <option
                                                key={pembeli.id_pembeli}
                                                value={pembeli.id_pembeli}
                                            >
                                                {pembeli.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedPembeli ? (
                                    <div className="p-4 border-b border-gray-200 mb-3">
                                        <p className="text-gray-700 font-bold">
                                            Pembeli:
                                        </p>
                                        <p className="text-gray-600">
                                            Nama: {selectedPembeli.nama}
                                        </p>
                                        <p className="text-gray-600">
                                            Nomor Telepon:{" "}
                                            {selectedPembeli.nomor_telepon}
                                        </p>
                                        <p className="text-gray-600">
                                            Email: {selectedPembeli.email}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-gray-700">
                                        Silakan pilih pembeli untuk melihat
                                        detail.
                                    </p>
                                )}

                                {/* <p className="text-gray-700">
                                    Total sales tax:
                                    {formatPrice(tax.toFixed(2))}
                                </p> */}

                                <p className="text-xl font-bold mt-2">
                                    Total: {formatPrice(total.toFixed(2))}
                                </p>
                                <p className="text-xl font-bold mt-2">
                                    Kembalian:{" "}
                                    {formatPrice(calculateChange().toFixed(2))}
                                </p>
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="flex-1 bg-green-500 text-white rounded-full px-4 py-2 mr-2"
                                    onClick={handleOpenModal}
                                >
                                    Cash
                                </button>
                                <button
                                    onClick={handleOpenPaymentModal}
                                    className="flex-1 bg-orange-500 text-white rounded-full px-4 py-2"
                                >
                                    Checkout
                                </button>
                                <div
                                    id="snap-container"
                                    className="hidden"
                                ></div>
                            </div>

                            {/* CASH */}
                            {isModalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div
                                        id="invoice"
                                        className="bg-white p-8 max-w-[794px] w-full h-full max-h-[1123px] mx-auto border rounded-lg shadow-lg relative overflow-auto"
                                    >
                                        <button
                                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                                            onClick={handleCloseModal}
                                        >
                                            &times;
                                        </button>

                                        <header className="flex justify-between items-center mb-8">
                                            <div>
                                                <h1 className="text-4xl font-bold">
                                                    YOURBEAN
                                                </h1>
                                                <p>Due date: {formattedDate}</p>
                                            </div>
                                            <div className="text-right">
                                                <h2 className="text-xl font-semibold">
                                                    INVOICE
                                                </h2>
                                                <p className="text-gray-600">
                                                    {invoiceNumber}
                                                </p>
                                            </div>
                                        </header>

                                        <section className="mb-8">
                                            <div className="flex justify-between">
                                                <div className="w-1/2">
                                                    <h3 className="font-semibold">
                                                        From:
                                                    </h3>
                                                    <p>Yourbean.co</p>
                                                    <p>
                                                        Jl. Matraman Raya No.30E
                                                    </p>
                                                    <p>
                                                        Menteng, Jakarta Pusat,
                                                        10430
                                                    </p>
                                                    <p>www.yourbean.com</p>
                                                    <p>+62 812 123 1234</p>
                                                    <p>
                                                        faziimaria1884@yourbean.co
                                                    </p>
                                                    <p>
                                                        NPWP: 12 244 8564 4 563
                                                        254
                                                    </p>
                                                </div>

                                                {selectedPembeli ? (
                                                    <div className="w-1/2 text-left">
                                                        <h3 className="font-semibold">
                                                            Bill to:
                                                        </h3>
                                                        <p>
                                                            {
                                                                selectedPembeli.nama
                                                            }
                                                        </p>
                                                        <p>
                                                            {
                                                                selectedPembeli.email
                                                            }
                                                        </p>
                                                        <p>
                                                            {" "}
                                                            {
                                                                selectedPembeli.nomor_telepon
                                                            }
                                                        </p>

                                                        <section className="mb-8 mt-4">
                                                            <p className="font-semibold">
                                                                Metode
                                                                Pembayaran:
                                                            </p>
                                                            <p>
                                                                {paymentMethod ===
                                                                "Cash"
                                                                    ? "Cash"
                                                                    : "BNI virtual account"}
                                                            </p>
                                                            {paymentMethod ===
                                                            "Cash" ? null : (
                                                                <p>
                                                                    777598948847737
                                                                </p>
                                                            )}
                                                        </section>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-700">
                                                        Silakan pilih pembeli
                                                        untuk melihat detail.
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mt-4">
                                                {/* <p className="font-semibold mb-6">
                                                    Reference:{" "}
                                                    <span className="font-normal">
                                                        Pembayaran
                                                    </span>
                                                </p> */}
                                                <p className="font-semibold mb-2 text-3xl">
                                                    Total Pembayaran:{" "}
                                                    {formatPrice(
                                                        total.toFixed(2)
                                                    )}
                                                </p>
                                                <p className="font-semibold mb-2 text-2xl">
                                                    Order Id: {invoiceNumber}
                                                </p>
                                            </div>
                                        </section>

                                        <section className="mb-8">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr>
                                                        <th className="border-b p-2">
                                                            Nama Barang
                                                        </th>
                                                        <th className="border-b p-2">
                                                            Jumlah
                                                        </th>
                                                        <th className="border-b p-2">
                                                            Harga Satuan
                                                        </th>
                                                        <th className="border-b p-2">
                                                            Subtotal Satuan
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cart.length > 0 ? (
                                                        cart.map(
                                                            (order, index) => (
                                                                <tr key={index}>
                                                                    <td className="border-b p-2">
                                                                        {
                                                                            order.nama_item
                                                                        }
                                                                    </td>
                                                                    <td className="border-b p-2">
                                                                        {
                                                                            order.qty
                                                                        }
                                                                    </td>
                                                                    <td className="border-b p-2">
                                                                        {formatPrice(
                                                                            order.harga
                                                                        )}
                                                                    </td>
                                                                    <td className="border-b p-2">
                                                                        {formatPrice(
                                                                            order.harga *
                                                                                order.qty
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan="4"
                                                                className="text-center p-2"
                                                            >
                                                                No items in cart
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </section>

                                        <section className="mb-8">
                                            <div className="flex justify-between">
                                                <p className="font-semibold">
                                                    Subtotal
                                                </p>
                                                <p>
                                                    {formatPrice(
                                                        subtotal.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">
                                                    Potongan Harga
                                                </p>
                                                <p>{formatPrice(discount)}</p>
                                            </div>
                                            {/* <div className="flex justify-between">
                                                <p className="font-semibold">
                                                    Uang Yang Dibayarkan
                                                </p>
                                                <p>
                                                    {" "}
                                                    {paidAmount !== ""
                                                        ? formatPrice(
                                                              parseFloat(
                                                                  paidAmount
                                                              ).toFixed(2)
                                                          )
                                                        : "Rp0,00"}
                                                </p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">
                                                    Shipping
                                                </p>
                                                <p>8,000</p>
                                            </div> */}

                                            <div className="flex justify-between mt-4">
                                                <p className="font-semibold">
                                                    Total Pembayaran
                                                </p>
                                                <p>
                                                    {formatPrice(
                                                        total.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                        </section>

                                        <footer className="mt-8">
                                            <p className="mb-4">
                                                Notes: Please pay via payment
                                                link or VA number provided. Be
                                                sure to pay before the due date
                                                mentioned above.
                                            </p>
                                            <p className="mb-4">
                                                Terms & Conditions: Shipping fee
                                                will be prepaid and added to
                                                your invoice. Stock items are
                                                shipped within 48 hours and
                                                typically take between 3 to 7
                                                business days to deliver.
                                            </p>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    Fazim Aria, Director
                                                </p>
                                                <p>__________________</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    // Create a new window for printing
                                                    const printWindow =
                                                        window.open(
                                                            "",
                                                            "",
                                                            "height=600,width=800"
                                                        );

                                                    // Get the HTML content of the invoice
                                                    const invoiceContent =
                                                        document.querySelector(
                                                            "#invoice"
                                                        ).innerHTML;

                                                    // Write the HTML content into the new window
                                                    printWindow.document.write(
                                                        "<html><head><title>Print Invoice</title>"
                                                    );

                                                    // Include Tailwind CSS via CDN
                                                    printWindow.document.write(
                                                        '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">'
                                                    );

                                                    // Add print-specific styles
                                                    printWindow.document.write(`
                                                                        <style>
                                                                            @media print {
                                                                                @page {
                                                                                    size: A4;
                                                                                    margin: 10mm;
                                                                                }
                                                                                body {
                                                                                    margin: 0;
                                                                                }
                                                                                .page-break {
                                                                                    page-break-before: always;
                                                                                }
                                                                                .bg-gray-100 {
                                                                                    background-color: #f7fafc; /* Tailwind's gray-100 */
                                                                                }
                                                                            }
                                                                        </style>
                                                                    `);

                                                    printWindow.document.write(
                                                        "</head><body>"
                                                    );
                                                    printWindow.document.write(
                                                        invoiceContent
                                                    );
                                                    printWindow.document.write(
                                                        "</body></html>"
                                                    );

                                                    // Close the document and focus the window
                                                    printWindow.document.close();
                                                    printWindow.focus();

                                                    // Trigger the print dialog
                                                    printWindow.print();
                                                }}
                                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                                            >
                                                Print
                                            </button>
                                        </footer>
                                    </div>
                                </div>
                            )}

                            {/* PAYMENT */}
                            {isPaymentModalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div
                                        id="invoice"
                                        className="bg-white p-8 max-w-[794px] w-full h-full max-h-[1123px] mx-auto border rounded-lg shadow-lg relative overflow-auto"
                                    >
                                        <button
                                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                                            onClick={handleClosePaymentModal}
                                        >
                                            &times;
                                        </button>

                                        <header className="flex justify-between items-center mb-8">
                                            <div>
                                                <h1 className="text-4xl font-bold">
                                                    YOURBEAN
                                                </h1>
                                                <p>Due date: {formattedDate}</p>
                                            </div>
                                            <div className="text-right">
                                                <h2 className="text-xl font-semibold">
                                                    INVOICE
                                                </h2>
                                                <p className="text-gray-600">
                                                    {invoiceNumber}
                                                </p>
                                            </div>
                                        </header>

                                        <section className="mb-8">
                                            <div className="flex justify-between">
                                                <div className="w-1/2">
                                                    <h3 className="font-semibold">
                                                        From:
                                                    </h3>
                                                    <p>Yourbean.co</p>
                                                    <p>
                                                        Jl. Matraman Raya No.30E
                                                    </p>
                                                    <p>
                                                        Menteng, Jakarta Pusat,
                                                        10430
                                                    </p>
                                                    <p>www.yourbean.com</p>
                                                    <p>+62 812 123 1234</p>
                                                    <p>
                                                        faziimaria1884@yourbean.co
                                                    </p>
                                                    <p>
                                                        NPWP: 12 244 8564 4 563
                                                        254
                                                    </p>
                                                </div>

                                                {selectedPembeli ? (
                                                    <div className="w-1/2 text-left">
                                                        <h3 className="font-semibold">
                                                            Bill to:
                                                        </h3>
                                                        <p>
                                                            {
                                                                selectedPembeli.nama
                                                            }
                                                        </p>
                                                        <p>
                                                            {
                                                                selectedPembeli.email
                                                            }
                                                        </p>
                                                        <p>
                                                            {" "}
                                                            {
                                                                selectedPembeli.nomor_telepon
                                                            }
                                                        </p>

                                                        <section className="mb-8 mt-4">
                                                            <p className="font-semibold">
                                                                Metode
                                                                Pembayaran:
                                                            </p>
                                                            <p>
                                                                {paymentMethod ===
                                                                "Cash"
                                                                    ? "Cash"
                                                                    : "BNI virtual account"}
                                                            </p>
                                                            {paymentMethod ===
                                                            "Cash" ? null : (
                                                                <p>
                                                                    777598948847737
                                                                </p>
                                                            )}
                                                        </section>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-700">
                                                        Silakan pilih pembeli
                                                        untuk melihat detail.
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mt-4">
                                                {/* <p className="font-semibold mb-6">
                                                   Reference:{" "}
                                                   <span className="font-normal">
                                                       Pembayaran
                                                   </span>
                                               </p> */}
                                                <p className="font-semibold mb-2 text-3xl">
                                                    Total Pembayaran:{" "}
                                                    {formatPrice(
                                                        total.toFixed(2)
                                                    )}
                                                </p>
                                                <p className="font-semibold mb-2 text-2xl">
                                                    Order Id: {invoiceNumber}
                                                </p>
                                            </div>
                                        </section>

                                        <section className="mb-8">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr>
                                                        <th className="border-b p-2">
                                                            Nama Barang
                                                        </th>
                                                        <th className="border-b p-2">
                                                            Jumlah
                                                        </th>
                                                        <th className="border-b p-2">
                                                            Harga Satuan
                                                        </th>
                                                        <th className="border-b p-2">
                                                            Subtotal Satuan
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cart.length > 0 ? (
                                                        cart.map(
                                                            (order, index) => (
                                                                <tr key={index}>
                                                                    <td className="border-b p-2">
                                                                        {
                                                                            order.nama_item
                                                                        }
                                                                    </td>
                                                                    <td className="border-b p-2">
                                                                        {
                                                                            order.qty
                                                                        }
                                                                    </td>
                                                                    <td className="border-b p-2">
                                                                        {formatPrice(
                                                                            order.harga
                                                                        )}
                                                                    </td>
                                                                    <td className="border-b p-2">
                                                                        {formatPrice(
                                                                            order.harga *
                                                                                order.qty
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan="4"
                                                                className="text-center p-2"
                                                            >
                                                                No items in cart
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </section>

                                        <section className="mb-8">
                                            <div className="flex justify-between">
                                                <p className="font-semibold">
                                                    Subtotal
                                                </p>
                                                <p>
                                                    {formatPrice(
                                                        subtotal.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="font-semibold">
                                                    Potongan Harga
                                                </p>
                                                <p>{formatPrice(discount)}</p>
                                            </div>

                                            <div className="flex justify-between mt-4">
                                                <p className="font-semibold">
                                                    Total Pembayaran
                                                </p>
                                                <p>
                                                    {formatPrice(
                                                        total.toFixed(2)
                                                    )}
                                                </p>
                                            </div>
                                        </section>

                                        <footer className="mt-8">
                                            <p className="mb-4">
                                                Notes: Please pay via payment
                                                link or VA number provided. Be
                                                sure to pay before the due date
                                                mentioned above.
                                            </p>
                                            <p className="mb-4">
                                                Terms & Conditions: Shipping fee
                                                will be prepaid and added to
                                                your invoice. Stock items are
                                                shipped within 48 hours and
                                                typically take between 3 to 7
                                                business days to deliver.
                                            </p>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    Fazim Aria, Director
                                                </p>
                                                <p>__________________</p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    // Create a new window for printing
                                                    const printWindow =
                                                        window.open(
                                                            "",
                                                            "",
                                                            "height=600,width=800"
                                                        );

                                                    // Get the HTML content of the invoice
                                                    const invoiceContent =
                                                        document.querySelector(
                                                            "#invoice"
                                                        ).innerHTML;

                                                    // Write the HTML content into the new window
                                                    printWindow.document.write(
                                                        "<html><head><title>Print Invoice</title>"
                                                    );

                                                    // Include Tailwind CSS via CDN
                                                    printWindow.document.write(
                                                        '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">'
                                                    );

                                                    // Add print-specific styles
                                                    printWindow.document.write(`
                                                                       <style>
                                                                           @media print {
                                                                               @page {
                                                                                   size: A4;
                                                                                   margin: 10mm;
                                                                               }
                                                                               body {
                                                                                   margin: 0;
                                                                               }
                                                                               .page-break {
                                                                                   page-break-before: always;
                                                                               }
                                                                               .bg-gray-100 {
                                                                                   background-color: #f7fafc; /* Tailwind's gray-100 */
                                                                               }
                                                                           }
                                                                       </style>
                                                                   `);

                                                    printWindow.document.write(
                                                        "</head><body>"
                                                    );
                                                    printWindow.document.write(
                                                        invoiceContent
                                                    );
                                                    printWindow.document.write(
                                                        "</body></html>"
                                                    );

                                                    // Close the document and focus the window
                                                    printWindow.document.close();
                                                    printWindow.focus();

                                                    // Trigger the print dialog
                                                    printWindow.print();
                                                }}
                                                className="flex-1 bg-blue-500 text-white rounded-full px-4 py-2 ml-2 mr-1"
                                            >
                                                Print
                                            </button>
                                            <button
                                                className="flex-1 bg-orange-500 text-white rounded-full px-4 py-2 ml-2"
                                                onClick={handlePayment}
                                            >
                                                Payment
                                            </button>
                                        </footer>
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
