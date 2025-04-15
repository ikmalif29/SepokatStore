import { motion } from "framer-motion"; // Mengimpor framer-motion untuk animasi
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <motion.div
                className="bg-red-600 text-white rounded-lg p-10 max-w-sm w-full text-center shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold mb-6 animate__animated animate__fadeIn">
                    403 Forbidden
                </h1>
                <p className="text-lg mb-8 opacity-80">
                    You do not have access to this page.
                </p>
                <motion.button
                    className="bg-white text-red-600 border-none rounded-lg px-6 py-3 text-lg font-bold transition duration-300 transform hover:bg-red-600 hover:text-white hover:scale-105 focus:outline-none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(-1)}
                >
                    Back
                </motion.button>
            </motion.div>
        </div>
    );
}