import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ShoppingBag, Ruler, Heart, ChevronRight, Truck, Award, RotateCcw } from "lucide-react";

interface Product {
    id: number;
    id_barang: number;
    nama_barang: string;
    harga: number;
    id_category: number;
    nama_category: string;
    gambar: string;
    gmbr: string;
}

interface CartItem extends Product {
    size: number;
    jumlah_barang: number;
}

const SelectedProductPage: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [showSizeChart, setShowSizeChart] = useState<boolean>(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [addedToWishlist, setAddedToWishlist] = useState<boolean>(false);
    // New state for related products
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const { id } = useParams();
    const navigate = useNavigate();
    console.log(product);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            setLoading(true);

            try {
                // Fetch selected product
                const productResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/selectedproduct/${id}`);
                if (!productResponse.ok) {
                    throw new Error("Failed to fetch product");
                }
                const jsonData: Product = await productResponse.json();
                setProduct(jsonData);
                setActiveImage(jsonData.gambar);

                // Fetch related products
                const relatedResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
                if (!relatedResponse.ok) {
                    throw new Error("Failed to fetch related products");
                }
                const relatedData: Product[] = await relatedResponse.json();
                // Filter out the current product and limit to 4 items
                const filteredRelated = relatedData
                    .filter((item) => item.id !== jsonData.id)
                    .slice(0, 4);
                setRelatedProducts(filteredRelated);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleBuy = (product: Product) => {
        const userData = localStorage.getItem("userLogin");

        if (!userData) {
            alert("Silakan login terlebih dahulu untuk melanjutkan checkout");
            setTimeout(() => navigate("/login"), 1500);
            return;
        }

        if (!selectedSize) {
            alert("Silakan pilih ukuran terlebih dahulu");
            return;
        }

        const cartItem: CartItem = {
            ...product,
            size: selectedSize,
            jumlah_barang: 1,
        };

        localStorage.setItem("selectedCheckoutItems", JSON.stringify(cartItem));

        navigate("/user/selectedCheckout");
        alert("Produk berhasil ditambahkan ke checkout");
    };

    // Loading state with skeleton
    if (loading)
        return (
            <main>
                <Header />
                <div className="flex flex-col lg:flex-row w-full justify-between gap-4 p-4">
                    <div className="w-full lg:w-1/4 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded mb-4 w-2/3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="space-y-2">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-3 bg-gray-200 rounded w-5/6"></div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full lg:w-2/4 flex justify-center">
                        <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="w-full lg:w-1/4 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                        <div className="h-12 bg-gray-200 rounded mt-4"></div>
                    </div>
                </div>
                {/* Skeleton for You Might Also Like */}
                <div className="container mx-auto p-4 md:p-6 lg:p-8">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-lg mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </main>
        );

    if (!product)
        return (
            <main>
                <Header />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold mb-2">Produk tidak ditemukan</h2>
                        <p className="text-gray-600 mb-4">Produk yang Anda cari tidak tersedia</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Lihat Produk Lainnya
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );

    return (
        <main className="min-h-screen flex flex-col">
            <Header />

            {/* Breadcrumb navigation */}
            <div className="bg-gray-50 py-3 px-4">
                <div className="container mx-auto">
                    <div className="flex items-center text-sm text-gray-600">
                        <p className="hover:text-black transition-colors">Home</p>
                        <ChevronRight size={16} className="mx-2" />
                        <p className="hover:text-black transition-colors">{product.nama_category}</p>
                        <ChevronRight size={16} className="mx-2" />
                        <span className="font-medium text-black">{product.nama_barang}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row w-full justify-between gap-8 p-4 md:p-6 lg:p-8 container mx-auto">
                {/* Product Details Column */}
                <div className="w-full lg:w-1/4 order-2 lg:order-1">
                    <div className="sticky top-8">
                        <h2 className="text-3xl font-bold mb-1 tracking-tight">{product.nama_barang}</h2>
                        <h3 className="text-gray-600 mb-3 inline-block px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {product.nama_category}
                        </h3>

                        <div className="mt-4 prose prose-sm text-gray-600 border-t border-b py-4">
                            <p className="leading-relaxed">
                                Aspiration meets dedication, forging the determination to reach the highest peaks in life. This concept is
                                designed to accompany that journey—both philosophically and functionally.
                            </p>
                        </div>

                        <div className="mt-4">
                            <div
                                className="flex items-center mb-2 cursor-pointer group"
                                onClick={() => setShowSizeChart((prev) => !prev)}
                            >
                                <Award size={18} className="mr-2 text-gray-600 group-hover:text-black transition-colors" />
                                <h4 className="font-medium group-hover:text-black transition-colors">Spesifikasi Produk</h4>
                                <ChevronRight
                                    size={18}
                                    className={`ml-auto transition-transform duration-300 ${showSizeChart ? "rotate-90" : ""}`}
                                />
                            </div>

                            <div className={`overflow-hidden transition-all duration-300 ${showSizeChart ? "max-h-96" : "max-h-0"}`}>
                                <ul className="text-sm list-disc pl-5 text-gray-600 space-y-1">
                                    <li>Low-cut</li>
                                    <li>Ripstop mesh Upper</li>
                                    <li>Mesh lining collar</li>
                                    <li>Inner collar webbing strap</li>
                                    <li>Side logo in nubuck</li>
                                    <li>Heel panel in nubuck with triangle print</li>
                                    <li>Embossed standing deer logo on the heel</li>
                                    <li>Cotton laces with stripe detail</li>
                                    <li>Custom woven label with hidden 4884 detail</li>
                                    <li>Ankle padding for comfort</li>
                                    <li>Rubber outsole</li>
                                    <li>Cementing construction</li>
                                    <li>Made in Indonesia</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-all cursor-pointer">
                                <Truck size={20} className="text-gray-600 mr-3 group-hover:text-black transition-colors" />
                                <div>
                                    <h4 className="font-medium text-sm">Pengiriman Gratis</h4>
                                    <p className="text-xs text-gray-500">Untuk pembelian di atas Rp 500.000</p>
                                </div>
                            </div>

                            <div className="flex items-center p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-all cursor-pointer">
                                <RotateCcw size={20} className="text-gray-600 mr-3 group-hover:text-black transition-colors" />
                                <div>
                                    <h4 className="font-medium text-sm">Pengembalian 14 Hari</h4>
                                    <p className="text-xs text-gray-500">Garansi pengembalian produk</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Images Column */}
                <div className="w-full lg:w-2/4 order-1 lg:order-2">
                    <div className="sticky top-8 space-y-4">
                        <div className="relative group overflow-hidden rounded-xl bg-gray-50">
                            <img
                                src={activeImage || product.gambar}
                                alt={product.nama_barang}
                                className="w-full h-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                            />
                            <button
                                onClick={() => setAddedToWishlist(!addedToWishlist)}
                                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                    addedToWishlist ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:text-red-500"
                                }`}
                            >
                                <Heart size={20} fill={addedToWishlist ? "white" : "none"} />
                            </button>
                        </div>

                        {product.gambar && product.gmbr && (
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setActiveImage(product.gambar)}
                                    className={`w-24 h-24 rounded-lg overflow-hidden transition-all ${
                                        activeImage === product.gambar ? "ring-2 ring-black" : "opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    <img src={product.gambar} alt={product.nama_barang} className="w-full h-full object-cover" />
                                </button>
                                <button
                                    onClick={() => setActiveImage(product.gmbr)}
                                    className={`w-24 h-24 rounded-lg overflow-hidden transition-all ${
                                        activeImage === product.gmbr ? "ring-2 ring-black" : "opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    <img src={product.gmbr} alt={product.nama_barang} className="w-full h-full object-cover" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Buy Column */}
                <div className="w-full lg:w-1/4 order-3">
                    <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-8">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-3xl font-bold text-gray-900">IDR {product.harga.toLocaleString("id-ID")}</p>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Tersedia</span>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-medium flex items-center">
                                <span className="mr-2">UKURAN:</span>
                                {selectedSize && <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">{selectedSize}</span>}
                            </h4>
                            <button
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                                onClick={() => {
                                    alert("Size chart would show here");
                                }}
                            >
                                <Ruler size={16} className="mr-1" />
                                SIZE CHART
                            </button>
                        </div>

                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {[36, 37, 38, 39, 40, 41, 42, 43, 44, 45].map((size) => (
                                <button
                                    key={size}
                                    className={`relative p-2 border rounded-md text-base font-medium transition-all duration-200 
                                        ${
                                            selectedSize === size
                                                ? "bg-black text-white border-black shadow-md transform scale-105"
                                                : "bg-white text-black border-gray-300 hover:border-black"
                                        }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                    {selectedSize === size && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <button
                                className={`w-full py-4 rounded-lg font-bold flex items-center justify-center transition-all duration-300
                                    ${
                                        selectedSize
                                            ? "bg-black text-white hover:bg-green-600 transform hover:-translate-y-1"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                                disabled={!selectedSize}
                                onClick={() => {
                                    if (selectedSize && product) handleBuy(product);
                                }}
                            >
                                <ShoppingBag size={20} className="mr-2" />
                                {selectedSize ? "Checkout Sekarang" : "Pilih Ukuran"}
                            </button>

                            <button
                                className="w-full py-4 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center"
                                onClick={() => navigate("/user/products")}
                            >
                                Lihat Produk Lainnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* You Might Also Like Section */}
            {relatedProducts.length > 0 && (
                <div className="container mx-auto p-4 md:p-6 lg:p-8">
                    <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map((relatedProduct) => (
                            <div
                                key={relatedProduct.id}
                                className="group cursor-pointer"
                                onClick={() => navigate(`/user/selected/${relatedProduct.id}`)}
                            >
                                <div className="relative overflow-hidden rounded-lg bg-gray-50">
                                    <img
                                        src={relatedProduct.gambar}
                                        alt={relatedProduct.nama_barang}
                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-sm font-medium text-gray-900 truncate">{relatedProduct.nama_barang}</h3>
                                    <p className="text-sm text-gray-600">IDR {relatedProduct.harga.toLocaleString("id-ID")}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
};

export default SelectedProductPage;