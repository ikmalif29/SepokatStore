import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { FaTimes, FaShoppingCart, FaCheck, FaBan } from "react-icons/fa";
import SideBarAdmin from "../../components/SideBarAdmin";

interface Order {
  id: number;
  id_user: string;
  id_barang: number;
  quantity: number;
  size: string; // Diperbaiki dari number ke string sesuai backend
  alamat: string;
  no_hp: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  gambar: string;
  nama_barang?: string;
  harga?: number;
  total_harga?: number;
  bukti_pemesanan?: string;
  status: string; // Tambahkan status
}

const OrderHistoryController: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false); // State untuk loading saat approve/reject

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/history`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const jsonData = await response.json();
        setOrders(jsonData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Fungsi untuk menyetujui atau menolak pemesanan
  const handleApproveReject = async (orderId: number, status: "approved" | "rejected") => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/pemesanan/${orderId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${status} order`);
      }

      // Perbarui daftar orders
      if (status === "approved") {
        // Hapus order dari daftar karena sudah dipindah ke detail_pemesanan
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      } else {
        // Update status order di daftar
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      }

      // Update selectedOrder jika sedang ditampilkan
      if (selectedOrder && selectedOrder.id === orderId) {
        if (status === "approved") {
          setSelectedOrder(null); // Tutup modal karena order sudah dihapus
        } else {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }

      alert(`Order successfully ${status}`);
    } catch (error) {
      console.error(`Error ${status} order:`, error);
      alert(`Failed to ${status} order: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsApproving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm");
  };

  const formatCurrency = (amount?: number) => {
    return amount
      ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)
      : "N/A";
  };

  const getPaymentMethodStyles = (method: string) => {
    switch (method.toLowerCase()) {
      case "dana":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "bri":
        return "bg-red-100 text-red-800 border-red-200";
      case "mandiri":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
    hover: {
      scale: 1.01,
      backgroundColor: "rgba(249, 250, 251, 0.8)",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } },
  };

  const cellVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 100 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.7, y: 100, transition: { duration: 0.3 } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.75, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      <SideBarAdmin />
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center tracking-tight bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Order History
          </h1>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <motion.div
                className="inline-block w-16 h-16 border-4 border-t-indigo-600 border-gray-200 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-lg text-gray-600">Loading orders...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-red-50 rounded-lg p-6"
            >
              <p className="text-lg text-red-600">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg"
                onClick={() => window.location.reload()}
              >
                Retry
              </motion.button>
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-gray-50 rounded-lg p-6"
            >
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-lg text-gray-600"
              >
                No orders found
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className="overflow-x-auto shadow-xl rounded-xl bg-gradient-to-b from-white to-gray-50"
            >
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    {[
                      "Image",
                      "Product",
                      "Order ID",
                      "Quantity",
                      "Size",
                      "Total",
                      "Address",
                      "Date",
                      "Payment",
                      "Status", // Tambahkan kolom status
                    ].map((header, index) => (
                      <motion.th
                        key={index}
                        variants={cellVariants}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                      >
                        {header}
                      </motion.th>
                    ))}
                  </tr>
                </thead>
                <tbody Retrieved from the API response className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {orders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover="hover"
                        className={`cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <motion.td
                          variants={cellVariants}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          <motion.img
                            src={order.gambar || "https://via.placeholder.com/80"}
                            alt={order.nama_barang}
                            className="w-20 h-20 object-contain rounded-lg shadow-md"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                          />
                        </motion.td>
                        <motion.td
                          variants={cellVariants}
                          className="px-6 py-4 text-sm font-semibold text-gray-900"
                        >
                          {order.nama_barang || "Product"}
                        </motion.td>
                        <motion.td
                          variants={cellVariants}
                          className="px-6 py-4 text-sm text-gray-600"
                        >
                          {order.id}
                        </motion.td>
                        <motion.td
                          variants={cellVariants}
                          className="px-6 py-4 text-sm text-gray-600"
                        >
                          {order.quantity}
                        </motion.td>
                        <motion.td
                          variants={cellVariants}
                          className="px-6 py-4 text-sm text-gray-600"
                        >
                          {order.size || "N/A"}
                        </motion.td>
                        <motion.td
                          variants={cellVariants}
                          className="px-6 py-4 text-sm text-gray-600"
                        >
                          {formatCurrency(order.total_harga)}
                        </motion.td>
                        <motion.td
                          variants={cellVariants}
                          className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                          title={order.alamat}
                        >
                          {order.alamat || "N/A"}
                        </motion.td>
                        <motion.td
                          variants={cellVariants}
                          className="px-6 py-4 text-sm text-gray-600"
                        >
                          {formatDate(order.created_at)}
                        </motion.td>
                        <motion.td
                          variants={cellVariants}
                          className="px-6 py-4 text-sm text-gray-600"
                        >
                          <motion.span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPaymentMethodStyles(
                              order.payment_method
                            )}`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {order.payment_method}
                          </motion.span>
                        </motion.td>
                        <motion.td
                          variants={cellVariants}
                          className="px-6 py-4 text-sm text-gray-600"
                        >
                          <motion.span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                              order.status
                            )}`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {order.status}
                          </motion.span>
                        </motion.td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          )}

          {/* Modal for order details */}
          <AnimatePresence>
            {selectedOrder && (
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedOrder(null)}
              >
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-gray-100 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedOrder(null)}
                  >
                    <FaTimes size={24} />
                  </motion.button>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center mb-6"
                  >
                    <FaShoppingCart className="text-indigo-600 mr-3" size={28} />
                    <h2 className="text-3xl font-bold text-gray-900 text-center">
                      Order #{selectedOrder.id}
                    </h2>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex justify-center mb-6"
                  >
                    <img
                      src={selectedOrder.gambar || "https://via.placeholder.com/300"}
                      alt={selectedOrder.nama_barang}
                      className="w-64 h-64 object-contain rounded-xl shadow-lg"
                    />
                  </motion.div>
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={tableVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {[
                      { label: "Product", value: selectedOrder.nama_barang || "N/A" },
                      { label: "Order ID", value: selectedOrder.id },
                      { label: "Quantity", value: selectedOrder.quantity },
                      { label: "Size", value: selectedOrder.size || "N/A" },
                      { label: "Total Price", value: formatCurrency(selectedOrder.total_harga) },
                      { label: "Address", value: selectedOrder.alamat || "N/A" },
                      { label: "Phone", value: selectedOrder.no_hp || "N/A" },
                      {
                        label: "Payment",
                        value: (
                          <span
                            className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${getPaymentMethodStyles(
                              selectedOrder.payment_method
                            )}`}
                          >
                            {selectedOrder.payment_method}
                          </span>
                        ),
                      },
                      { label: "Order Date", value: formatDate(selectedOrder.created_at) },
                      {
                        label: "Status",
                        value: (
                          <span
                            className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusStyles(
                              selectedOrder.status
                            )}`}
                          >
                            {selectedOrder.status}
                          </span>
                        ),
                      },
                      {
                        label: "Bukti Pemesanan",
                        value: selectedOrder.bukti_pemesanan ? (
                          selectedOrder.bukti_pemesanan.startsWith("http") ? (
                            <a
                              href={selectedOrder.bukti_pemesanan}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              Lihat Bukti
                            </a>
                          ) : (
                            selectedOrder.bukti_pemesanan
                          )
                        ) : (
                          "Tidak ada"
                        ),
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        variants={cellVariants}
                        className="flex flex-col"
                      >
                        <span className="text-sm font-semibold text-gray-500 uppercase">
                          {item.label}
                        </span>
                        <span className="text-base text-gray-900">{item.value}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Tombol Approve/Reject hanya muncul jika status adalah pending */}
                  {selectedOrder.status === "pending" && (
                    <motion.div
                      className="mt-8 flex justify-between gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 bg-green-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-lg flex items-center justify-center ${isApproving ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        onClick={() => handleApproveReject(selectedOrder.id, "approved")}
                        disabled={isApproving}
                      >
                        <FaCheck className="mr-2" />
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 bg-red-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-lg flex items-center justify-center ${isApproving ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        onClick={() => handleApproveReject(selectedOrder.id, "rejected")}
                        disabled={isApproving}
                      >
                        <FaBan className="mr-2" />
                        Reject
                      </motion.button>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-lg"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
};

export default OrderHistoryController;