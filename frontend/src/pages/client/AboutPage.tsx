import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FaInstagram, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MapComponent from "../../components/Maps";

const AboutPage: React.FC = () => {
  const [language, setLanguage] = useState<"en" | "id">("en");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  const backgroundOpacity = useTransform(smoothScrollYProgress, [0, 0.6], [0.2, 1]);
  const backgroundScale = useTransform(smoothScrollYProgress, [0, 0.6], [1.3, 1]);
  const heroOpacity = useTransform(smoothScrollYProgress, [0, 0.3], [1, 0.5]);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 200);
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const openModal = (img: string, index: number) => {
    setSelectedImage(img);
    setSelectedImageIndex(index);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "id" : "en"));
  };

  const text: Record<"en" | "id", { title: string; description: string; followUs: string; translate: string; imageCaptions: string[] }> = {
    en: {
      title: "Discover Sepokat Store",
      description: `Welcome to Sepokat Store, the ultimate destination for premium footwear that blends unparalleled style, comfort, and durability. 
      Our curated collection features trendy and timeless shoes, designed to elevate every step you take. 
      We’re on a mission to source the world’s finest footwear, crafted with superior materials and innovative designs. 
      At Sepokat Store, your satisfaction is our priority, with seamless service, secure payments, and lightning-fast delivery. 
      From casual sneakers to elegant formal shoes and high-performance sportswear, we have the perfect pair for you.`,
      followUs: "Connect With Us",
      translate: "Switch to Indonesian",
      imageCaptions: [
        "Timeless sneakers that redefine everyday style.",
        "Crafted for durability, designed for comfort.",
        "Bold designs to lead the fashion frontier.",
        "Exclusive editions with premium craftsmanship.",
      ],
    },
    id: {
      title: "Jelajahi Sepokat Store",
      description: `
      Selamat datang di Sepokat Store, destinasi utama untuk sepatu premium yang memadukan gaya, kenyamanan, dan ketahanan tanpa tanding. 
      Koleksi kami menawarkan sepatu trendi dan klasik, dirancang untuk menyempurnakan setiap langkah Anda. 
      Misi kami adalah menghadirkan sepatu terbaik dari seluruh dunia, dibuat dengan bahan unggul dan desain inovatif. 
      Di Sepokat Store, kepuasan Anda adalah prioritas kami, dengan layanan mulus, pembayaran aman, dan pengiriman super cepat. 
      Dari sneakers kasual hingga sepatu formal elegan dan perlengkapan olahraga berperforma tinggi, kami punya pasangan sempurna untuk Anda.`,
      followUs: "Terhubung Dengan Kami",
      translate: "Ganti ke Inggris",
      imageCaptions: [
        "Sneakers abadi yang mendefinisikan gaya sehari-hari.",
        "Dibuat untuk ketahanan, dirancang untuk kenyamanan.",
        "Desain berani untuk memimpin tren fesyen.",
        "Edisi eksklusif dengan keahlian premium.",
      ],
    },
  };

  const images: string[] = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.4,
      },
    },
  };

  const fadeInUpStagger = {
    hidden: { y: 80, opacity: 0 },
    visible: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 120,
        delay: custom * 0.15,
      },
    }),
  };

  const imageContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Dynamic Background */}
      <motion.div
        className="fixed inset-0 z-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black"
        style={{ opacity: backgroundOpacity, scale: backgroundScale }}
      >
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "160px 160px",
          }}
        />
      </motion.div>

      <Header />

      {/* Hero Section */}
      <motion.div
        className="relative z-10 w-full h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2.5 }}
        />
        <motion.video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          initial={{ scale: 1.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          <source src="https://cdn.pixabay.com/video/2023/02/04/150677-798416687_tiny.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          <div className="text-center px-6 md:px-12">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 mb-6 drop-shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              {text[language].title}
            </motion.h1>
            <motion.p
              className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              Redefining footwear with style and innovation.
            </motion.p>
            <motion.div
              className="w-40 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mt-6"
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{ duration: 1.5, delay: 1.5 }}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.main ref={mainRef} className="relative z-10 py-24 px-4 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          {/* Decorative Elements */}
          <motion.div
            className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full filter blur-3xl opacity-30"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-48 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-500/30 to-pink-500/30 rounded-full filter blur-3xl opacity-30"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.35, 0.3] }}
            transition={{ duration: 10, delay: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />

          <motion.div
            className="bg-gray-900/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border border-gray-700/50 p-8 md:p-12 lg:p-16"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            whileHover={{ boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.3)" }}
          >
            {/* Description Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-150px" }}
              className="mb-20 text-gray-300"
            >
              {text[language].description.split("\n").map((paragraph, idx) => (
                <motion.p
                  key={idx}
                  custom={idx}
                  variants={fadeInUpStagger}
                  className="mb-6 text-lg md:text-xl leading-relaxed"
                >
                  {paragraph.trim()}
                </motion.p>
              ))}
            </motion.div>

            {/* Image Gallery Section */}
            <motion.div
              variants={imageContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-32 my-24"
            >
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  className={`grid grid-cols-1 ${index % 2 === 0 ? "lg:grid-cols-[3fr_2fr]" : "lg:grid-cols-[2fr_3fr]"} gap-8 lg:gap-16 items-center`}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { delay: index * 0.25 } },
                  }}
                >
                  {/* Image */}
                  <motion.div
                    className={`${index % 2 !== 0 && "lg:order-2"} perspective-1200`}
                    whileInView={{ opacity: [0, 1], y: [60, 0], scale: [0.9, 1] }}
                    viewport={{ once: true, margin: "-150px" }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.06,
                        rotateY: index % 2 === 0 ? 10 : -10,
                        boxShadow: "0 40px 80px rgba(0,0,0,0.25)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="group rounded-3xl shadow-2xl overflow-hidden relative z-10"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-600 z-0"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <motion.img
                        src={img}
                        alt={`Sneaker ${index + 1}`}
                        loading="lazy"
                        className="w-full h-auto cursor-pointer object-cover transform group-hover:scale-108 transition-transform duration-800 ease-out"
                        onClick={() => openModal(img, index)}
                        layoutId={`image-${index}`}
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-600"
                        initial={{ y: 120 }}
                        whileHover={{ y: 0 }}
                      >
                        <p className="text-white font-semibold text-xl leading-snug">{text[language].imageCaptions[index]}</p>
                        <motion.button
                          className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                          whileHover={{ scale: 1.1, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(img, index);
                          }}
                        >
                          Explore Now
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Caption and Features */}
                  <motion.div
                    className={`${index % 2 !== 0 && "lg:order-1"} mt-8 lg:mt-0`}
                    whileInView={{ opacity: [0, 1], x: [index % 2 === 0 ? 40 : -40, 0] }}
                    viewport={{ once: true, margin: "-150px" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <motion.h3
                      className="text-3xl font-extrabold text-white mb-4"
                      whileInView={{ opacity: [0, 1], y: [30, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      Collection {index + 1}
                    </motion.h3>
                    <motion.div
                      className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6"
                      whileInView={{ width: ["0%", "80px"] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.5 }}
                    />
                    <motion.p
                      className="text-lg text-gray-300 leading-relaxed font-medium"
                      whileInView={{ opacity: [0, 1], y: [40, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    >
                      {text[language].imageCaptions[index]}
                    </motion.p>
                    <motion.ul
                      className="mt-8 space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {["Premium Materials", "Master Craftsmanship", "Innovative Design", "Unmatched Comfort"].map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-center text-gray-300"
                          variants={fadeInUpStagger}
                          custom={i}
                        >
                          <motion.div
                            className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mr-4 flex items-center justify-center"
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                          {feature}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Media Section */}
            <motion.div
              className="mt-24 py-20 border-t border-gray-700/50"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <motion.div className="text-center max-w-4xl mx-auto">
                <motion.h3
                  className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 mb-10"
                  whileInView={{ scale: [0.9, 1.1, 1], opacity: [0, 1] }}
                  transition={{ duration: 0.9, times: [0, 0.6, 1], delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {text[language].followUs}
                </motion.h3>
                <motion.div
                  className="flex justify-center gap-12 text-5xl"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ staggerChildren: 0.2, delayChildren: 0.4 }}
                >
                  {[
                    {
                      icon: <FaInstagram />,
                      url: "https://instagram.com",
                      label: "Instagram",
                      hoverColor: "hover:text-pink-500",
                      bgColor: "from-pink-500 to-purple-600",
                    },
                    {
                      icon: <FaGithub />,
                      url: "https://github.com",
                      label: "GitHub",
                      hoverColor: "hover:text-gray-200",
                      bgColor: "from-gray-700 to-gray-900",
                    },
                    {
                      icon: <FaLinkedin />,
                      url: "https://linkedin.com",
                      label: "LinkedIn",
                      hoverColor: "hover:text-blue-500",
                      bgColor: "from-blue-600 to-blue-800",
                    },
                    {
                      icon: <FaXTwitter />,
                      url: "https://twitter.com",
                      label: "Twitter",
                      hoverColor: "hover:text-blue-400",
                      bgColor: "from-blue-400 to-indigo-600",
                    },
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 ${social.hoverColor} transition-all duration-400 relative group`}
                      aria-label={social.label}
                      variants={{
                        hidden: { y: 40, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                      whileHover={{
                        scale: 1.4,
                        rotate: [0, -15, 15, -10, 0],
                        transition: { duration: 0.6 },
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 450, damping: 15 }}
                    >
                      <span className="relative z-10">{social.icon}</span>
                      <motion.span
                        className={`absolute inset-0 rounded-full bg-gradient-to-tr ${social.bgColor} opacity-0 group-hover:opacity-40 transition-opacity duration-400 -z-10`}
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 2 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                      />
                    </motion.a>
                  ))}
                </motion.div>
                <motion.div
                  className="mt-16"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 20px 40px -5px rgba(99, 102, 241, 0.5)",
                      background: "linear-gradient(to right, #a855f7, #ec4899)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-400 text-lg"
                    onClick={toggleLanguage}
                  >
                    {text[language].translate}
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.main>

      <MapComponent />
      <Footer />

      {/* Image Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-8"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0, rotate: 15 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className="relative max-w-6xl w-full max-h-[92vh] bg-gray-900/90 rounded-3xl overflow-hidden shadow-3xl border border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={closeModal}
                className="absolute top-6 right-6 z-20 w-14 h-14 flex items-center justify-center rounded-full bg-gray-800/80 text-gray-200 hover:bg-red-600 hover:text-white transition-all duration-400"
                aria-label="Close modal"
                whileHover={{ scale: 1.3, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-4xl">×</span>
              </motion.button>
              <motion.img
                src={selectedImage!}
                alt={`Sneaker ${selectedImageIndex + 1}`}
                className="w-full h-auto object-contain max-h-[88vh]"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                layoutId={`image-${selectedImageIndex}`}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="text-white text-lg font-medium">{text[language].imageCaptions[selectedImageIndex]}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AboutPage;