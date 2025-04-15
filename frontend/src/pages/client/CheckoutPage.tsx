import React, { useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag, MapPin, Phone, CreditCard, AlertCircle, CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
    id_user: string;
    id_barang: number;
    gambar: string;
    jumlah_barang: number;
    size?: number;
    nama_barang?: string;
    harga?: number;
    nama_category?: string;
    stok?: number;
}

interface CheckoutForm {
    alamat: string;
    no_hp: string;
    payment_method: string;
    size: number;
}

const Checkout: React.FC = () => {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [step, setStep] = useState<number>(1); // 1: Review, 2: Shipping
    const [confirmCancel, setConfirmCancel] = useState<boolean>(false);
    console.log(data);

    const [form, setForm] = useState<CheckoutForm>({
        alamat: "",
        no_hp: "",
        payment_method: "DANA",
        size: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = localStorage.getItem("checkoutItems");
                if (response) {
                    const parsedData = JSON.parse(response);
                    setData(parsedData);
                    
                    // Set initial size from first item if available
                    if (parsedData.length > 0 && parsedData[0].size) {
                        setForm(prev => ({
                            ...prev,
                            size: parsedData[0].size || 0
                        }));
                    }
                }
            } catch (error) {
                console.log(error);
                setError("Gagal memuat data checkout");
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "size" ? parseInt(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Process each item in the cart
            for (const item of data) {
                const orderData = {
                    id_user: item.id_user,
                    id_barang: item.id_barang,
                    quantity: item.jumlah_barang,
                    size: form.size,
                    alamat: form.alamat,
                    paymentMethod: form.payment_method,
                    no_hp: form.no_hp,
                };

                // Use the correct endpoint for pemesanan
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pemesanan`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    throw new Error("Gagal membuat pemesanan. Silakan coba lagi.");
                } else {
                    const responseData = await response.json();
                    if (!responseData) {
                        throw new Error("Gagal membuat pemesanan. Silakan coba lagi.");
                    }
                }
            }

            // Clear checkout items from localStorage
            localStorage.removeItem("checkoutItems");
            setData([]);
            setSuccess("Pemesanan berhasil dibuat!");
            window.scrollTo(0, 0);

            // Reset form
            setForm({
                alamat: "",
                no_hp: "",
                payment_method: "DANA",
                size: 0,
            });
        } catch (err) {
            setError("Gagal membuat pemesanan. Silakan coba lagi.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = () => {
        // Clear checkout items
        localStorage.removeItem("checkoutItems");
        setData([]);
        setConfirmCancel(false);
        setSuccess("Pemesanan dibatalkan");
        // Redirect to home or product page after cancellation
        setTimeout(() => {
            navigate("/user/products");
        }, 2000);
    };

    const calculateTotal = () => {
        return data.reduce((total, item) => {
            return total + (item.harga || 0) * item.jumlah_barang;
        }, 0);
    };

    const navigate = useNavigate();

    if (success) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-3xl">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                        <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">{success}</h1>
                    <p className="mb-8 text-gray-600">Terima kasih telah berbelanja dengan kami. Kami akan segera memproses pesanan Anda.</p>
                    <button onClick={() => navigate("/user/products")} className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200 ease-in-out">
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold flex items-center">
                    <ShoppingBag className="mr-2" />
                    Checkout
                </h1>
                <button onClick={() => {
                    localStorage.removeItem("checkoutItems");
                    setData([]);
                    navigate(-1);
                }} className="text-blue-600 hover:underline flex items-center">
                    <ArrowLeft size={16} className="mr-1" />
                    Kembali ke Keranjang
                </button>
            </div>

            {confirmCancel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Konfirmasi Pembatalan</h3>
                            <button 
                                onClick={() => setConfirmCancel(false)} 
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="mb-6">Apakah Anda yakin ingin membatalkan pemesanan ini? Semua item akan dihapus.</p>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => setConfirmCancel(false)}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleCancelOrder}
                                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Ya, Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {data.length === 0 && !loading && !success ? (
                <div className="bg-yellow-50 p-6 rounded-lg shadow text-center">
                    <div className="flex justify-center mb-4">
                        <AlertCircle size={32} className="text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Tidak ada item untuk checkout</h2>
                    <p className="text-gray-600 mb-6">Silakan tambahkan produk ke keranjang terlebih dahulu.</p>
                    <a href="/user/products" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200 ease-in-out">
                        Lihat Produk
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                            <div className="flex p-4 border-b bg-gray-50">
                                <div className="w-full flex justify-between">
                                    <button 
                                        onClick={() => setStep(1)} 
                                        className={`font-medium px-4 py-2 rounded-lg ${step === 1 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        1. Ringkasan Pesanan
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (data.length > 0) {
                                                setStep(2);
                                            }
                                        }} 
                                        className={`font-medium px-4 py-2 rounded-lg ${step === 2 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        2. Pengiriman & Pembayaran
                                    </button>
                                </div>
                            </div>
                            
                            {step === 1 && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                                        <ShoppingBag size={20} className="mr-2" />
                                        Daftar Produk
                                    </h2>
                                    
                                    {data.map((item, index) => (
                                        <div key={index} className="border-b py-4 last:border-0 hover:bg-gray-50 transition-colors p-4 rounded-lg">
                                            <div className="flex flex-wrap md:flex-nowrap items-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4 flex items-center justify-center">
                                                    <img src={item.gambar || 'https://via.placeholder.com/150'} alt="" />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="font-medium">{item.nama_barang || `Produk #${item.id_barang}`}</p>
                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        <div className="text-gray-600">
                                                            <span>ID: </span>
                                                            <span className="font-medium">{item.id_barang}</span>
                                                        </div>
                                                        <div className="text-gray-600">
                                                            <span>Jumlah: </span>
                                                            <span className="font-medium">{item.jumlah_barang}</span>
                                                        </div>
                                                        {item.harga && (
                                                            <div className="text-gray-600">
                                                                <span>Harga: </span>
                                                                <span className="font-medium">Rp {(item.harga).toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                        <div className="text-gray-600">
                                                            <span>Subtotal: </span>
                                                            <span className="font-medium">
                                                                {item.harga 
                                                                    ? `Rp ${(item.harga * item.jumlah_barang).toLocaleString()}`
                                                                    : '-'
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="flex justify-between items-center mt-6">
                                        <button 
                                            onClick={() => setConfirmCancel(true)}
                                            className="px-4 py-2 text-red-600 hover:text-red-700 flex items-center"
                                        >
                                            <X size={16} className="mr-1" />
                                            Batalkan Pemesanan
                                        </button>
                                        
                                        <button 
                                            onClick={() => {
                                                if (data.length > 0) {
                                                    setStep(2);
                                                    window.scrollTo(0, 0);
                                                }
                                            }}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            Lanjut ke Pengiriman
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {step === 2 && (
                                <div className="p-6">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-6">
                                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                                <MapPin size={20} className="mr-2" />
                                                Informasi Pengiriman
                                            </h2>
                                            
                                            <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
                                                <div className="mb-4">
                                                    <label htmlFor="size" className="block mb-2 font-medium text-gray-700">
                                                        Ukuran
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="size"
                                                        name="size"
                                                        value={form.size}
                                                        onChange={handleInputChange}
                                                        min="1"
                                                        required
                                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                        placeholder="Masukkan ukuran"
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="alamat" className="block mb-2 font-medium text-gray-700">
                                                        Alamat Lengkap
                                                    </label>
                                                    <textarea
                                                        id="alamat"
                                                        name="alamat"
                                                        value={form.alamat}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                        rows={3}
                                                        placeholder="Masukkan alamat lengkap untuk pengiriman"
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="no_hp" className="block mb-2 font-medium text-gray-700">
                                                        <div className="flex items-center">
                                                            <Phone size={16} className="mr-2" />
                                                            Nomor HP
                                                        </div>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="no_hp"
                                                        name="no_hp"
                                                        value={form.no_hp}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                        pattern="[0-9]+"
                                                        maxLength={15}
                                                        placeholder="Contoh: 08123456789"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                                <CreditCard size={20} className="mr-2" />
                                                Metode Pembayaran
                                            </h2>
                                            
                                            <div className="bg-gray-50 p-4 rounded-lg border">
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['DANA', 'Mandiri', 'BRI', 'BCA'].map((method) => (
                                                        <div 
                                                            key={method}
                                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                                form.payment_method === method 
                                                                ? 'border-blue-500 bg-blue-50' 
                                                                : 'hover:border-gray-400'
                                                            }`}
                                                            onClick={() => setForm({...form, payment_method: method})}
                                                        >
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    id={`payment_${method}`}
                                                                    name="payment_method"
                                                                    checked={form.payment_method === method}
                                                                    onChange={() => setForm({...form, payment_method: method})}
                                                                    className="mr-2"
                                                                />
                                                                <label htmlFor={`payment_${method}`} className="font-medium">
                                                                    {method}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                                                <AlertCircle size={20} className="mr-2" />
                                                {error}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mt-6">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setStep(1);
                                                    window.scrollTo(0, 0);
                                                }}
                                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Kembali
                                            </button>
                                            
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                                                    loading 
                                                    ? "bg-gray-400 cursor-not-allowed" 
                                                    : "bg-blue-600 hover:bg-blue-700"
                                                }`}
                                            >
                                                {loading ? "Memproses..." : "Selesaikan Pemesanan"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Jumlah Item</span>
                                    <span className="font-medium">{data.reduce((sum, item) => sum + item.jumlah_barang, 0)}</span>
                                </div>
                                
                                {calculateTotal() > 0 && (
                                    <>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">Rp {calculateTotal().toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-600">Biaya Pengiriman</span>
                                            <span className="font-medium">Rp 18.000</span>
                                        </div>
                                        <div className="flex justify-between py-2 text-lg font-bold">
                                            <span>Total</span>
                                            <span>Rp {(calculateTotal() + 18000).toLocaleString()}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            {step === 1 && (
                                <button
                                    onClick={() => {
                                        if (data.length > 0) {
                                            setStep(2);
                                            window.scrollTo(0, 0);
                                        }
                                    }}
                                    disabled={data.length === 0}
                                    className={`w-full p-3 rounded-lg font-medium text-white ${
                                        data.length === 0 
                                        ? "bg-gray-400 cursor-not-allowed" 
                                        : "bg-blue-600 hover:bg-blue-700 transition-colors"
                                    }`}
                                >
                                    Lanjut ke Pengiriman
                                </button>
                            )}
                            
                            {step === 2 && (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`w-full p-3 rounded-lg font-medium text-white ${
                                        loading 
                                        ? "bg-gray-400 cursor-not-allowed" 
                                        : "bg-blue-600 hover:bg-blue-700 transition-colors"
                                    }`}
                                >
                                    {loading ? "Memproses..." : "Selesaikan Pemesanan"}
                                </button>
                            )}
                            
                            <div className="mt-4">
                                <button 
                                    onClick={() => setConfirmCancel(true)}
                                    className="w-full p-3 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg font-medium transition-colors"
                                >
                                    Batalkan Pemesanan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;