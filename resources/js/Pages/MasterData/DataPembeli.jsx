import { React, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Nav from "@/Layouts/Nav";
import axios from "axios";

const DataPembeli = ({ auth, dataPembeli }) => {
    const [selectedRiwayat, setSelectedRiwayat] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (riwayat) => {
        setSelectedRiwayat(riwayat);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRiwayat(null);
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<Nav user={auth.user} />}>
            <Head title="Data Pembeli" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-1">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-5">
                                Data Pembeli
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Id Pembeli
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Alamat
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                No Telepon
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal Pendaftaran
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Riwayat Pembelian
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {dataPembeli.map((pembeli, index) => (
                                            <tr key={pembeli.id_pembeli}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {pembeli.id_pembeli}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {pembeli.nama}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {pembeli.alamat}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {pembeli.nomor_telepon}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {pembeli.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {
                                                        pembeli.tanggal_pendaftaran
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        onClick={() =>
                                                            openModal(
                                                                pembeli.riwayat_pembelian
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Lihat Riwayat
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        // onClick={() =>
                                                        //     handleDelete(
                                                        //         pembeli.id_pembeli
                                                        //     )
                                                        // }
                                                        className="text-blue-600 hover:text-blue-900 ml-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        // onClick={() =>
                                                        //     handleDelete(
                                                        //         pembeli.id_pembeli
                                                        //     )
                                                        // }
                                                        className="text-red-600 hover:text-red-900 ml-4"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Modal Info RIWAYAT PEMBELIAN */}
                            {isModalOpen && (
                                <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
                                        <h2 className="text-xl font-semibold mb-4">
                                            Riwayat Pembelian
                                        </h2>
                                        {selectedRiwayat ? (
                                            <ul>
                                                {selectedRiwayat.map(
                                                    (riwayat, index) => (
                                                        <li
                                                            key={index}
                                                            className="mb-2"
                                                        >
                                                            <strong>
                                                                Produk:
                                                            </strong>{" "}
                                                            {
                                                                riwayat.nama_produk
                                                            }{" "}
                                                            <br />
                                                            <strong>
                                                                Jumlah:
                                                            </strong>{" "}
                                                            {riwayat.jumlah}{" "}
                                                            <br />
                                                            <strong>
                                                                Tanggal
                                                                Pembelian:
                                                            </strong>{" "}
                                                            {
                                                                riwayat.tanggal_pembelian
                                                            }
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        ) : (
                                            <p>Tidak ada riwayat pembelian.</p>
                                        )}
                                        <button
                                            onClick={closeModal}
                                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Tutup
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

export default DataPembeli;
