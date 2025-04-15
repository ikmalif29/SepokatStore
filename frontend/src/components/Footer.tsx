import { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoMailOutline, IoLocationOutline, IoCallOutline } from "react-icons/io5";

const Footer: React.FC = () => {
    const [hoverLink, setHoverLink] = useState<number | null>(null);
    const currentYear = new Date().getFullYear();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    // Social media data with enhanced styling
    const socialMedia = [
        { 
            icon: <FaInstagram />, 
            link: "https://instagram.com/sepokat_store", 
            color: "bg-gradient-to-tr from-purple-500 to-pink-500",
            hoverColor: "from-purple-600 to-pink-600"
        },
        { 
            icon: <FaGithub />, 
            link: "https://github.com/sepokat", 
            color: "bg-gray-800",
            hoverColor: "bg-gray-700"
        },
        { 
            icon: <FaLinkedin />, 
            link: "https://linkedin.com/company/sepokat", 
            color: "bg-blue-600",
            hoverColor: "bg-blue-700"
        },
        { 
            icon: <FaXTwitter />, 
            link: "https://twitter.com/sepokat_store", 
            color: "bg-black",
            hoverColor: "bg-gray-800"
        }
    ];

    // Contact info
    const contactInfo = [
        { icon: <IoMailOutline className="text-xl" />, text: "contact@sepokatstore.com" },
        { icon: <IoLocationOutline className="text-xl" />, text: "Jl. Sepatu Keren No. 123, Bandung"},
        { icon: <IoCallOutline className="text-xl" />, text: "+62 812-3456-7890" }
    ];

    return (
        <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white py-12 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-pink-500/10 blur-3xl"></div>
            
            <div className="max-w-6xl mx-auto px-6 md:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {/* Brand Column */}
                    <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start">
                        <div className="mb-4 flex items-center">
                            <motion.div 
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-3"
                            />
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
                                Sepokat Store
                            </h2>
                        </div>
                        <p className="text-gray-300 text-sm md:text-base mb-6">
                            Temukan koleksi sepatu premium dengan desain terkini hanya di Sepokat Store. 
                            Kami menawarkan pengalaman berbelanja yang eksklusif dengan layanan terbaik.
                        </p>
                        
                        {/* Newsletter signup */}
                        <div className="w-full mt-2">
                            <p className="text-sm font-medium mb-2 text-gray-300">Subscribe untuk mendapatkan info terbaru</p>
                            <div className="flex w-full">
                                <input 
                                    type="email" 
                                    placeholder="Email anda" 
                                    className="bg-gray-800 border border-gray-700 rounded-l-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                                <motion.button 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-r-md text-sm font-medium"
                                >
                                    Daftar
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Links Column */}
                    <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start">
                        <h3 className="text-xl font-bold mb-4 border-b-2 border-purple-500 pb-2">Halaman Penting</h3>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                            {["Beranda", "Produk", "Katalog", "Tentang Kami", "Kontak", "Blog", "FAQ", "Testimoni"].map((item, index) => (
                                <motion.a
                                    key={index}
                                    href="#"
                                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base flex items-center"
                                    whileHover={{ x: 5, color: "#ffffff" }}
                                    onMouseEnter={() => setHoverLink(index)}
                                    onMouseLeave={() => setHoverLink(null)}
                                >
                                    <span className={`mr-1 transition-all duration-300 ${hoverLink === index ? "scale-100" : "scale-0"}`}>
                                        &raquo;
                                    </span>
                                    {item}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                    
                    {/* Contact Column */}
                    <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start">
                        <h3 className="text-xl font-bold mb-4 border-b-2 border-purple-500 pb-2">Hubungi Kami</h3>
                        <div className="space-y-4 mb-6">
                            {contactInfo.map((item, index) => (
                                <motion.div 
                                    key={index}
                                    className="flex items-center text-gray-300"
                                    whileHover={{ x: 5 }}
                                >
                                    <span className="mr-3 bg-gray-800 p-2 rounded-full">{item.icon}</span>
                                    <span className="text-sm">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* Social Media Icons with enhanced styling */}
                        <div className="flex gap-3 mt-2">
                            {socialMedia.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${social.color} hover:${social.hoverColor} p-3 rounded-full text-white flex items-center justify-center`}
                                    whileHover={{ 
                                        scale: 1.2, 
                                        rotate: [0, -10, 10, -10, 0],
                                        transition: { duration: 0.5 }
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
                
                {/* Bottom bar with copyright */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 pt-6 border-t border-gray-800 text-center"
                >
                    <p className="text-gray-500 text-sm">
                        © {currentYear} Sepokat Store. All Rights Reserved. 
                        <span className="hidden md:inline"> | Dibuat dengan ❤️ untuk para pecinta sepatu</span>
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;