import { motion } from "framer-motion";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

export const HomePage: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    
    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);
    
    const openModal = (img: string) => {
        setSelectedImage(img);
        setModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setSelectedImage(null);
        setModalOpen(false);
        document.body.style.overflow = "auto";
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const images = [
        "https://i.pinimg.com/736x/69/4e/68/694e68e6a557fd3828066111a7ba91dc.jpg",
        "https://i.pinimg.com/736x/5e/6c/e7/5e6ce710086f3c65fcbfea5e6b582c2e.jpg",
        "https://i.pinimg.com/736x/89/ae/a1/89aea1a3e83aee4315273139a5962039.jpg",
        "https://i.pinimg.com/736x/d2/d5/11/d2d511d9fbe05fdb5b12bfbc3de00f95.jpg"
    ];

    return (
        <>
            <main className="relative min-h-screen bg-white text-black overflow-hidden w-full">
                {/* Header - Now with transition effect */}
                <motion.div 
                    className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <Header />
                </motion.div>

                {/* Hero Section with Parallax Effect */}
                <section className="relative flex flex-col items-center justify-center h-screen text-center px-6 overflow-hidden">
                    <motion.div
                        className="absolute inset-0 z-0"
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, ease: "easeOut" }}
                    >
                        <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: "url('https://images.unsplash.com/photo-1598775378121-e24f7062c151?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                                filter: "brightness(0.7)"
                            }}
                        />
                    </motion.div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40" />
                    
                    <div className="absolute bottom-24 left-0 z-10 w-full px-6 md:px-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-xl"
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="font-bold text-4xl md:text-6xl text-white mb-4 drop-shadow-lg"
                            >
                                Welcome to <span className="text-green-400">Sneaker</span> Shop
                            </motion.h1>
                            
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="text-white text-lg md:text-xl mb-8 max-w-md mx-auto md:mx-0"
                            >
                                Discover the latest trends in premium footwear with our exclusive collection
                            </motion.p>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                className="flex flex-wrap gap-4 justify-center md:justify-start"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(134, 239, 172, 0.8)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/user/products")}
                                    className="px-8 py-4 bg-green-400 text-black rounded-full font-semibold text-lg shadow-xl hover:bg-green-300 transition-all"
                                >
                                    Shop Now
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg shadow-xl hover:bg-white hover:text-black transition-all"
                                >
                                    Explore Collection
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                    
                    <motion.div
                        className="absolute bottom-6 left-0 right-0 flex justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center p-2"
                        >
                            <div className="w-1 h-3 bg-white rounded-full" />
                        </motion.div>
                    </motion.div>
                </section>

                {/* Featured Products Section */}
                <section className="py-20 px-6 md:px-16 bg-gray-50">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Collection</h2>
                        <div className="w-24 h-1 bg-green-400 mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto">Discover our most popular and trending sneakers that combine style, comfort, and performance</p>
                    </motion.div>
                    
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {images.map((img, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                                onClick={() => openModal(img)}
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`Sneaker ${index + 1}`}
                                        className="w-full h-72 object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-semibold text-lg mb-2">Premium Sneaker {index + 1}</h3>
                                    <p className="text-gray-500 mb-4">Limited edition design</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-xl">${Math.floor(Math.random() * 100) + 100}.00</span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 bg-green-400 rounded-full text-white"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* Improved Modal with better animations */}
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-3xl w-full relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <img
                                    src={selectedImage!}
                                    alt="Sneaker"
                                    className="w-full object-cover"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white bg-opacity-70 rounded-full shadow-lg text-xl font-bold"
                                >
                                    &times;
                                </motion.button>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-2">Premium Sneaker</h3>
                                <p className="text-gray-600 mb-4">Limited edition design with premium materials and exceptional comfort.</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold">${Math.floor(Math.random() * 100) + 100}.00</span>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-green-400 text-white rounded-full font-semibold shadow-lg hover:bg-green-500 transition-all"
                                    >
                                        Add to Cart
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default HomePage;