import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Interface sesuai dengan data
interface OrderDetailPageProps {
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
  name: string | null;
  gambar: string | null;
}

// Komponen untuk kartu pesanan
const OrderCard: React.FC<{ order: OrderDetailPageProps }> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Logika status pengiriman
  const createdDate = new Date(order.created_at);
  const currentDate = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const isDelivered = currentDate.getTime() - createdDate.getTime() >= oneDayInMs;
  const status = isDelivered ? "Selesai Dikirim" : "Dikirim";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-xl m-4 border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-center gap-6">
          <motion.img
            src={order.gambar || "/fallback-image.jpg"}
            alt={order.name || "Produk"}
            className="w-24 h-24 object-cover rounded-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            onError={(e) => (e.target.src = "/fallback-image.jpg")}
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">
              {order.name || "Nama Produk Tidak Tersedia"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Jumlah: {order.quantity}</p>
            <p className="text-sm text-gray-600">Ukuran: {order.size}</p>
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  status === "Selesai Dikirim"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2.5 rounded-lg font-medium"
        >
          {isOpen ? "Sembunyikan Detail" : "Lihat Detail"}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mt-6 text-gray-700 text-sm space-y-2"
            >
              <p>
                <strong>ID Pesanan:</strong> {order.id}
              </p>
              <p>
                <strong>Alamat:</strong> {order.alamat}
              </p>
              <p>
                <strong>No. HP:</strong> {order.no_hp}
              </p>
              <p>
                <strong>Metode Pembayaran:</strong> {order.payment_method}
              </p>
              <p>
                <strong>Tanggal Dibuat:</strong>{" "}
                {new Date(order.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>
                <strong>Tanggal Diperbarui:</strong>{" "}
                {new Date(order.updated_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const OrderDetailPage: React.FC = () => {
  const [data, setData] = useState<OrderDetailPageProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userLogin");
      const id = userId ? JSON.parse(userId).id : null;

      if (!id) {
        setError("Pengguna tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/detail-pemesanan/${id}`
        );
        if (!response.ok) throw new Error("Gagal mengambil data pesanan");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Header />

      <section className="flex-1 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold text-center text-gray-900 mb-10"
        >
          Riwayat Pemesanan
        </motion.h1>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
            />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="text-red-600 text-lg font-medium">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Coba Lagi
              </motion.button>
            </motion.div>
          ) : data.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-600 text-lg"
            >
              Belum ada pemesanan. Mulai belanja sekarang!
            </motion.p>
          ) : (
            data.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default OrderDetailPage;