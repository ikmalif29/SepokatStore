import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginError("");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("userLogin", JSON.stringify(data.user));
                Cookies.set("token", data.user.token, { expires: 1 });
                Cookies.set("role", data.user.role, { expires: 1 });
                
                // Menampilkan pesan sukses dengan animasi
                const successMessage = document.createElement("div");
                successMessage.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
                successMessage.textContent = "Login berhasil";
                document.body.appendChild(successMessage);
                
                setTimeout(() => {
                    successMessage.remove();
                    if (data.user.role === "admin") {
                        navigate("/admin/dashboard");
                    } else {
                        navigate("/user/homepage");
                    }
                }, 1500);
            } else {
                setLoginError(data.message || "Login gagal");
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            setLoginError("Terjadi kesalahan, coba lagi nanti.");
        } finally {
            setIsLoading(false);
        }
    };

    const [currentImage, setCurrentImage] = useState<number>(0);

    const backgroundImage = [
        "https://cdn.pixabay.com/photo/2016/06/03/17/35/shoes-1433925_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/11/19/15/58/camera-1840054_1280.jpg",
        "https://cdn.pixabay.com/photo/2018/08/16/21/15/shoemaking-3611509_1280.jpg",
        "https://cdn.pixabay.com/photo/2017/07/31/11/44/shoe-2557329_1280.jpg" // Mengganti gambar duplikat
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % backgroundImage.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [backgroundImage.length]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const formVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.8, 
                ease: "easeOut",
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const buttonVariants = {
        rest: { scale: 1, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
        hover: { 
            scale: 1.05, 
            boxShadow: "0px 8px 15px rgba(59, 130, 246, 0.3)",
            transition: { duration: 0.3, ease: "easeInOut" }
        },
        tap: { scale: 0.95 }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
            {/* Background Slider with Parallax Effect */}
            <div className="absolute inset-0 w-full h-full">
                <AnimatePresence>
                    {backgroundImage.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: index === currentImage ? 1 : 0,
                                scale: index === currentImage ? 1.05 : 1
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                                opacity: { duration: 1.5, ease: "easeInOut" },
                                scale: { duration: 7, ease: "easeInOut" }
                            }}
                            className="absolute inset-0 w-full h-full bg-cover bg-center filter brightness-50"
                            style={{ backgroundImage: `url(${image})` }}
                        ></motion.div>
                    ))}
                </AnimatePresence>
                
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 z-[1]"></div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={formVariants}
                className="relative z-10 w-full max-w-md px-4"
            >
                <motion.div 
                    className="p-8 backdrop-blur-md bg-gray-900/80 shadow-2xl border border-gray-700/50 rounded-2xl overflow-hidden"
                    whileHover={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)" }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                    
                    <motion.h2
                        variants={itemVariants}
                        className="text-white text-3xl font-bold text-center mb-2"
                    >
                        Welcome Back
                    </motion.h2>
                    
                    <motion.p 
                        variants={itemVariants} 
                        className="text-gray-300 text-center mb-8 text-sm"
                    >
                        Sign in to access your account
                    </motion.p>

                    {loginError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg text-sm text-center"
                        >
                            {loginError}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin}>
                        <motion.div 
                            variants={itemVariants} 
                            className="relative mb-5 group"
                        >
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200">
                                <FaUser />
                            </div>
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-4 bg-gray-800/70 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none placeholder-gray-400 transition-all duration-300"
                                required
                            />
                            <motion.span 
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"
                                initial={{ width: 0 }}
                                whileHover={{ width: "100%" }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>

                        <motion.div 
                            variants={itemVariants} 
                            className="relative mb-6 group"
                        >
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200">
                                <FaLock />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-4 bg-gray-800/70 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none placeholder-gray-400 transition-all duration-300"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            <motion.span 
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"
                                initial={{ width: 0 }}
                                whileHover={{ width: "100%" }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <motion.button
                                type="submit"
                                variants={buttonVariants}
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl shadow-lg transition-all relative overflow-hidden group"
                            >
                                <span className="relative z-10">
                                    {isLoading ? "Processing..." : "Login"}
                                </span>
                                <motion.span 
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                ></motion.span>
                                {isLoading && (
                                    <motion.span 
                                        className="absolute inset-0 flex items-center justify-center"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <svg className="w-5 h-5 text-white/30" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </motion.span>
                                )}
                            </motion.button>
                        </motion.div>
                    </form>

                    <motion.div 
                        variants={itemVariants}
                        className="mt-6 text-center"
                    >
                        <p className="text-gray-400 text-sm">
                            Don&apos;t have an account?{" "}
                            <Link 
                                to="/register" 
                                className="text-blue-400 hover:text-blue-300 hover:underline transition-all"
                            >
                                Register
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;