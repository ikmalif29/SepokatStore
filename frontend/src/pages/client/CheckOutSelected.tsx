import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Product {
    id_user: string;
    id: number;
    gambar: string;
    jumlah_barang: number;
    size?: number;
    nama_barang?: string;
    harga?: number;
    nama_category?: string;
    stok?: number;
}

interface CheckoutFormData {
    alamat: string;
    no_hp: string;
    paymentMethod: string;
}

interface UserLogin {
    id: string;
}

const CheckoutSelected: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<CheckoutFormData>({
        alamat: "",
        no_hp: "",
        paymentMethod: ""
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [user, setUser] = useState<UserLogin | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData = localStorage.getItem("selectedCheckoutItems");
                const userData = localStorage.getItem("userLogin");
                
                if (productData && userData) {
                    const parsedProduct = JSON.parse(productData);
                    const parsedUser = JSON.parse(userData);
                    
                    // Set user data
                    setUser(parsedUser);
                    
                    // Update product with id_user from userLogin
                    setProduct({
                        ...parsedProduct,
                        id_user: parsedUser.id // Use the id from userLogin
                    });
                } else if (productData) {
                    // If we have product but no user data
                    setProduct(JSON.parse(productData));
                    setMessage("Data pengguna tidak ditemukan");
                } else {
                    setMessage("Tidak ada produk yang dipilih");
                }
            } catch (error) {
                console.error("Error fetching checkout items:", error);
                setMessage("Gagal memuat data produk");
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!product) {
            setMessage("Tidak ada produk yang dipilih");
            return;
        }

        if (!formData.alamat.trim()) {
            setMessage("Alamat tidak boleh kosong");
            return;
        }

        if (!formData.no_hp.trim()) {
            setMessage("Nomor handphone tidak boleh kosong");
            return;
        }

        if (!formData.paymentMethod) {
            setMessage("Silakan pilih metode pembayaran");
            return;
        }

        if (!user?.id) {
            setMessage("Data pengguna tidak ditemukan. Silakan login kembali.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            // Ensure product ID exists
            if (!product.id) {
                throw new Error("Data produk tidak lengkap (id_barang tidak ditemukan)");
            }

            const orderData = {
                id_user: user.id, // Use id from user object
                id_barang: product.id,
                quantity: product.jumlah_barang,
                size: product.size || 0,
                alamat: formData.alamat,
                paymentMethod: formData.paymentMethod,
                no_hp: formData.no_hp
            };

            console.log("Mengirim data pesanan:", orderData);

            // Menggunakan fetch API sebagai pengganti axios
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pemesananSelected`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                }
            );
            
            const responseData = await response.json();
            
            if (response.status === 201) {
                setSuccess(true);
                setMessage("Pemesanan berhasil dibuat!");
                
                // Clear localStorage after successful order
                localStorage.removeItem("selectedCheckoutItems");
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = "/user/history";
                }, 2000);
            } else {
                throw new Error(responseData.message || "Terjadi kesalahan saat membuat pemesanan");
            }
        } catch (error: any) {
            console.error("Error submitting order:", error);
            setMessage(error.message || "Terjadi kesalahan saat membuat pemesanan");
        } finally {
            setLoading(false);
        }
    };

    if (!product) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="min-h-screen flex items-center justify-center bg-gray-50"
            >
                <motion.div 
                    className="text-center py-8 px-4 bg-white rounded-lg shadow-lg max-w-md w-full"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div 
                        className="text-red-500 text-6xl mb-4"
                        animate={{ rotateY: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    >
                        <i className="fas fa-shopping-cart"></i>
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-700 mb-2">Keranjang Kosong</h2>
                    <p className="text-gray-600 mb-4">Tidak ada produk yang dipilih untuk checkout</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/user/products")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    >
                        Belanja Sekarang
                    </motion.button>
                </motion.div>
            </motion.div>
        );
    }

    const paymentMethods = [
        { id: "DANA", name: "DANA", icon: "fa-wallet" },
        { id: "BRI", name: "Bank BRI", icon: "fa-university" },
        { id: "Mandiri", name: "Bank Mandiri", icon: "fa-university" },
        { id: "BCA", name: "Bank BCA", icon: "fa-credit-card" }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Checkout</h1>
                    <div className="w-16 h-1 bg-blue-600 mx-auto mb-8"></div>
                </motion.div>
                
                {/* Progress Indicator */}
                <div className="mb-10">
                    <div className="flex justify-between items-center">
                        <motion.div 
                            className="flex flex-col items-center"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                                <i className="fas fa-shopping-cart"></i>
                            </div>
                            <span className="text-sm mt-1 font-medium">Keranjang</span>
                        </motion.div>
                        <div className="flex-1 h-1 mx-2 bg-blue-200">
                            <motion.div 
                                className="h-full bg-blue-600" 
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            ></motion.div>
                        </div>
                        <motion.div 
                            className="flex flex-col items-center"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                                <i className="fas fa-address-card"></i>
                            </div>
                            <span className="text-sm mt-1 font-medium">Checkout</span>
                        </motion.div>
                        <div className="flex-1 h-1 mx-2 bg-gray-200">
                            <motion.div 
                                className="h-full bg-gray-200"
                                animate={success ? { backgroundColor: "#2563eb", width: "100%" } : {}}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            ></motion.div>
                        </div>
                        <motion.div 
                            className="flex flex-col items-center"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: success ? 1 : 0.9 }}
                            transition={{ delay: success ? 0.6 : 0 }}
                        >
                            <div className={`w-10 h-10 ${success ? "bg-blue-600" : "bg-gray-300"} text-white rounded-full flex items-center justify-center transition-colors duration-300`}>
                                <i className="fas fa-check"></i>
                            </div>
                            <span className="text-sm mt-1 font-medium">Selesai</span>
                        </motion.div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Product Info */}
                    <motion.div 
                        className="lg:col-span-1"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="bg-white p-6 rounded-xl shadow-lg overflow-hidden">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Ringkasan Pesanan</h2>
                            
                            <div className="flex flex-col">
                                {product.gambar && (
                                    <motion.div 
                                        className="relative w-full h-48 mb-4 overflow-hidden rounded-lg"
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img 
                                            src={product.gambar} 
                                            alt={product.nama_barang} 
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                )}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{product.nama_barang}</h3>
                                    <div className="flex justify-between text-gray-600">
                                        <span>ID Barang:</span>
                                        <span className="font-medium">{product.id}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>ID User:</span>
                                        <span className="font-medium">{user?.id || 'Tidak ditemukan'}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Kategori:</span>
                                        <span className="font-medium">{product.nama_category || 'Umum'}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Size:</span>
                                        <span className="font-medium">{product.size}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Jumlah:</span>
                                        <span className="font-medium">{product.jumlah_barang}</span>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-800 font-semibold">Subtotal:</span>
                                            <motion.span 
                                                className="text-lg font-bold text-blue-700"
                                                initial={{ scale: 1 }}
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 0.7, delay: 0.6 }}
                                            >
                                                Rp {product.harga ? (product.harga * product.jumlah_barang).toLocaleString('id-ID') : 0}
                                            </motion.span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Form */}
                    <motion.div 
                        className="lg:col-span-2"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Informasi Pengiriman</h2>
                            
                            {/* Alamat */}
                            <div className="mb-6">
                                <label htmlFor="alamat" className="block mb-2 font-medium text-gray-700">
                                    Alamat Lengkap
                                </label>
                                <motion.div
                                    whileFocus={{ scale: 1.01 }}
                                    className="relative"
                                >
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <textarea
                                        id="alamat"
                                        name="alamat"
                                        value={formData.alamat}
                                        onChange={handleInputChange}
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        rows={3}
                                        placeholder="Masukkan alamat lengkap untuk pengiriman"
                                        required
                                    />
                                </motion.div>
                            </div>
                            
                            {/* No HP */}
                            <div className="mb-6">
                                <label htmlFor="no_hp" className="block mb-2 font-medium text-gray-700">
                                    Nomor Handphone
                                </label>
                                <motion.div
                                    whileFocus={{ scale: 1.01 }}
                                    className="relative"
                                >
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <i className="fas fa-phone"></i>
                                    </div>
                                    <input
                                        type="tel"
                                        id="no_hp"
                                        name="no_hp"
                                        value={formData.no_hp}
                                        onChange={handleInputChange}
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        placeholder="contoh: 081234567890"
                                        required
                                    />
                                </motion.div>
                            </div>
                            
                            {/* Metode Pembayaran */}
                            <div className="mb-6">
                                <h3 className="block mb-4 font-medium text-gray-700">Metode Pembayaran</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {paymentMethods.map((method) => (
                                        <motion.div 
                                            key={method.id}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                                                formData.paymentMethod === method.id 
                                                ? "border-blue-500 bg-blue-50" 
                                                : "border-gray-200 hover:border-blue-300"
                                            }`}
                                            onClick={() => setFormData(prev => ({...prev, paymentMethod: method.id}))}
                                        >
                                            <input
                                                type="radio"
                                                id={method.id}
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={formData.paymentMethod === method.id}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                                required
                                            />
                                            <label htmlFor={method.id} className="flex items-center cursor-pointer">
                                                <div className={`w-5 h-5 mr-3 rounded-full border ${
                                                    formData.paymentMethod === method.id 
                                                    ? "border-blue-600" 
                                                    : "border-gray-400"
                                                } flex items-center justify-center`}>
                                                    {formData.paymentMethod === method.id && (
                                                        <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    <i className={`fas ${method.icon} mr-2 text-gray-600`}></i>
                                                    <span className="font-medium">{method.name}</span>
                                                </div>
                                            </label>
                                            {formData.paymentMethod === method.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-2 text-sm text-gray-600"
                                                >
                                                    Pembayaran melalui {method.name}
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            
                            {message && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-lg mb-6 ${
                                        message.includes("berhasil") 
                                        ? "bg-green-100 text-green-700 border border-green-200" 
                                        : "bg-red-100 text-red-700 border border-red-200"
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <i className={`fas ${message.includes("berhasil") ? "fa-check-circle" : "fa-exclamation-circle"} mr-2`}></i>
                                        {message}
                                    </div>
                                </motion.div>
                            )}
                            
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses Pesanan...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <i className="fas fa-shopping-cart mr-2"></i>
                                        Konfirmasi Pesanan
                                    </span>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default CheckoutSelected;