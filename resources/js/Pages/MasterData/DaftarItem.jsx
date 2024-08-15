import React, { useState, useEffect, useRef } from "react";
import Barcode from "react-barcode";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import Nav from "@/Layouts/Nav";

export default function DaftarItem({ auth, items }) {
    const [itemsState, setItemsState] = useState(items || []);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        if (items) {
            setItemsState(items); // Set itemsState hanya jika items sudah terdefinisi
        }
    }, [items]);

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

    const openDeleteModal = (id_barang) => {
        setItemToDelete(id_barang);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    const formatCurrency = (value) => {
        return parseInt(value).toLocaleString("id-ID");
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        reset();
        setPreviewImage(null);
    };

    const { data, setData, reset } = useForm({
        kode_item: "",
        nama_item: "",
        stok: "",
        satuan: "",
        jenis: "",
        merk: "",
        harga: "",
        image: null,
    });

    // const handleEdit = (index) => {
    //     const itemToEdit = items[index];
    //     setData({
    //         kode_item: itemToEdit.kode_item,
    //         nama_item: itemToEdit.nama_item,
    //         stok: itemToEdit.stok,
    //         satuan: itemToEdit.satuan,
    //         jenis: itemToEdit.jenis,
    //         merk: itemToEdit.merk,
    //         harga: itemToEdit.harga,
    //         image: null,
    //     });

    //     setPreviewImage(itemToEdit.image);
    //     setEditIndex(index);

    //     setShowEditModal(true);
    // };

    const handleEdit = (id_barang) => {
        console.log("ID to edit:", id_barang);
        console.log("Items:", items);

        const itemToEdit = items.find((item) => item.id_barang === id_barang); // Cari item berdasarkan ID
        if (itemToEdit) {
            console.log("Item Found:", itemToEdit);

            setData({
                kode_item: itemToEdit.kode_item,
                nama_item: itemToEdit.nama_item,
                stok: itemToEdit.stok,
                satuan: itemToEdit.satuan,
                jenis: itemToEdit.jenis,
                merk: itemToEdit.merk,
                harga: itemToEdit.harga,
                image: null,
            });

            setPreviewImage(itemToEdit.image);
            setEditIndex(id_barang); // Simpan ID sebagai edit index

            setShowEditModal(true);
        } else {
            console.error("Item with the specified ID not found");
        }
    };

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const handleChange = (e) => {
        const { name, files, value } = e.target;

        if (name === "image" && files.length > 0) {
            const file = files[0];
            setData({
                ...data,
                [name]: file,
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setData({
                ...data,
                [name]: value,
            });
        }
    };

    // EDIT DATA
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const formData = new FormData();
    //     formData.append("_method", "PATCH"); // Gunakan PATCH method untuk update
    //     formData.append("kode_item", data.kode_item);
    //     formData.append("nama_item", data.nama_item);
    //     formData.append("stok", data.stok);
    //     formData.append("satuan", data.satuan);
    //     formData.append("jenis", data.jenis);
    //     formData.append("merk", data.merk);
    //     formData.append("harga", data.harga);

    //     // Append image only if it's not null
    //     if (data.image instanceof File) {
    //         formData.append("image", data.image);
    //     } else if (data.image === null) {
    //         formData.append("image", ""); // Clear image if no new file is selected
    //     }

    //     try {
    //         console.log("Submitting form for item ID:", editIndex);
    //         // Use await to ensure the promise resolves before continuing
    //         await router.post(`/daftar-item/${items[editIndex].id}`, formData, {
    //             onSuccess: () => {
    //                 setShowEditModal(false);
    //                 reset();
    //                 setPreviewImage(null);

    //                 setTimeout(() => {
    //                     alert("Data Berhasil Diupdate!");
    //                     router.visit("/daftar-item");
    //                 }, 2000); // 2 seconds delay for user to see the message
    //             },
    //             onError: (errors) => {
    //                 console.error("Error updating item:", errors);
    //             },
    //         });
    //     } catch (error) {
    //         console.error("Error updating item:", error);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PATCH"); // Gunakan PATCH method untuk update
        formData.append("kode_item", data.kode_item);
        formData.append("nama_item", data.nama_item);
        formData.append("stok", data.stok);
        formData.append("satuan", data.satuan);
        formData.append("jenis", data.jenis);
        formData.append("merk", data.merk);
        formData.append("harga", data.harga);

        // Append image only if it's not null
        if (data.image instanceof File) {
            formData.append("image", data.image);
        } else if (data.image === null) {
            formData.append("image", ""); // Clear image if no new file is selected
        }

        try {
            console.log("Submitting form for item ID:", editIndex);
            // Use await to ensure the promise resolves before continuing
            await router.post(`/daftar-item/${editIndex}`, formData, {
                onSuccess: () => {
                    setShowEditModal(false);
                    reset();
                    setPreviewImage(null);

                    setTimeout(() => {
                        alert("Data Berhasil Diupdate!");
                        router.visit("/daftar-item");
                    }, 2000); // 2 seconds delay for user to see the message
                },
                onError: (errors) => {
                    console.error("Error updating item:", errors);
                },
            });
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    // TAMBAH DATA
    const TambahData = (e) => {
        e.preventDefault();
        router.post("/daftar-item", data, {
            onSuccess: () => {
                // Clear the form data and image preview after successful submission
                reset();
                setPreviewImage(null);

                // Show success message
                setShowSuccessMessage(true);

                // Redirect to daftaritem.index after a short delay
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    router.visit("/daftar-item");
                }, 2000); // 2 seconds delay for user to see the message
            },
        });
    };

    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await router.post(
                    `/daftar-item/${itemToDelete}`,
                    {
                        _method: "DELETE",
                    },
                    {
                        onSuccess: () => {
                            closeDeleteModal();
                            // Optionally, refresh the page or fetch the updated data
                            router.visit("/daftar-item");
                        },
                        onError: (errors) => {
                            console.error("Error deleting item:", errors);
                        },
                    }
                );
            } catch (errors) {
                console.error("Error deleting item:", errors);
            }
        }
    };

    const [selectedImage, setSelectedImage] = useState(null);

    const openImageModal = (image) => {
        setSelectedImage(image);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const itemToDeleteData = items.find(
        (item) => item.id_barang === itemToDelete
    );

    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const barcodeRef = useRef(null);

    const openPrintModal = (item) => {
        setSelectedItem(item);
        setShowPrintModal(true);
    };

    const closePrintModal = () => {
        setSelectedItem(null);
        setShowPrintModal(false);
    };

    const printBarcode = () => {
        const printWindow = window.open("", "", "height=600,width=800");
        const svgElement = barcodeRef.current.innerHTML; // Get SVG content as string

        printWindow.document.write(
            "<html><head><title>Print Barcode</title></head><body>"
        );
        printWindow.document.write(svgElement); // Write SVG content to the new window
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<Nav auth={auth} />}>
            <Head title="Data Barang" />

            {showSuccessMessage && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#4caf50",
                        color: "white",
                        padding: "10px",
                        zIndex: 1000,
                    }}
                >
                    Data berhasil disimpan!
                </div>
            )}

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <h2 className="text-lg font-semibold mb-5">
                                        Data Barang
                                    </h2>

                                    <div className="flex items-center space-x-2 mb-5">
                                        <input
                                            type="text"
                                            className="px-4 py-2 border rounded-lg"
                                            placeholder="Cari Kode Item"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                            onClick={openAddModal}
                                        >
                                            Tambah Item
                                        </button>
                                    </div>
                                </div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                No
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Kode Item
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Nama Item
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Stok
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Satuan
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Jenis
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Merk
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Harga
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Gambar
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredItems.map((item, index) => (
                                            <tr key={item.id_barang}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {index + 1}.
                                                </td>
                                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <Barcode
                                                        value={item.kode_item}
                                                        height={50}
                                                        width={1}
                                                    />
                                                </td> */}

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        onClick={() =>
                                                            openPrintModal(item)
                                                        }
                                                    >
                                                        <Barcode
                                                            value={
                                                                item.kode_item
                                                            }
                                                            height={50}
                                                            width={1}
                                                        />
                                                    </button>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.nama_item}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.stok}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.satuan}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.jenis}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.merk}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatCurrency(item.harga)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.nama_item}
                                                            className="h-16 w-16 object-cover cursor-pointer"
                                                            onClick={() =>
                                                                openImageModal(
                                                                    item.image
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 mr-2"
                                                        onClick={() =>
                                                            handleEdit(
                                                                item.id_barang
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                item.id_barang
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {selectedImage && (
                                    <div className="fixed z-10 inset-0 overflow-y-auto">
                                        <div className="flex items-center justify-center min-h-screen">
                                            <div
                                                className="fixed inset-0 bg-black opacity-75"
                                                onClick={closeImageModal}
                                            ></div>
                                            <div className="relative bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-3xl sm:w-full">
                                                <img
                                                    src={selectedImage}
                                                    alt="Selected Item"
                                                    className="w-full h-auto max-h-screen object-contain"
                                                />
                                                <button
                                                    className="absolute top-4 right-4 text-black text-3xl font-bold cursor-pointer"
                                                    onClick={closeImageModal}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 text-right">
                                    Jumlah item: {filteredItems.length}
                                </div>

                                {/* Add Item Modal */}
                                {showAddModal && (
                                    <div className="fixed z-10 inset-0 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                            <div
                                                className="fixed inset-0 transition-opacity"
                                                aria-hidden="true"
                                            >
                                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                            </div>

                                            <span
                                                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                                aria-hidden="true"
                                            >
                                                &#8203;
                                            </span>

                                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                        <h3
                                                            className="text-lg leading-6 font-medium text-gray-900"
                                                            id="modal-title"
                                                        >
                                                            Tambah Item
                                                        </h3>
                                                        <div className="mt-2">
                                                            <form
                                                                onSubmit={
                                                                    TambahData
                                                                }
                                                            >
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Kode
                                                                        Item
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="kode_item"
                                                                        value={
                                                                            data.kode_item
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setData(
                                                                                "kode_item",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />

                                                                    {/* {errors.kode_item && (
                                                                        <p className="text-red-700 text-sm mt-2">
                                                                            {
                                                                                errors.kode_item
                                                                            }
                                                                        </p>
                                                                    )} */}
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Nama
                                                                        Item
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="nama_item"
                                                                        value={
                                                                            data.nama_item
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setData(
                                                                                "nama_item",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Stok
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="stok"
                                                                        value={
                                                                            data.stok
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setData(
                                                                                "stok",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Satuan
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="satuan"
                                                                        value={
                                                                            data.satuan
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setData(
                                                                                "satuan",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Jenis
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="jenis"
                                                                        value={
                                                                            data.jenis
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setData(
                                                                                "jenis",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Merk
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="merk"
                                                                        value={
                                                                            data.merk
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setData(
                                                                                "merk",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Harga
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="harga"
                                                                        value={
                                                                            data.harga
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setData(
                                                                                "harga",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Gambar
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        name="image"
                                                                        accept="image/*"
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg"
                                                                        required
                                                                    />
                                                                    {previewImage && (
                                                                        <img
                                                                            src={
                                                                                previewImage
                                                                            }
                                                                            alt="Preview"
                                                                            className="mt-2 h-25 w-25 object-cover"
                                                                        />
                                                                    )}

                                                                    {/* {data.image && (
                                                                        <img
                                                                            src={URL.createObjectURL(
                                                                                data.image
                                                                            )}
                                                                            alt="Preview"
                                                                            className="mt-2 h-30 w-30 object-cover"
                                                                        />
                                                                    )} */}
                                                                </div>
                                                                <div className="mt-4">
                                                                    <button
                                                                        type="submit"
                                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                                                    >
                                                                        Simpan
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg"
                                                                        onClick={
                                                                            closeAddModal
                                                                        }
                                                                    >
                                                                        Batal
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showEditModal && (
                                    <div className="fixed z-10 inset-0 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                            <div
                                                className="fixed inset-0 transition-opacity"
                                                aria-hidden="true"
                                            >
                                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                            </div>

                                            <span
                                                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                                aria-hidden="true"
                                            >
                                                &#8203;
                                            </span>

                                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                        <h3
                                                            className="text-lg leading-6 font-medium text-gray-900"
                                                            id="modal-title"
                                                        >
                                                            Edit Item :
                                                        </h3>

                                                        <div className="mt-2">
                                                            <form
                                                                onSubmit={
                                                                    handleSubmit
                                                                }
                                                            >
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Kode
                                                                        Item
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="kode_item"
                                                                        value={
                                                                            data.kode_item
                                                                        }
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Nama
                                                                        Item
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="nama_item"
                                                                        value={
                                                                            data.nama_item
                                                                        }
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Stok
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="stok"
                                                                        value={
                                                                            data.stok
                                                                        }
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Satuan
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="satuan"
                                                                        value={
                                                                            data.satuan
                                                                        }
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Jenis
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="jenis"
                                                                        value={
                                                                            data.jenis
                                                                        }
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Merk
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="merk"
                                                                        value={
                                                                            data.merk
                                                                        }
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Harga
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="harga"
                                                                        value={
                                                                            data.harga
                                                                        }
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                        required
                                                                    />
                                                                </div>
                                                                {/* <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Gambar
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        name="image"
                                                                        accept="image/*"
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg"
                                                                    />
                                                                    {previewImage && (
                                                                        <img
                                                                            src={
                                                                                previewImage
                                                                            }
                                                                            alt="Preview"
                                                                            className="mt-2 h-30 w-30"
                                                                        />
                                                                    )}
                                                                </div> */}

                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Gambar
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        name="image"
                                                                        accept="image/*"
                                                                        onChange={
                                                                            handleChange
                                                                        }
                                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg"
                                                                    />
                                                                    {data.image &&
                                                                        typeof data.image !==
                                                                            "string" && ( // Periksa bahwa data.image adalah instance dari File
                                                                            <img
                                                                                src={URL.createObjectURL(
                                                                                    data.image
                                                                                )}
                                                                                alt="Preview"
                                                                                className="mt-2 h-30 w-30"
                                                                            />
                                                                        )}
                                                                    {data.image &&
                                                                        typeof data.image ===
                                                                            "string" && ( // Periksa bahwa data.image adalah URL string
                                                                            <img
                                                                                src={
                                                                                    data.image
                                                                                }
                                                                                alt="Preview"
                                                                                className="mt-2 h-30 w-30"
                                                                            />
                                                                        )}
                                                                    {!data.image &&
                                                                        previewImage && (
                                                                            <img
                                                                                src={
                                                                                    previewImage
                                                                                }
                                                                                alt="Preview"
                                                                                className="mt-2 h-30 w-30"
                                                                            />
                                                                        )}
                                                                </div>

                                                                <div className="mt-4 flex justify-left">
                                                                    <button
                                                                        type="submit"
                                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
                                                                    >
                                                                        Update
                                                                        Item
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                                                                        onClick={
                                                                            closeEditModal
                                                                        }
                                                                    >
                                                                        Batal
                                                                    </button>
                                                                </div>
                                                            </form>
                                                            {showSuccessMessage && (
                                                                <div className="mt-4 text-green-600">
                                                                    Item updated
                                                                    successfully!
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Delete Confirmation Modal */}
                                {showDeleteModal && (
                                    <div className="fixed z-10 inset-0 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                            <div
                                                className="fixed inset-0 transition-opacity"
                                                aria-hidden="true"
                                            >
                                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                            </div>

                                            <span
                                                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                                aria-hidden="true"
                                            >
                                                &#8203;
                                            </span>

                                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                        <svg
                                                            className="h-6 w-6 text-red-600"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                        <h3
                                                            className="text-lg leading-6 font-medium text-gray-900"
                                                            id="modal-title"
                                                        >
                                                            Hapus Item
                                                        </h3>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-500">
                                                                Apakah Anda
                                                                yakin ingin
                                                                menghapus item{" "}
                                                                <strong>
                                                                    {itemToDeleteData
                                                                        ? itemToDeleteData.nama_item
                                                                        : "Loading..."}
                                                                </strong>{" "}
                                                                dari daftar?
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 sm:mt-6 sm:flex sm:flex-row-reverse">
                                                    <button
                                                        type="button"
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                                                        onClick={handleDelete}
                                                    >
                                                        Hapus
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                                                        onClick={
                                                            closeDeleteModal
                                                        }
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {showPrintModal && selectedItem && (
                                    <div className="fixed z-10 inset-0 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                            <div
                                                className="fixed inset-0 transition-opacity"
                                                aria-hidden="true"
                                            >
                                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                            </div>

                                            <span
                                                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                                aria-hidden="true"
                                            >
                                                &#8203;
                                            </span>

                                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                                        <svg
                                                            className="h-6 w-6 text-blue-600"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M6 10h12M6 14h12M4 6h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zm0 2v12h16V8H4z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                        <h3
                                                            className="text-lg leading-6 font-medium text-gray-900"
                                                            id="modal-title"
                                                        >
                                                            Print Barcode
                                                        </h3>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-500">
                                                                Apakah Anda
                                                                ingin mencetak
                                                                barcode untuk
                                                                item{" "}
                                                                <strong>
                                                                    {
                                                                        selectedItem.nama_item
                                                                    }
                                                                </strong>
                                                                ?
                                                            </p>
                                                            <div className="mt-4">
                                                                {/* Render barcode for printing */}
                                                                <div
                                                                    ref={
                                                                        barcodeRef
                                                                    }
                                                                >
                                                                    <Barcode
                                                                        value={
                                                                            selectedItem.kode_item
                                                                        }
                                                                        height={
                                                                            100
                                                                        }
                                                                        width={
                                                                            2
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 sm:mt-6 sm:flex sm:flex-row-reverse">
                                                    <button
                                                        type="button"
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                                                        onClick={printBarcode}
                                                    >
                                                        Print Barcode
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                                                        onClick={
                                                            closePrintModal
                                                        }
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
