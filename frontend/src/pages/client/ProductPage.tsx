import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import { ShoppingCart, Heart, Filter, ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
    id: string;
    gambar: string;
    gmbr: string;
    nama_barang: string;
    harga: number;
    stok: number;
}

interface Category {
    id: string;
    name: string;
}

declare global {
    interface Window {
        showToast: (message: string, type: string) => void;
    }
}

const LoadingIndicator = () => (
    <div className="flex flex-col justify-center items-center h-64 mt-32">
        <div className="relative flex justify-center items-center">
            <div className="absolute animate-spin rounded-full h-44 w-44 border-t-4 border-b-4 border-purple-500"></div>
            <img
                src="https://i.pinimg.com/236x/80/26/c8/8026c8c2339822b65f0237a6a849473e.jpg"
                alt="Loading Indicator"
                className="rounded-full h-38 w-38"
            />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold uppercase bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 
                   text-transparent bg-clip-text drop-shadow-lg animate-pulse">
            HAHAHA NUNGGUIN YA!
        </h1>
    </div>
);

type ToastType = "success" | "error" | "warning" | "info";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const navigate = useNavigate();

    const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        const userLogin = localStorage.getItem("userLogin");

        if (!userLogin) {
            window.showToast("Silakan login terlebih dahulu!", "warning");
            return;
        }

        setIsAddingToCart(true);
        const id_user = JSON.parse(userLogin).id;
        const id_barang = product.id;
        const jumlah_barang = 1;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/addcart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id_user, id_barang, jumlah_barang }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                window.showToast("Produk berhasil ditambahkan ke keranjang!", "success");
            } else {
                const errorData = await response.json();
                window.showToast(`Gagal menambahkan ke keranjang: ${errorData.error}`, "error");
            }
        } catch (error) {
            console.error("Error:", error);
            window.showToast("Terjadi kesalahan, coba lagi nanti!", "error");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        window.showToast(isFavorite ? "Removed from favorites" : "Added to favorites", "info");
    };

    const handleCardClick = () => {
        if (product.stok > 0) {
            navigate(`/user/selected/${product.id}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={product.stok > 0 ? { y: -5 } : {}}
            onClick={handleCardClick}
            onMouseEnter={() => product.stok > 0 && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative
                group ${product.stok > 0 ? 'cursor-pointer hover:border-green-500' : 'cursor-not-allowed opacity-80'} 
                border border-transparent`}
        >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            
            {/* Favorite Button */}
            <button
                onClick={toggleFavorite}
                className={`absolute top-3 right-3 z-20 rounded-full p-2 
                        ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'} 
                        shadow-md transition-all duration-300 hover:scale-110`}
            >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
            
            {/* Product Image with Zoom Effect */}
            <div className="h-64 overflow-hidden">
                <img
                    src={isHovered ? product.gmbr : product.gambar}
                    alt={product.nama_barang}
                    className={`w-full h-full object-cover transition-transform duration-700 
                        ${product.stok > 0 ? 'group-hover:scale-110' : ''}`}
                />
            </div>
            
            {/* Product Info Overlay */}
            <div className="p-4 relative z-10">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {product.nama_barang}
                </h2>
                
                <div className="flex justify-between items-center mt-2">
                    <span className="text-green-500 dark:text-green-400 font-bold text-xl">
                        IDR {Number(product.harga).toLocaleString('id-ID')}
                    </span>
                    
                    {product.stok <= 5 && product.stok > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                            Stok: {product.stok}
                        </span>
                    )}
                    {product.stok === 0 && (
                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                            Sold Out
                        </span>
                    )}
                </div>
                
                {/* Add to Cart Button or Sold Out Button */}
                {product.stok === 0 ? (
                    <button 
                        className="w-full mt-3 py-2 rounded-lg flex items-center justify-center gap-2 
                            bg-gray-400 text-white cursor-not-allowed"
                        disabled
                    >
                        <X className="w-5 h-5" />
                        <span>Sold Out</span>
                    </button>
                ) : (
                    <button 
                        className={`w-full mt-3 py-2 rounded-lg flex items-center justify-center gap-2 
                            transition-all duration-300 transform hover:-translate-y-1
                            ${isAddingToCart ? 'bg-gray-400' : 'bg-black hover:bg-green-600'} text-white`}
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={isAddingToCart}
                    >
                        {isAddingToCart ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" />
                                <span>Add to Cart</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

const Toast: React.FC<{ message: string; type: string; onClose: () => void }> = ({ message, type, onClose }) => {
    const bgColor = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500"
    }[type as ToastType] || "bg-gray-800";

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-5 right-5 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2`}
        >
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 hover:text-gray-200">
                <X size={18} />
            </button>
        </motion.div>
    );
};

const ProductPage: React.FC = () => {
    const [data, setData] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(8);
    const [showFilters, setShowFilters] = useState(false);
    const [sortOption, setSortOption] = useState("latest");
    const [activeCategory, setActiveCategory] = useState("all");
    const [toast, setToast] = useState<{ show: boolean; message: string; type: string }>({ 
        show: false, message: "", type: "" 
    });
    const searchRef = useRef<HTMLDivElement>(null);

    const categories: Category[] = [
        { id: "all", name: "All Products" },
        { id: "electronics", name: "Electronics" },
        { id: "clothing", name: "Clothing" },
        { id: "home", name: "Home & Kitchen" },
        { id: "beauty", name: "Beauty" }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setTimeout(() => setIsLoading(false), 800);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const showToast = (message: string, type: string) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    useEffect(() => {
        window.showToast = showToast;
        return () => {
            window.showToast = () => {};
        };
    }, []);

    const filteredDataProduct = data
        .filter((product) => product.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            switch (sortOption) {
                case "priceLow":
                    return a.harga - b.harga;
                case "priceHigh":
                    return b.harga - a.harga;
                default:
                    return 0;
            }
        });

    const totalPages = Math.ceil(filteredDataProduct.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredDataProduct.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 sm:px-6 py-8">
                <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-green-400 to-blue-500">
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="relative z-10 text-center py-16 px-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                            Discover Our Collection
                        </h1>
                        <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
                            Find the best products with amazing quality at competitive prices
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 lg:w-1/5">
                        <div className="sticky top-20">
                            <div className="md:hidden mb-4">
                                <button 
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="w-full flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow"
                                >
                                    <span className="flex items-center">
                                        <Filter size={18} className="mr-2" />
                                        Filters & Categories
                                    </span>
                                    <ChevronDown className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            <AnimatePresence>
                                {(showFilters || window.innerWidth >= 768) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                                    >
                                        <h3 className="text-lg font-semibold mb-3">Categories</h3>
                                        <ul className="space-y-2">
                                            {categories.map(category => (
                                                <li key={category.id}>
                                                    <button
                                                        onClick={() => setActiveCategory(category.id)}
                                                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                                                            activeCategory === category.id 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        {category.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        <h3 className="text-lg font-semibold mt-6 mb-3">Sort By</h3>
                                        <div className="space-y-2">
                                            {[
                                                { id: "latest", name: "Latest" },
                                                { id: "priceLow", name: "Price: Low to High" },
                                                { id: "priceHigh", name: "Price: High to Low" }
                                            ].map(option => (
                                                <div key={option.id} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id={option.id}
                                                        name="sortOption"
                                                        checked={sortOption === option.id}
                                                        onChange={() => setSortOption(option.id)}
                                                        className="w-4 h-4 text-green-600"
                                                    />
                                                    <label htmlFor={option.id} className="ml-2 text-gray-700 dark:text-gray-300">
                                                        {option.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="md:w-3/4 lg:w-4/5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
                                Our Products
                            </h2>

                            <div ref={searchRef} className="relative">
                                <div className={`flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg transition-all duration-300 ease-in-out ${isSearchOpen ? "w-64" : "w-12"}`}>
                                    <button
                                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                                        className="w-12 h-12 flex items-center justify-center text-gray-700 dark:text-gray-300"
                                    >
                                        <FaSearch className="text-xl" />
                                    </button>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={`bg-transparent text-gray-800 dark:text-gray-200 outline-none transition-all duration-300 ${isSearchOpen ? "w-full opacity-100 pr-4" : "w-0 opacity-0 pointer-events-none"}`}
                                        placeholder="Search products..."
                                    />
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <LoadingIndicator />
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredDataProduct.length)} of {filteredDataProduct.length} products
                                    </p>
                                    <div className="flex items-center">
                                        <label className="mr-2 text-gray-800 dark:text-gray-300 hidden sm:inline">
                                            Products per page:
                                        </label>
                                        <select
                                            value={productsPerPage}
                                            onChange={(e) => {
                                                setProductsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                                        >
                                            <option value="4">4</option>
                                            <option value="8">8</option>
                                            <option value="12">12</option>
                                            <option value="16">16</option>
                                        </select>
                                    </div>
                                </div>

                                {currentProducts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No products found</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mt-2">Try changing your search or filter criteria</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {currentProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                )}

                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-8">
                                        <div className="inline-flex rounded-md shadow">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                className="inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter(page => 
                                                    page === 1 || 
                                                    page === totalPages || 
                                                    Math.abs(page - currentPage) <= 1
                                                )
                                                .map((page, index, array) => {
                                                    if (index > 0 && page - array[index - 1] > 1) {
                                                        return (
                                                            <span key={`ellipsis-${page}`} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 ${
                                                                currentPage === page 
                                                                ? 'bg-green-500 text-white border-green-500' 
                                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                })
                                            }
                                            
                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                className="inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <AnimatePresence>
                            {toast.show && (
                                <Toast 
                                    message={toast.message} 
                                    type={toast.type} 
                                    onClose={() => setToast({ ...toast, show: false })} 
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ProductPage;