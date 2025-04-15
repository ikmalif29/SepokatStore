import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

interface Order {
    id: number;
    id_user: string;
    id_barang: number | null;
    quantity: number;
    size: number;
    alamat: string;
    no_hp: string;
    payment_method: string;
    created_at: string;
    updated_at: string;
    total_harga: number | null;
    name: string | null;
    price: number | null;
    gambar: string | null;
    bukti_pemesanan: string | null;
}

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
    const [kodeBukti, setKodeBukti] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const userId = localStorage.getItem("userLogin");
            const id = userId ? JSON.parse(userId).id : null;

            if (!id) {
                console.error("User ID not found in local storage.");
                setIsLoading(false);
                return;
            }

            try {
                const ordersResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/history/${id}`);
                if (!ordersResponse.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const ordersData: Order[] = await ordersResponse.json();
                const sortedOrders = sortOrdersByDate(ordersData, sortBy);
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [sortBy]);

    const sortOrdersByDate = (orders: Order[], sortDirection: "newest" | "oldest") => {
        return [...orders].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortDirection === "newest" ? dateB - dateA : dateA - dateB;
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatPrice = (price: number | null) => {
        if (price === null || price === 0) {
            return "Tidak tersedia";
        }
        return price.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    const toggleOrderDetails = (orderId: number) => {
        setSelectedOrder(selectedOrder === orderId ? null : orderId);
    };

    const getPaymentMethodColor = (method: string) => {
        const methods: Record<string, { bg: string; text: string }> = {
            DANA: { bg: "bg-blue-100", text: "text-blue-800" },
            Mandiri: { bg: "bg-yellow-100", text: "text-yellow-800" },
            BRI: { bg: "bg-red-100", text: "text-red-800" },
            BCA: { bg: "bg-blue-100", text: "text-blue-800" },
        };
        return methods[method] || { bg: "bg-gray-100", text: "text-gray-800" };
    };

    const uploadKodeBukti = async (orderId: number) => {
        const kode = kodeBukti[orderId];
        if (!kode) {
            alert("Masukkan kode bukti pemesanan!");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pemesanan/${orderId}/bukti`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bukti_pemesanan: kode }),
            });

            if (!response.ok) {
                throw new Error("Gagal mengunggah kode bukti");
            }

            const updatedOrder = await response.json();
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, bukti_pemesanan: updatedOrder.bukti_pemesanan } : order
                )
            );
            setKodeBukti((prev) => ({ ...prev, [orderId]: "" }));
            alert("Kode bukti berhasil diunggah!");
        } catch (error) {
            console.error("Error uploading kode bukti:", error);
            alert("Terjadi kesalahan saat mengunggah kode bukti.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="h-16 w-16 border-t-4 border-b-4 border-blue-600 rounded-full"
                />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-5xl mx-auto p-6 min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 mr-3 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        Riwayat Pesanan
                    </h1>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-3 sm:mb-0"
                        >
                            <p className="text-gray-600 flex items-center">
                                <span className="inline-flex items-center justify-center bg-blue-600 text-white font-medium rounded-full h-6 w-6 mr-2">
                                    {orders.length}
                                </span>
                                Pesanan ditemukan
                            </p>
                        </motion.div>
                        <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
                            <span className="text-gray-600 font-medium">Urutkan:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                                className="border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="newest">Terbaru</option>
                                <option value="oldest">Terlama</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {orders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center p-12 border rounded-lg bg-white shadow-md"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mx-auto mb-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <p className="text-gray-500 text-lg">Belum ada pesanan ditemukan.</p>
                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                Mulai Belanja
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order, index) => {
                                const productPrice = order.price;
                                const totalPrice = order.total_harga;

                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="border rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        <div
                                            onClick={() => toggleOrderDetails(order.id)}
                                            className="p-5 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                    <img
                                                        src={order.gambar || "/api/placeholder/200/200"}
                                                        alt={order.name || `Product #${order.id_barang || order.id}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-lg text-gray-800">
                                                        {order.name || `Product #${order.id_barang || order.id}`}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm flex items-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 mr-1"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6">
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        {order.quantity} × {formatPrice(productPrice)}
                                                    </p>
                                                    <div className="mt-1">
                                                        <span
                                                            className={`text-xs px-3 py-1 rounded-full ${getPaymentMethodColor(order.payment_method).bg} ${getPaymentMethodColor(order.payment_method).text} font-medium`}
                                                        >
                                                            {order.payment_method}
                                                        </span>
                                                    </div>
                                                </div>
                                                <motion.div
                                                    animate={{ rotate: selectedOrder === order.id ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="bg-gray-100 p-2 rounded-full"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-gray-600"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </motion.div>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {selectedOrder === order.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-5 pt-2 border-t border-gray-100 bg-gray-50">
                                                        <div className="grid md:grid-cols-2 gap-6">
                                                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                                                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-5 w-5 mr-2 text-blue-600"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                                                        />
                                                                    </svg>
                                                                    Detail Pesanan
                                                                </h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                                                        <span className="text-gray-600">ID Pesanan:</span>
                                                                        <span className="text-gray-900 font-medium">#{order.id}</span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                                                        <span className="text-gray-600">Ukuran:</span>
                                                                        <span className="text-gray-900 font-medium">{order.size}</span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                                                        <span className="text-gray-600">Jumlah:</span>
                                                                        <span className="text-gray-900 font-medium">{order.quantity}</span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                                                        <span className="text-gray-600">Metode Pembayaran:</span>
                                                                        <span className="text-gray-900 font-medium">{order.payment_method}</span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                                                        <span className="text-gray-600">Harga Satuan:</span>
                                                                        <span className="text-gray-900 font-medium">{formatPrice(productPrice)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                                                        <span className="text-gray-600">Kode Bukti:</span>
                                                                        <span className="text-gray-900 font-medium">
                                                                            {order.bukti_pemesanan || "Belum diunggah"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                                                        <span className="text-gray-600">No. M-Banking (Mandiri):</span>
                                                                        <span className="text-gray-900 font-medium">1234-5678-9012-3456</span>
                                                                    </div>
                                                                    <div className="flex justify-between py-1 mt-2">
                                                                        <span className="text-gray-800 font-medium">Total:</span>
                                                                        <span className="text-blue-600 font-bold">{formatPrice(totalPrice)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4">
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Masukkan Kode Bukti Pemesanan
                                                                    </label>
                                                                    <div className="flex space-x-2 mt-1">
                                                                        <input
                                                                            type="text"
                                                                            value={kodeBukti[order.id] || ""}
                                                                            onChange={(e) =>
                                                                                setKodeBukti((prev) => ({
                                                                                    ...prev,
                                                                                    [order.id]: e.target.value,
                                                                                }))
                                                                            }
                                                                            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            placeholder="Contoh: ABC123XYZ"
                                                                        />
                                                                        <motion.button
                                                                            whileHover={{ scale: 1.03 }}
                                                                            whileTap={{ scale: 0.98 }}
                                                                            onClick={() => uploadKodeBukti(order.id)}
                                                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                                        >
                                                                            Unggah
                                                                        </motion.button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                                                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-5 w-5 mr-2 text-blue-600"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                                        />
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                        />
                                                                    </svg>
                                                                    Informasi Pengiriman
                                                                </h4>
                                                                <div className="space-y-3 text-sm">
                                                                    <div className="flex items-start rounded-md p-3 bg-gray-50">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="h-5 w-5 mr-2 text-gray-500 mt-0.5"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                                            />
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                            />
                                                                        </svg>
                                                                        <span className="text-gray-700">{order.alamat}</span>
                                                                    </div>
                                                                    <div className="flex items-center rounded-md p-3 bg-gray-50">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="h-5 w-5 mr-2 text-gray-500"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                                            />
                                                                        </svg>
                                                                        <span className="text-gray-700">{order.no_hp}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-6 flex justify-center sm:justify-end space-x-3">
                                                            <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 mr-1"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    />
                                                                </svg>
                                                                Bantuan
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 mr-1"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                                    />
                                                                </svg>
                                                                Pesan Lagi
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>
            </div>
            <Footer />
        </main>
    );
};

export default OrderHistory;