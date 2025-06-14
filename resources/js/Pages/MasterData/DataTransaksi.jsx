import { React, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Nav from "@/Layouts/Nav";
import axios from "axios";

const DataTransaksi = ({ auth, data_transaksi }) => {
    // RIWAYAT TRANSAKSI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null);

    const handleInfoClick = (info) => {
        // Meng-decode JSON dari riwayat_transaksi
        const decodedInfo = JSON.parse(info);
        setSelectedInfo(decodedInfo);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInfo(null);
    };

    // Fungsi untuk memformat data JSON ke dalam format teks yang terstruktur
    const renderFormattedData = (data) => {
        if (!data || !Array.isArray(data)) return null;

        return data.map((item, index) => (
            <div key={index} className="mb-4">
                <p>
                    <strong>ID Barang:</strong> {item.id_barang || "N/A"}
                </p>
                <p>
                    <strong>Kode Barang:</strong> {item.kode_barang || "N/A"}
                </p>
                <p>
                    <strong>Nama Barang:</strong> {item.nama_barang || "N/A"}
                </p>
                <p>
                    <strong>Harga Per Unit:</strong>{" "}
                    {item.harga_per_unit
                        ? `Rp. ${parseFloat(item.harga_per_unit).toLocaleString(
                              "id-ID"
                          )}`
                        : "N/A"}
                </p>

                <p>
                    <strong>Jumlah:</strong> {item.jumlah || "N/A"}
                </p>
                <p>
                    <strong>Subtotal Per Unit:</strong>{" "}
                    {item.subtotal_per_unit
                        ? `Rp. ${parseFloat(
                              item.subtotal_per_unit
                          ).toLocaleString("id-ID")}`
                        : "N/A"}
                </p>
            </div>
        ));
    };

    const getPaymentMethodDisplay = (paymentMethod) => {
        switch (paymentMethod) {
            case "bank_transfer":
                return "Bank Transfer";
            case "credit_card":
                return "Credit Card";
            case "gopay":
                return "GoPay";
            case "shopeepay":
                return "ShopeePay";
            case "qris":
                return "QRIS";
            case "other":
                return "Cash";
            default:
                return "Unknown";
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<Nav user={auth.user} />}>
            <Head title="Data Pembeli" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-1">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-5">
                                Data Transaksi
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order Id
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama Pembeli
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Riwayat Pembelian
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Subtotal Pembelian
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Potongan Harga
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Uang Yang Dibayarkan
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Pembayaran
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Uang Kembalian
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal Transaksi
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Metode Pembayaran
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama Bank
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data_transaksi.map(
                                            (transaksi, index) => (
                                                <tr
                                                    key={transaksi.id_transaksi}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {index + 1}.
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {transaksi.order_id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {transaksi.pembeli.nama}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <button
                                                            className="text-blue-500 hover:underline"
                                                            onClick={() =>
                                                                handleInfoClick(
                                                                    transaksi.riwayat_transaksi
                                                                )
                                                            }
                                                        >
                                                            Informasi
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {`Rp. ${parseFloat(
                                                            transaksi.subtotal_keseluruhan
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {`Rp. ${parseFloat(
                                                            transaksi.potongan_harga
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {`Rp. ${parseFloat(
                                                            transaksi.uang_yang_dibayarkan
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {`Rp. ${parseFloat(
                                                            transaksi.total_pembayaran
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {`Rp. ${parseFloat(
                                                            transaksi.kembalian
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(
                                                            transaksi.tanggal_transaksi
                                                        ).toLocaleString(
                                                            "id-ID",
                                                            {
                                                                weekday: "long", // 'Monday', 'Tuesday', etc.
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                                // hour: "2-digit",
                                                                // minute: "2-digit",
                                                                // second: "2-digit",
                                                                hour12: false,
                                                            }
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {getPaymentMethodDisplay(
                                                            transaksi.metode_pembayaran
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {transaksi.nama_bank}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <div className="flex items-center space-x-2">
                                                            <span
                                                                className={`px-3 py-1 text-xs font-medium text-white rounded-full ${
                                                                    transaksi.status_pembayaran ===
                                                                    "Paid"
                                                                        ? "bg-green-500"
                                                                        : transaksi.status_pembayaran ===
                                                                          "Failed"
                                                                        ? "bg-red-500"
                                                                        : transaksi.status_pembayaran ===
                                                                          "Pending"
                                                                        ? "bg-orange-500"
                                                                        : "bg-red-500"
                                                                }`}
                                                            >
                                                                {transaksi.status_pembayaran ||
                                                                    "N/A"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {/* Actions (Edit/Delete) */}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Modal Info RIWAYAT PEMBELIAN */}
                            {isModalOpen && selectedInfo && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                        <h2 className="text-lg font-semibold mb-4">
                                            Detail Informasi
                                        </h2>
                                        {renderFormattedData(selectedInfo)}
                                        <button
                                            onClick={closeModal}
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default DataTransaksi;
