import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { LayoutDashboard, User, LogOut, Package, ShoppingBag, CheckCircle } from 'lucide-react'; // Tambahkan ikon CheckCircle
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const SideBarAdmin = () => {
    const [isOpen, setIsOpen] = useState(false);

    const sidebarVariants = {
        open: {
            x: 0,
            width: '250px',
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            },
        },
        closed: {
            x: '-100%',
            width: '0',
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        hover: { scale: 1.1, transition: { duration: 0.2 } },
    };

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/admin/dashboard' },
        { icon: <Package size={20} />, text: 'Products', path: '/admin/pdc' },
        { icon: <ShoppingBag size={20} />, text: 'Order List', path: '/admin/orderslist' },
        { icon: <CheckCircle size={20} />, text: 'Approved Orders', path: '/admin/detail-pemesanan-controller' }, // Menu baru untuk Approved Orders
        { icon: <User size={20} />, text: 'Users', path: '/admin/users' },
    ];

    const navigate = useNavigate();

    const handleLogout = () => {
        const isConfirmed = confirm("Are you sure you want to logout?");
        if (!isConfirmed) {
            return;
        }
        localStorage.removeItem("userLogin");
        Cookies.remove("token");
        navigate("/");
    };

    return (
        <div className="relative w-full">
            <button
                className="fixed top-6 left-6 z-50 bg-white rounded-full p-2 shadow-md hover:scale-105 transition-transform duration-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 z-40 shadow-2xl"
                        variants={sidebarVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <div className="border-b border-gray-700 pb-4 mb-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-wide">Admin Panel</h2>
                        </div>

                        <nav className="space-y-2">
                            {menuItems.map((item, index) => (
                                <motion.a
                                    key={index}
                                    href={item.path}
                                    className="flex items-center p-3 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.icon}
                                    <span className="ml-3">{item.text}</span>
                                </motion.a>
                            ))}

                            <motion.p
                                className="flex items-center p-3 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200 mt-6"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleLogout()}
                            >
                                <LogOut size={20} />
                                <span className="ml-3">Logout</span>
                            </motion.p>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {isOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default SideBarAdmin;