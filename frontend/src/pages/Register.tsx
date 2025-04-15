import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [registerStatus, setRegisterStatus] = useState<{
        message: string;
        type: "success" | "error" | "";
    }>({ message: "", type: "" });
    const [currentImage, setCurrentImage] = useState<number>(0);

    const backgroundImage = [
        "https://cdn.pixabay.com/photo/2016/06/03/17/35/shoes-1433925_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/11/19/15/58/camera-1840054_1280.jpg",
        "https://cdn.pixabay.com/photo/2018/08/16/21/15/shoemaking-3611509_1280.jpg",
        "https://cdn.pixabay.com/photo/2017/07/31/11/44/shoe-2557329_1280.jpg" // Mengganti gambar duplikat
    ];

    // Password strength indicator
    const getPasswordStrength = (pass: string): { strength: number; label: string; color: string } => {
        if (!pass) return { strength: 0, label: "", color: "bg-gray-500" };
        
        let strength = 0;
        if (pass.length > 6) strength += 1;
        if (pass.length > 10) strength += 1;
        if (/[A-Z]/.test(pass)) strength += 1;
        if (/[0-9]/.test(pass)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 1;

        const labels = ["Sangat Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat"];
        const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"];

        return { 
            strength, 
            label: labels[Math.min(strength, 4)], 
            color: colors[Math.min(strength, 4)]
        };
    };

    const passwordStrength = getPasswordStrength(password);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % backgroundImage.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [backgroundImage.length]);

    const handleRegister = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setRegisterStatus({ message: "", type: "" });

        const formData = { email, username, password };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setRegisterStatus({
                    message: "Registrasi berhasil! Silakan login.",
                    type: "success"
                });
                setEmail("");
                setUsername("");
                setPassword("");
            } else {
                setRegisterStatus({
                    message: data.message || "Registrasi gagal",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Error:", error);
            setRegisterStatus({
                message: "Terjadi kesalahan saat registrasi.",
                type: "error"
            });
        } finally {
            setIsLoading(false);
        }
    }, [email, username, password]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Animation variants
    const containerVariants = {
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
        rest: { scale: 1 },
        hover: { 
            scale: 1.05,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            background: "linear-gradient(to right, #4f46e5, #3b82f6)",
            transition: { duration: 0.3 }
        },
        tap: { scale: 0.95 }
    };

    const inputVariants = {
        rest: { scale: 1, borderColor: "rgba(107, 114, 128, 0.5)" },
        focus: { 
            scale: 1.02, 
            borderColor: "#3b82f6",
            boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)",
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
            {/* Background Image Carousel with Parallax */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-[1]"></div>
            </div>

            {/* Glass Card Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-md px-4"
            >
                <motion.div 
                    className="p-8 backdrop-blur-md bg-gray-900/80 shadow-2xl border border-gray-700/50 rounded-2xl overflow-hidden"
                    whileHover={{ boxShadow: "0 0 30px rgba(79, 70, 229, 0.3)" }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Decorative elements */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                    
                    <motion.h2
                        variants={itemVariants}
                        className="text-white text-3xl font-bold text-center mb-2"
                    >
                        Create Account
                    </motion.h2>
                    
                    <motion.p 
                        variants={itemVariants} 
                        className="text-gray-300 text-center mb-8 text-sm"
                    >
                        Join our community today
                    </motion.p>

                    {/* Status message */}
                    <AnimatePresence>
                        {registerStatus.message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`mb-4 p-3 rounded-lg text-sm text-center ${
                                    registerStatus.type === "success" 
                                        ? "bg-green-500/20 border border-green-500/30 text-green-200" 
                                        : "bg-red-500/20 border border-red-500/30 text-red-200"
                                }`}
                            >
                                {registerStatus.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <motion.div 
                            variants={itemVariants}
                            className="relative group"
                        >
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200">
                                <FiMail className="text-lg" />
                            </div>
                            <motion.input
                                variants={inputVariants}
                                initial="rest"
                                whileFocus="focus"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-800/70 text-white border border-gray-600 rounded-xl focus:outline-none transition-all duration-300"
                                required
                            />
                            <motion.span 
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-400 to-blue-500"
                                initial={{ width: 0 }}
                                whileHover={{ width: "100%" }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            className="relative group"
                        >
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200">
                                <FiUser className="text-lg" />
                            </div>
                            <motion.input
                                variants={inputVariants}
                                initial="rest"
                                whileFocus="focus"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-800/70 text-white border border-gray-600 rounded-xl focus:outline-none transition-all duration-300"
                                required
                            />
                            <motion.span 
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-400 to-blue-500"
                                initial={{ width: 0 }}
                                whileHover={{ width: "100%" }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            className="relative group"
                        >
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200">
                                <FiLock className="text-lg" />
                            </div>
                            <motion.input
                                variants={inputVariants}
                                initial="rest"
                                whileFocus="focus"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-gray-800/70 text-white border border-gray-600 rounded-xl focus:outline-none transition-all duration-300"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                            <motion.span 
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-400 to-blue-500"
                                initial={{ width: 0 }}
                                whileHover={{ width: "100%" }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.div>

                        {/* Password strength indicator */}
                        {password && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="space-y-2"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Password Strength</span>
                                    <span className={`text-xs ${
                                        passwordStrength.strength >= 3 ? "text-green-400" : 
                                        passwordStrength.strength >= 2 ? "text-yellow-400" : "text-red-400"
                                    }`}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div 
                                        className={`h-full ${passwordStrength.color}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        <motion.button
                            variants={buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl shadow-lg transition-all relative overflow-hidden mt-6"
                        >
                            <span className="relative z-10">
                                {isLoading ? "Processing..." : "Register"}
                            </span>
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
                    </form>

                    <motion.div variants={itemVariants} className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Sudah punya akun?{" "}
                            <Link 
                                to="/" 
                                className="text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
                            >
                                Login
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;