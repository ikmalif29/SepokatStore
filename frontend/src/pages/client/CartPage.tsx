import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer.tsx";
import { useNavigate } from "react-router-dom";

interface Product {
    id_user: string;
    id_barang: number;
    jumlah_barang: number;
    gambar: string;
    gmbr: string;
    created_at: string;
    updated_at: string;
    nama_barang?: string;
    harga?: number;
}

interface User {
    id: string;
    email: string;
    role: string;
}

export const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [userLogin, setUserLogin] = useState<User | null>(null);
    const [filteredCartItems, setFilteredCartItems] = useState<Product[]>([]);
    const [hoveredImage, setHoveredImage] = useState<{ [key: number]: string }>({});
    const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
    const [editQuantity, setEditQuantity] = useState<{ [key: number]: number }>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedProducts, setSelectedProducts] = useState<{ [key: number]: boolean }>({});
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        const fetchCartItems = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/getcart`);
                if (!response.ok) throw new Error("Gagal mengambil data keranjang");
                const data = await response.json();
                setCartItems(data);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchUserLogin = () => {
            try {
                const storedUser = localStorage.getItem("userLogin");
                if (storedUser) {
                    const data: User = JSON.parse(storedUser);
                    setUserLogin(data);
                }
            } catch (error) {
                console.error("Error fetching user login:", error);
            }
        };

        fetchUserLogin();
        fetchCartItems();
    }, []);

    useEffect(() => {
        if (userLogin) {
            const filteredItems = cartItems.filter((item) => item.id_user === userLogin.id);
            setFilteredCartItems(filteredItems);

            // Initialize edit quantities
            const quantities: { [key: number]: number } = {};
            filteredItems.forEach(item => {
                quantities[item.id_barang] = item.jumlah_barang;
            });

            setEditQuantity(quantities);
            
            // Initialize selected products (default none selected)
            const selected: { [key: number]: boolean } = {};
            filteredItems.forEach(item => {
                selected[item.id_barang] = false;
            });
            setSelectedProducts(selected);
        }
    }, [cartItems, userLogin]);
    
    // Effect baru untuk menghitung total harga saat produk dipilih
    useEffect(() => {
        let total = 0;
        filteredCartItems.forEach(item => {
            if (selectedProducts[item.id_barang] && item.harga) {
                total += item.harga * item.jumlah_barang;
            }
        });
        setTotalPrice(total);
    }, [filteredCartItems, selectedProducts]);

    const handleEditCart = async (id_barang: number, jumlah_barang: number) => {
        try {
            const user_id = userLogin?.id;
            if (!user_id) return;

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/cart/${user_id}/${id_barang}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ jumlah_barang }),
            });

            if (!response.ok) throw new Error("Gagal mengupdate jumlah barang");

            const updatedItem = await response.json();

            // Update the cart items in state
            const updatedCartItems = cartItems.map(item =>
                item.id_barang === id_barang ? { ...item, jumlah_barang } : item
            );

            setCartItems(updatedCartItems);

            // Turn off edit mode
            setEditMode(prev => ({ ...prev, [id_barang]: false }));
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const handleRemoveFromCart = async (id_barang: number) => {
        try {
            const id_user = userLogin?.id;
            if (!id_user) {
                alert("Anda harus login terlebih dahulu");
                return;
            }
    
            const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus produk ini dari keranjang?");
    
            if (isConfirmed) {
                alert("Produk berhasil dihapus dari keranjang!");
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/cart/${id_user}/${id_barang}`, {
                    method: "DELETE",
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Gagal menghapus produk dari keranjang");
                }
    
                const updatedCartItems = cartItems.filter((item) => !(item.id_barang === id_barang && item.id_user === id_user));
                setCartItems(updatedCartItems);
                
                // Hapus juga dari produk yang dipilih
                setSelectedProducts(prev => {
                    const updated = {...prev};
                    delete updated[id_barang];
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error removing product from cart:", error);
            alert("Gagal menghapus produk: " + error);
        }
    };

    const toggleEditMode = (id_barang: number) => {
        setEditMode(prev => ({
            ...prev,
            [id_barang]: !prev[id_barang]
        }));
    };

    const handleQuantityChange = (id_barang: number, value: number) => {
        // Ensure quantity is at least 1
        const quantity = Math.max(1, value);
        setEditQuantity(prev => ({
            ...prev,
            [id_barang]: quantity
        }));
    };
    
    // Fungsi baru untuk menangani seleksi produk
    const handleSelectProduct = (id_barang: number) => {
        setSelectedProducts(prev => ({
            ...prev,
            [id_barang]: !prev[id_barang]
        }));
    };
    
    // Fungsi untuk memilih/batalkan semua produk
    const toggleSelectAll = (select: boolean) => {
        const newSelectedProducts = {...selectedProducts};
        filteredCartItems.forEach(item => {
            newSelectedProducts[item.id_barang] = select;
        });
        setSelectedProducts(newSelectedProducts);
    };
    
    // Hitung jumlah produk yang dipilih
    const selectedProductCount = Object.values(selectedProducts).filter(Boolean).length;
    
    const navigate = useNavigate();
    // Fungsi baru untuk proses checkout
    const handleCheckout = () => {
        const selectedItems = filteredCartItems.filter(item => selectedProducts[item.id_barang]);
        if (selectedItems.length === 0) {
            alert("Silakan pilih produk yang ingin dicheckout");
            return;
        }
        
        // Di sini Anda dapat mengarahkan ke halaman checkout dengan membawa data produk terpilih
        alert(`Checkout ${selectedItems.length} produk dengan total Rp ${totalPrice.toLocaleString('id-ID')}`);
        
        // Simpan produk terpilih ke localStorage untuk digunakan di halaman checkout
        localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
        navigate("/user/checkout");
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Keranjang Belanja</h2>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredCartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <p className="text-xl text-gray-500 mb-4">Keranjang belanja kosong.</p>
                        <button 
                        onClick={() => navigate("/user/products")}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full transition duration-300 transform hover:scale-105">
                            Belanja Sekarang
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Select all section */}
                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 text-blue-500 focus:ring-blue-400 rounded"
                                    checked={filteredCartItems.length > 0 && selectedProductCount === filteredCartItems.length}
                                    onChange={(e) => toggleSelectAll(e.target.checked)}
                                />
                                <span className="ml-2 text-gray-700">Pilih Semua ({filteredCartItems.length} produk)</span>
                            </div>
                            {selectedProductCount > 0 && (
                                <button 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => toggleSelectAll(false)}
                                >
                                    Hapus Pilihan
                                </button>
                            )}
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 w-10"></th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Produk</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Harga</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Jumlah</th>
                                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Subtotal</th>
                                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredCartItems.map((product) => (
                                        <tr key={product.id_barang} className={selectedProducts[product.id_barang] ? "bg-blue-50" : ""}>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    className="h-5 w-5 text-blue-500 focus:ring-blue-400 rounded"
                                                    checked={!!selectedProducts[product.id_barang]}
                                                    onChange={() => handleSelectProduct(product.id_barang)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                        <img
                                                            src={hoveredImage[product.id_barang] || product.gambar}
                                                            alt={`Produk ${product.id_barang}`}
                                                            className="h-full w-full object-cover object-center cursor-pointer"
                                                            onMouseOver={() =>
                                                                setHoveredImage((prev) => ({ ...prev, [product.id_barang]: product.gmbr }))
                                                            }
                                                            onMouseOut={() =>
                                                                setHoveredImage((prev) => ({ ...prev, [product.id_barang]: product.gambar }))
                                                            }
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {product.nama_barang || `Produk #${product.id_barang}`}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {product.id_barang}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                {product.harga ? (
                                                    <div className="text-sm font-semibold text-gray-700">
                                                        Rp {product.harga.toLocaleString('id-ID')}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-500">-</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {editMode[product.id_barang] ? (
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            className="bg-gray-200 px-2 py-1 rounded-l"
                                                            onClick={() => handleQuantityChange(product.id_barang, editQuantity[product.id_barang] - 1)}
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={editQuantity[product.id_barang]}
                                                            onChange={(e) => handleQuantityChange(product.id_barang, parseInt(e.target.value) || 1)}
                                                            className="w-12 text-center border-y border-gray-200 py-1 focus:outline-none"
                                                        />
                                                        <button
                                                            className="bg-gray-200 px-2 py-1 rounded-r"
                                                            onClick={() => handleQuantityChange(product.id_barang, editQuantity[product.id_barang] + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-900">{product.jumlah_barang}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {product.harga ? (
                                                    <div className="text-sm font-bold text-gray-800">
                                                        Rp {(product.harga * product.jumlah_barang).toLocaleString('id-ID')}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-500">-</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                {editMode[product.id_barang] ? (
                                                    <div className="flex space-x-2 justify-end">
                                                        <button
                                                            onClick={() => handleEditCart(product.id_barang, editQuantity[product.id_barang])}
                                                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded transition duration-200"
                                                        >
                                                            Simpan
                                                        </button>
                                                        <button
                                                            onClick={() => toggleEditMode(product.id_barang)}
                                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded transition duration-200"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-2 justify-end">
                                                        <button
                                                            onClick={() => toggleEditMode(product.id_barang)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition duration-200"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveFromCart(product.id_barang)}
                                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-200"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Cart Summary */}
                        <div className="border-t border-gray-200 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-600">Total Barang: {filteredCartItems.length}</p>
                                    <p className="text-gray-600">Produk Dipilih: {selectedProductCount} item</p>
                                    <p className="text-gray-600">Total Quantity: {filteredCartItems.reduce((sum, item) => sum + item.jumlah_barang, 0)}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-xl font-bold text-gray-800 mb-4">
                                        Total: Rp {totalPrice.toLocaleString('id-ID')}
                                    </div>
                                    <div className="flex space-x-4">
                                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition duration-300">
                                            Lanjut Belanja
                                        </button>
                                        <button 
                                            className={`${selectedProductCount > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'} text-white py-2 px-4 rounded transition duration-300`}
                                            onClick={handleCheckout}
                                            disabled={selectedProductCount === 0}
                                        >
                                            Checkout ({selectedProductCount})
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
};

export default CartPage;