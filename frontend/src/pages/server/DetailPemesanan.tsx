import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { FaTimes, FaShoppingCart, FaImage } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBarAdmin from "../../components/SideBarAdmin";

interface ApprovedOrder {
  id: number;
  id_user: string; // UUID
  id_barang: number;
  quantity: number;
  size: string;
  alamat: string;
  no_hp: string;
  payment_method: string;
  total_harga: number;
  bukti_pemesanan?: string;
  created_at: string;
  updated_at: string;
  nama_barang: string;
  gambar: string;
}

const ApprovedOrdersController: React.FC = () => {
  const [orders, setOrders] = useState<ApprovedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ApprovedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprovedOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/detail-pemesanan`
        );
        if (!response.ok) throw new Error("Failed to fetch approved orders");
        const jsonData = await response.json();
        setOrders(jsonData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching approved orders:", error);
        toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchApprovedOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getPaymentMethodStyles = (method: string) => {
    switch (method.toLowerCase()) {
      case "dana":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "bri":
        return "bg-red-50 text-red-600 border-red-100";
      case "mandiri":
        return "bg-yellow-50 text-yellow-600 border-yellow-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 150, damping: 20 },
    },
    hover: {
      backgroundColor: "#f9fafb",
      transition: { duration: 0.2 },
    },
  };

  const cellVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.85, y: 50, transition: { duration: 0.3 } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.8, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      <SideBarAdmin />
      <div className="py-12 px-4 sm:px-6 lg:px-12">
        <ToastContainer />
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Approved Orders
          </h1>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <motion.div
                className="inline-block w-12 h-12 border-4 border-t-indigo-500 border-gray-200 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-gray-500">Loading approved orders...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-red-50 rounded-xl p-6"
            >
              <p className="text-lg text-red-600 font-medium">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg font-medium"
                onClick={() => window.location.reload()}
              >
                Retry
              </motion.button>
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl shadow-sm p-6"
            >
              <p className="text-gray-500 font-medium">No approved orders found</p>
            </motion.div>
          ) : (
            <motion.div
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
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
                      ].map((header) => (
                        <motion.th
                          key={header}
                          variants={cellVariants}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {header}
                        </motion.th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {orders.map((order) => (
                        <motion.tr
                          key={order.id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover="hover"
                          className="cursor-pointer"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <motion.td variants={cellVariants} className="px-6 py-4">
                            <motion.img
                              src={order.gambar || "https://via.placeholder.com/80"}
                              alt={order.nama_barang}
                              className="w-16 h-16 object-cover rounded-md"
                              whileHover={{ scale: 1.05 }}
                            />
                          </motion.td>
                          <motion.td
                            variants={cellVariants}
                            className="px-6 py-4 text-sm font-medium text-gray-800"
                          >
                            {order.nama_barang}
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
                            {order.alamat}
                          </motion.td>
                          <motion.td
                            variants={cellVariants}
                            className="px-6 py-4 text-sm text-gray-600"
                          >
                            {formatDate(order.created_at)}
                          </motion.td>
                          <motion.td
                            variants={cellVariants}
                            className="px-6 py-4 text-sm"
                          >
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPaymentMethodStyles(
                                order.payment_method
                              )}`}
                            >
                              {order.payment_method}
                            </span>
                          </motion.td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
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
                className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedOrder(null)}
              >
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedOrder(null)}
                  >
                    <FaTimes size={20} />
                  </motion.button>
                  <div className="flex items-center mb-4">
                    <FaShoppingCart className="text-indigo-500 mr-2" size={24} />
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Order #{selectedOrder.id}
                    </h2>
                  </div>
                  <div className="flex justify-center mb-6">
                    <img
                      src={selectedOrder.gambar || "https://via.placeholder.com/200"}
                      alt={selectedOrder.nama_barang}
                      className="w-48 h-48 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Product", value: selectedOrder.nama_barang },
                      { label: "Order ID", value: selectedOrder.id },
                      { label: "Quantity", value: selectedOrder.quantity },
                      { label: "Size", value: selectedOrder.size || "N/A" },
                      { label: "Total Price", value: formatCurrency(selectedOrder.total_harga) },
                      { label: "Address", value: selectedOrder.alamat },
                      { label: "Phone", value: selectedOrder.no_hp },
                      {
                        label: "Payment",
                        value: (
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPaymentMethodStyles(
                              selectedOrder.payment_method
                            )}`}
                          >
                            {selectedOrder.payment_method}
                          </span>
                        ),
                      },
                      { label: "Order Date", value: formatDate(selectedOrder.created_at) },
                      {
                        label: "Bukti Pemesanan",
                        value: selectedOrder.bukti_pemesanan ? (
                          selectedOrder.bukti_pemesanan.startsWith("http") ? (
                            <div className="flex flex-col items-start">
                              <a
                                href={selectedOrder.bukti_pemesanan}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-500 hover:text-indigo-700 flex items-center"
                              >
                                <FaImage className="mr-2" />
                                View Proof
                              </a>
                              <img
                                src={selectedOrder.bukti_pemesanan}
                                alt="Bukti Pemesanan"
                                className="mt-2 w-32 h-32 object-contain rounded-md"
                              />
                            </div>
                          ) : (
                            <span className="text-gray-600">{selectedOrder.bukti_pemesanan}</span>
                          )
                        ) : (
                          "None"
                        ),
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between border-b border-gray-100 py-2"
                      >
                        <span className="text-sm font-medium text-gray-500">{item.label}</span>
                        <span className="text-sm text-gray-800">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2 rounded-lg font-medium"
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

export default ApprovedOrdersController;