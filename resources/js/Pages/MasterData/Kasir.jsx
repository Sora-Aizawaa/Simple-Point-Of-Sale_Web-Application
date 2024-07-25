import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Nav from "@/Layouts/Nav";

export default function Kasir({ auth }) {
    const [items, setItems] = useState([
        { id: 1, nama: "Buku Tulis", harga: 5000, jumlah: 1 },
        { id: 2, nama: "Pensil", harga: 2000, jumlah: 3 },
        { id: 3, nama: "Penghapus", harga: 3000, jumlah: 2 },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [paidAmount, setPaidAmount] = useState(0); // State untuk menyimpan jumlah uang yang dibayar
    const [showWeightModal, setShowWeightModal] = useState(false); // State untuk menampilkan modal kalkulator timbangan
    const [weightInput, setWeightInput] = useState(""); // State untuk input berat
    const [calculatedPrice, setCalculatedPrice] = useState(0); // State untuk hasil perhitungan harga berdasarkan berat
    const [additionalPrice, setAdditionalPrice] = useState(0);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openWeightModal = () => {
        setShowWeightModal(true);
    };

    const closeWeightModal = () => {
        setShowWeightModal(false);
    };

    const calculateTotal = () => {
        let total = 0;
        items.forEach((item) => {
            total += item.harga * item.jumlah;
        });
        return total;
    };

    const handlePayment = () => {
        // Implementasi logika pembayaran di sini
        const total = calculateTotal();
        if (paidAmount >= total) {
            const change = paidAmount - total;
            alert(`Pembayaran berhasil dilakukan! Uang kembalian: ${change}`);
            // Reset state atau navigasi ke halaman berikutnya
        } else {
            alert("Jumlah uang yang dibayarkan kurang dari total belanja.");
            // Atur ulang state atau lakukan tindakan lain sesuai kebutuhan
        }
    };

    const removeItem = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    };

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleWeightChange = (e) => {
        const { value } = e.target;
        setWeightInput(value);

        // Hitung harga berdasarkan berat
        const pricePerKg = 15000; // Misal harga per kg
        const weightInKg = parseFloat(value) / 1000; // Konversi gram ke kg
        const totalPrice = pricePerKg * weightInKg;
        setCalculatedPrice(totalPrice);

        // Menambahkan hasil kalkulator timbangan ke total
        setAdditionalPrice(totalPrice); // Pastikan Anda memiliki state untuk menyimpan harga tambahan
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<Nav auth={auth} />}>
            <Head title="Halaman Kasir" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <h2 className="text-lg font-semibold mb-5">
                                        Kasir
                                    </h2>
                                    <div className="flex">
                                        <button
                                            onClick={openModal}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
                                        >
                                            Bayar Online
                                        </button>
                                        <button
                                            onClick={openWeightModal}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                        >
                                            Kalkulator Timbangan
                                        </button>
                                    </div>
                                </div>
                                <table className="min-w-full bg-white mt-4">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                Nama Barang
                                            </th>
                                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                Harga Satuan
                                            </th>
                                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                Jumlah
                                            </th>
                                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                Subtotal
                                            </th>
                                            <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                    {item.nama}
                                                </td>
                                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                    {formatNumber(item.harga)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                    {item.jumlah}
                                                </td>
                                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                    {formatNumber(
                                                        item.harga * item.jumlah
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                    <button
                                                        onClick={() =>
                                                            removeItem(item.id)
                                                        }
                                                        className="text-red-600"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-right font-semibold"
                                            >
                                                Total
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 font-semibold">
                                                {formatNumber(
                                                    calculateTotal() +
                                                        additionalPrice
                                                )}
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-right font-semibold"
                                            >
                                                Uang yang Dibayarkan
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                <input
                                                    type="number"
                                                    className="border border-gray-300 rounded-md px-3 py-1"
                                                    value={paidAmount}
                                                    onChange={(e) =>
                                                        setPaidAmount(
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-right font-semibold"
                                            >
                                                Uang Kembalian
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 font-semibold">
                                                {paidAmount >= calculateTotal()
                                                    ? formatNumber(
                                                          paidAmount -
                                                              calculateTotal()
                                                      )
                                                    : "Masukkan jumlah yang cukup"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                <button
                                                    // onClick={handleSave}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                                >
                                                    Simpan Transaksi
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Tampilkan hasil kalkulator timbangan */}
                                        {showWeightModal && (
                                            <div className="fixed z-10 inset-0 overflow-y-auto">
                                                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                                    <div className="fixed inset-0 transition-opacity">
                                                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                                    </div>

                                                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                                                        &#8203;
                                                    </span>

                                                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                                        <div>
                                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                                Kalkulator
                                                                Timbangan
                                                            </h3>
                                                            {/* Isi kalkulator timbangan */}
                                                            <div className="mt-4">
                                                                <input
                                                                    type="number"
                                                                    className="border border-gray-300 rounded-md px-3 py-1 mr-2 mb-4"
                                                                    placeholder="Masukkan berat (gram)"
                                                                    value={
                                                                        weightInput
                                                                    }
                                                                    onChange={
                                                                        handleWeightChange
                                                                    }
                                                                />
                                                                <span className="text-gray-600">
                                                                    Misal: 200
                                                                    gram
                                                                </span>
                                                                <input
                                                                    type="number"
                                                                    className="border border-gray-300 rounded-md px-3 py-1 mr-2"
                                                                    placeholder="Masukkan berat (gram)"
                                                                    value={
                                                                        weightInput
                                                                    }
                                                                    onChange={
                                                                        handleWeightChange
                                                                    }
                                                                />
                                                            </div>
                                                            <table className="min-w-full bg-white mt-4">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 font-semibold">
                                                                            Total
                                                                            Berat
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                                            {
                                                                                weightInput
                                                                            }{" "}
                                                                            gram
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 font-semibold">
                                                                            Harga
                                                                            Berdasarkan
                                                                            Berat
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                                            {formatNumber(
                                                                                calculatedPrice
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            {/* Tombol untuk menutup modal kalkulator timbangan */}
                                                            <div className="mt-4 flex items-center">
                                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2">
                                                                    Simpan
                                                                </button>
                                                                <button
                                                                    onClick={
                                                                        closeWeightModal
                                                                    }
                                                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                                                                >
                                                                    Batal
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Kasir */}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                            &#8203;
                        </span>

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Pembayaran
                                </h3>
                                {/* Tampilkan daftar item yang dibeli */}
                                <table className="min-w-full bg-white">
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                    {item.nama}
                                                </td>
                                                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-right">
                                                    {formatNumber(
                                                        item.harga * item.jumlah
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 font-semibold">
                                                Total
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-right font-semibold">
                                                {formatNumber(calculateTotal())}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* Tombol untuk menutup modal dan proses pembayaran */}
                                <div className="mt-4">
                                    <button
                                        onClick={handlePayment}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
                                    >
                                        Proses Pembayaran
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
