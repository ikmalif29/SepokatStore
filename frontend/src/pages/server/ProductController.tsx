import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDollarSign, FaWarehouse, FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import SideBarAdmin from "../../components/SideBarAdmin";

interface Product {
    id: string;
    gambar: string;
    gmbr: string;
    nama_barang: string;
    harga: number | string;
    stok: number;
    id_category?: string;
}

const ProductController: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [newProduct, setNewProduct] = useState({
        nama_barang: "",
        harga: 0,
        id_category: "",
        stok: 0,
        image: "",
        image_2: "",
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoaded(false);
                setError(null); // Reset error sebelum fetch
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.statusText}`);
                }
                const data = await response.json();
                const formattedData = Array.isArray(data)
                    ? data.map((product: Product) => ({
                          ...product,
                          harga: typeof product.harga === "string" ? parseFloat(product.harga) || 0 : product.harga || 0,
                          id_category: product.id_category || "",
                          gambar: product.gambar || "",
                          gmbr: product.gmbr || "",
                      }))
                    : [];
                setProducts(formattedData);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
                setError(errorMessage);
                console.error("Error fetching products:", err);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error(`Failed to delete product: ${response.statusText}`);
                }
                setProducts(products.filter((product) => product.id !== id));
                setIsDetailModalOpen(false); // Tutup popup jika produk dihapus
                setSelectedProduct(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An error occurred while deleting";
                setError(errorMessage);
                console.error("Error deleting product:", err);
            }
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct({
            ...product,
            id_category: product.id_category || "",
            harga: Number(product.harga) || 0,
            gambar: product.gambar || "",
            gmbr: product.gmbr || "",
        });
        setIsEditModalOpen(true);
        setIsDetailModalOpen(false); // Tutup popup detail saat edit
    };

    const handleViewDetails = (product: Product) => {
        setSelectedProduct({
            ...product,
            id_category: product.id_category || "",
            harga: Number(product.harga) || 0,
            gambar: product.gambar || "",
            gmbr: product.gmbr || "",
        });
        setIsDetailModalOpen(true);
    };

    const handleUpdateProduct = async (updatedProduct: Product) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${updatedProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nama_barang: updatedProduct.nama_barang,
                    harga: updatedProduct.harga,
                    id_category: updatedProduct.id_category,
                    stok: updatedProduct.stok,
                    image: updatedProduct.gambar,
                    image_2: updatedProduct.gmbr,
                }),
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = "Failed to update product";
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } else {
                    errorMessage = `Server returned ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const updatedData = await response.json();
            setProducts(
                products.map((product) =>
                    product.id === updatedData.id
                        ? {
                              ...updatedData,
                              harga: Number(updatedData.harga) || 0,
                              gambar: updatedData.gambar || updatedData.image || "",
                              gmbr: updatedData.gmbr || updatedData.image_2 || "",
                              id_category: updatedData.id_category || "",
                          }
                        : product
                )
            );
            setIsEditModalOpen(false);
            setSelectedProduct(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred while updating";
            setError(errorMessage);
            console.error("Error updating product:", err);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nama_barang: newProduct.nama_barang,
                    harga: newProduct.harga,
                    id_category: newProduct.id_category,
                    stok: newProduct.stok,
                    image: newProduct.image,
                    image_2: newProduct.image_2,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to add product: ${response.statusText}`);
            }
            const addedProduct = await response.json();
            setProducts([
                {
                    ...addedProduct,
                    harga: Number(addedProduct.harga) || 0,
                    gambar: addedProduct.gambar || addedProduct.image || "",
                    gmbr: addedProduct.gmbr || addedProduct.image_2 || "",
                    id_category: addedProduct.id_category || "",
                },
                ...products,
            ]);
            setIsAddModalOpen(false);
            setNewProduct({
                nama_barang: "",
                harga: 0,
                id_category: "",
                stok: 0,
                image: "",
                image_2: "",
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred while adding";
            setError(errorMessage);
            console.error("Error adding product:", err);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
        hover: {
            scale: 1.05,
            boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)",
            transition: { type: "spring", stiffness: 300, damping: 10 },
        },
        exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
        hover: {
            scale: 1.02,
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            transition: { type: "spring", stiffness: 300, damping: 10 },
        },
        exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
    };

    const dropIn = {
        hidden: { y: "-100vh", opacity: 0 },
        visible: { y: "0", opacity: 1, transition: { duration: 0.1, type: "spring", damping: 25, stiffness: 400 } },
        exit: { y: "100vh", opacity: 0, transition: { duration: 0.3 } },
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.3 } },
        tap: { scale: 0.95, transition: { duration: 0.1 } },
    };

    const iconVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.2, rotate: 5, transition: { duration: 0.3, type: "spring" } },
    };

    const formatPrice = (harga: number | string | undefined): string => {
        if (typeof harga === "number" && !isNaN(harga)) {
            return harga.toFixed(2);
        }
        if (typeof harga === "string") {
            const parsed = parseFloat(harga);
            return isNaN(parsed) ? "0.00" : parsed.toFixed(2);
        }
        return "0.00";
    };

    return (
        <main className="bg-white text-black min-h-screen overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-hidden relative">
                <motion.div
                    className="container mx-auto relative z-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={headerVariants} className="text-center mb-10 relative">
                        <motion.h1
                            className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight"
                            initial={{ letterSpacing: "0px" }}
                            animate={{ letterSpacing: "2px" }}
                            transition={{ duration: 1 }}
                        >
                            PRODUCT MANAGEMENT
                        </motion.h1>
                        <motion.p
                            className="text-gray-600 max-w-md sm:max-w-lg mx-auto text-sm sm:text-base"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            Manage your product list efficiently and effectively.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="relative w-full sm:w-auto sm:flex-1">
                            <motion.input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 pr-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                whileFocus={{ boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.3)" }}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto justify-end">
                            <motion.button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg ${
                                    viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                                } transition-colors`}
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonVariants}
                            >
                                Grid
                            </motion.button>
                            <motion.button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg ${
                                    viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                                } transition-colors`}
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonVariants}
                            >
                                List
                            </motion.button>
                            <motion.button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonVariants}
                            >
                                <motion.div variants={iconVariants}>
                                    <FaPlus />
                                </motion.div>
                                Add
                            </motion.button>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {viewMode === "grid" ? (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                key="grid-view"
                            >
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        className="relative bg-white shadow-md rounded-2xl p-6 border border-gray-200 overflow-hidden group hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        layout
                                        custom={index}
                                        onClick={() => handleViewDetails(product)}
                                    >
                                        <div className="flex items-center gap-6 mb-6">
                                            <motion.div
                                                className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <img
                                                    src={product.gambar || product.gmbr || "https://via.placeholder.com/128"}
                                                    alt={product.nama_barang}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "https://via.placeholder.com/128";
                                                    }}
                                                />
                                            </motion.div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                                    {product.nama_barang}
                                                </h2>
                                                <p className="text-sm text-gray-600">ID: {product.id}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 text-lg">
                                            <motion.div
                                                className="flex items-center gap-3 text-gray-700"
                                                whileHover={{ x: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <motion.div
                                                    className="text-green-600 w-6 h-6 flex items-center justify-center"
                                                    whileHover={{ rotate: 15, scale: 1.2 }}
                                                >
                                                    <FaDollarSign className="w-5 h-5" />
                                                </motion.div>
                                                <span className="font-semibold">${formatPrice(product.harga)}</span>
                                            </motion.div>
                                            <motion.div
                                                className="flex items-center gap-3 text-gray-700"
                                                whileHover={{ x: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <motion.div
                                                    className="text-blue-600 w-6 h-6 flex items-center justify-center"
                                                    whileHover={{ rotate: -15, scale: 1.2 }}
                                                >
                                                    <FaWarehouse className="w-5 h-5" />
                                                </motion.div>
                                                <span className="font-semibold">{product.stok} units</span>
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            className="mt-8 flex gap-4"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(product);
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                <FaEdit /> Edit
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(product.id);
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                            >
                                                <FaTrash /> Delete
                                            </motion.button>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                className="space-y-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                key="list-view"
                            >
                                <motion.div className="bg-gray-100 rounded-lg shadow-sm">
                                    <div className="grid grid-cols-12 p-4 font-semibold text-gray-700 text-base">
                                        <div className="col-span-5 sm:col-span-6">PRODUCT</div>
                                        <div className="col-span-3 sm:col-span-2 text-center">PRICE</div>
                                        <div className="col-span-2 sm:col-span-2 text-center">STOCK</div>
                                        <div className="col-span-2 sm:col-span-2 text-center">ACTIONS</div>
                                    </div>
                                </motion.div>

                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        className="grid grid-cols-12 p-4 bg-white rounded-lg border border-gray-200 shadow-sm items-center hover:shadow-md transition-shadow duration-300 cursor-pointer"
                                        variants={listItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        layout
                                        custom={index}
                                        onClick={() => handleViewDetails(product)}
                                    >
                                        <div className="col-span-5 sm:col-span-6 flex items-center gap-4">
                                            <motion.div
                                                className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <img
                                                    src={product.gambar || product.gmbr || "https://via.placeholder.com/64"}
                                                    alt={product.nama_barang}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "https://via.placeholder.com/64";
                                                    }}
                                                />
                                            </motion.div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{product.nama_barang}</h3>
                                                <p className="text-sm text-gray-600">ID: {product.id}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-2 text-center text-green-600 font-semibold">
                                            ${formatPrice(product.harga)}
                                        </div>
                                        <div className="col-span-2 sm:col-span-2 text-center text-blue-600 font-semibold">
                                            {product.stok}
                                        </div>
                                        <div className="col-span-2 sm:col-span-2 flex gap-2 justify-center">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(product);
                                                }}
                                                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                <FaEdit />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(product.id);
                                                }}
                                                className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                            >
                                                <FaTrash />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        className="mt-8 text-center text-gray-600 p-4 border border-gray-200 rounded-lg bg-gray-100 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.6 } }}
                    >
                        <motion.p initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                            Showing {filteredProducts.length} of {products.length} Products
                        </motion.p>
                    </motion.div>
                </motion.div>

                {!isLoaded && (
                    <motion.div
                        className="fixed inset-0 flex justify-center items-center bg-white/80 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    >
                        <div className="text-center space-y-6">
                            <motion.div className="relative w-24 h-24 mx-auto">
                                <motion.div
                                    className="absolute inset-0 border-t-4 border-l-4 border-blue-600 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute inset-0 border-b-4 border-r-4 border-blue-400 rounded-full"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <p className="text-xl font-medium text-gray-900">Loading Products</p>
                                <p className="text-gray-600 mt-2">Please wait while we fetch your data</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        className="fixed inset-0 flex justify-center items-center bg-white/80 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-red-100 p-6 rounded-xl border border-red-300 text-center">
                            <p className="text-red-700 text-lg font-medium">{error}</p>
                            <motion.button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Retry
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {isAddModalOpen && (
                        <motion.div
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-2xl"
                                variants={dropIn}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                                    <button
                                        className="text-gray-500 hover:text-gray-800"
                                        onClick={() => {
                                            setIsAddModalOpen(false);
                                            setNewProduct({
                                                nama_barang: "",
                                                harga: 0,
                                                id_category: "",
                                                stok: 0,
                                                image: "",
                                                image_2: "",
                                            });
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleAddProduct} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-1 text-sm">Product Name</label>
                                        <input
                                            type="text"
                                            value={newProduct.nama_barang}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, nama_barang: e.target.value })
                                            }
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 mb-1 text-sm">Price</label>
                                            <input
                                                type="number"
                                                value={newProduct.harga}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        harga: parseFloat(e.target.value) || 0,
                                                    })
                                                }
                                                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1 text-sm">Stock</label>
                                            <input
                                                type="number"
                                                value={newProduct.stok}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        stok: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-1 text-sm">Category ID</label>
                                        <input
                                            type="text"
                                            value={newProduct.id_category}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, id_category: e.target.value })
                                            }
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-1 text-sm">Image URL 1</label>
                                        <input
                                            type="url"
                                            value={newProduct.image}
                                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-1 text-sm">Image URL 2</label>
                                        <input
                                            type="url"
                                            value={newProduct.image_2}
                                            onChange={(e) => setNewProduct({ ...newProduct, image_2: e.target.value })}
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <motion.button
                                            type="submit"
                                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            Save
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => {
                                                setIsAddModalOpen(false);
                                                setNewProduct({
                                                    nama_barang: "",
                                                    harga: 0,
                                                    id_category: "",
                                                    stok: 0,
                                                    image: "",
                                                    image_2: "",
                                                });
                                            }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}

                    {isEditModalOpen && selectedProduct && (
                        <motion.div
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-2xl"
                                variants={dropIn}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                                    <button
                                        className="text-gray-500 hover:text-gray-800"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setSelectedProduct(null);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleUpdateProduct(selectedProduct);
                                    }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-gray-700 mb-1 text-sm">Product Name</label>
                                        <input
                                            type="text"
                                            value={selectedProduct.nama_barang}
                                            onChange={(e) =>
                                                setSelectedProduct({
                                                    ...selectedProduct,
                                                    nama_barang: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 mb-1 text-sm">Price</label>
                                            <input
                                                type="number"
                                                value={selectedProduct.harga}
                                                onChange={(e) =>
                                                    setSelectedProduct({
                                                        ...selectedProduct,
                                                        harga: parseFloat(e.target.value) || 0,
                                                    })
                                                }
                                                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1 text-sm">Stock</label>
                                            <input
                                                type="number"
                                                value={selectedProduct.stok}
                                                onChange={(e) =>
                                                    setSelectedProduct({
                                                        ...selectedProduct,
                                                        stok: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-1 text-sm">Category ID</label>
                                        <input
                                            type="text"
                                            value={selectedProduct.id_category || ""}
                                            onChange={(e) =>
                                                setSelectedProduct({
                                                    ...selectedProduct,
                                                    id_category: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-1 text-sm">Image URL 1</label>
                                        <input
                                            type="url"
                                            value={selectedProduct.gambar}
                                            onChange={(e) =>
                                                setSelectedProduct({
                                                    ...selectedProduct,
                                                    gambar: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-1 text-sm">Image URL 2</label>
                                        <input
                                            type="url"
                                            value={selectedProduct.gmbr}
                                            onChange={(e) =>
                                                setSelectedProduct({
                                                    ...selectedProduct,
                                                    gmbr: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <motion.button
                                            type="submit"
                                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            Update
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => {
                                                setIsEditModalOpen(false);
                                                setSelectedProduct(null);
                                            }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}

                    {isDetailModalOpen && selectedProduct && (
                        <motion.div
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-lg shadow-2xl"
                                variants={dropIn}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                                    <button
                                        className="text-gray-500 hover:text-gray-800"
                                        onClick={() => {
                                            setIsDetailModalOpen(false);
                                            setSelectedProduct(null);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <img
                                                src={selectedProduct.gambar || "https://via.placeholder.com/200"}
                                                alt={selectedProduct.nama_barang}
                                                className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://via.placeholder.com/200";
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <img
                                                src={selectedProduct.gmbr || "https://via.placeholder.com/200"}
                                                alt={selectedProduct.nama_barang}
                                                className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://via.placeholder.com/200";
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-1 font-semibold">Product Name</label>
                                        <p className="text-gray-900 text-lg">{selectedProduct.nama_barang}</p>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-1 font-semibold">Price</label>
                                        <p className="text-gray-900 text-lg">${formatPrice(selectedProduct.harga)}</p>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-1 font-semibold">Stock</label>
                                        <p className="text-gray-900 text-lg">{selectedProduct.stok} units</p>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-1 font-semibold">Category ID</label>
                                        <p className="text-gray-900 text-lg">{selectedProduct.id_category || "N/A"}</p>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 mb-1 font-semibold">Product ID</label>
                                        <p className="text-gray-900 text-lg">{selectedProduct.id}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <motion.button
                                        onClick={() => {
                                            setIsDetailModalOpen(false);
                                            handleEdit(selectedProduct);
                                        }}
                                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Edit Product
                                    </motion.button>
                                    <motion.button
                                        onClick={() => {
                                            setIsDetailModalOpen(false);
                                            setSelectedProduct(null);
                                        }}
                                        className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Close
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
};

export default ProductController;