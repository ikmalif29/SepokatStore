"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Home, ShoppingBag, Info, User,
  ShoppingCart, Inbox, Search, ChevronDown, Bell
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Product {
  id_user: string;
  id_barang: number;
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [dataCart, setDataCart] = useState<Product[]>([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3); // Mock notification count
  const [showDropdown, setShowDropdown] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userLogin = localStorage.getItem("userLogin");

    if (userLogin) {
      const userId = JSON.parse(userLogin)?.id;
      const filterCartItem = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/getcart`);
          if (!response.ok) {
            throw new Error("Gagal mengambil data keranjang");
          }

          const result = await response.json();
          const filteredCart = result.filter((item: { id_user: number }) => item.id_user === userId);
          setDataCart(filteredCart);
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      };

      filterCartItem();
    }
  }, [dataCart.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
    setShowSearchBar(false);
  };

  const dropdownNavLinks = {
    shop: [
      { label: "New Arrivals", href: "/user/products" },
      { label: "Best Sellers", href: "/user/products" },
      { label: "Sale Items", href: "/user/products" },
      { label: "Collections", href: "/user/products" }
    ],
    account: [
      { label: "My Profile", href: "/user/profile" },
      { label: "Order History", href: "/user/history" },
    ]
  };

  return (
    <>
      <motion.header
        className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 
          ${scrolling
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg text-gray-800 dark:text-white"
            : "bg-gradient-to-r from-gray-900 to-black text-white"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        {/* Top Bar with Logo and Search */}
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          {/* Logo */}
          <Link to="/user/homepage">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-lg sm:text-xl font-bold">S</span>
              </div>
              <motion.h1
                className={`text-xl sm:text-2xl md:text-3xl font-bold ${scrolling ? "text-gray-800 dark:text-white" : "text-white"}`}
              >
                <span className="font-light">Sepokat</span>
                <span className="font-extrabold">Store</span>
              </motion.h1>
            </motion.div>
          </Link>

          {/* Main Navigation - Desktop */}
          <nav className="hidden lg:flex space-x-4 xl:space-x-6 items-center">
            <NavLink href="/user/homepage" icon={Home} label="Home" />

            {/* Shop dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown("shop")}
              onMouseLeave={() => setShowDropdown("")}
            >
              <button className={`flex items-center space-x-1 ${scrolling ? "text-gray-800 dark:text-white" : "text-white"} text-sm xl:text-base`}>
                <ShoppingBag size={16} />
                <span>Shop</span>
                <ChevronDown size={12} className={`transform transition-transform ${showDropdown === "shop" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showDropdown === "shop" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl min-w-[180px] py-2 z-50"
                  >
                    {dropdownNavLinks.shop.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/user/about" icon={Info} label="About" />

            {/* Account dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown("account")}
              onMouseLeave={() => setShowDropdown("")}
            >
              <button className={`flex items-center space-x-1 ${scrolling ? "text-gray-800 dark:text-white" : "text-white"} text-sm xl:text-base`}>
                <User size={16} />
                <span>Account</span>
                <ChevronDown size={12} className={`transform transition-transform ${showDropdown === "account" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showDropdown === "account" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl min-w-[180px] py-2 z-50"
                  >
                    {dropdownNavLinks.account.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Button */}
            <button
              onClick={() => setShowSearchBar(!showSearchBar)}
              className={`relative p-2 sm:p-3 rounded-full transition-colors ${showSearchBar
                ? "bg-gray-200 dark:bg-gray-700"
                : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                }`}
            >
              <Search size={18} className={scrolling ? "text-gray-800 dark:text-white" : "text-white"} />
            </button>

            {/* Notifications */}
            <button className="relative p-2 sm:p-3 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              onClick={() => navigate("/user/order-detail")}
            >
              <Bell size={18} className={scrolling ? "text-gray-800 dark:text-white" : "text-white"}
              />
              {notifications > 0 && (
                <span
                  className="absolute top-0 right-0 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Inbox */}
            <Link to="/user/history" className="relative p-2 sm:p-3 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
              <Inbox size={18} className={scrolling ? "text-gray-800 dark:text-white" : "text-white"} />
            </Link>

            {/* Cart */}
            <Link to="/user/cart" className="relative p-2 sm:p-3 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
              <ShoppingCart size={18} className={scrolling ? "text-gray-800 dark:text-white" : "text-white"} />
              {dataCart.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {dataCart.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 sm:p-3 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              aria-label="Menu"
            >
              {isOpen ? (
                <X size={20} className={scrolling ? "text-gray-800 dark:text-white" : "text-white"} />
              ) : (
                <Menu size={20} className={scrolling ? "text-gray-800 dark:text-white" : "text-white"} />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen Search Bar */}
      <AnimatePresence>
        {showSearchBar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-gray-900/95 z-50 flex items-start pt-16 sm:pt-20 justify-center overflow-y-auto"
          >
            <div className="container mx-auto px-4 sm:px-6">
              <div className="relative flex flex-col items-center">
                <button
                  onClick={() => setShowSearchBar(false)}
                  className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>

                <h2 className="text-lg sm:text-2xl text-white font-light mb-6">What are you looking for?</h2>

                <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full bg-white/10 border-b-2 border-gray-300 text-white text-base sm:text-lg py-2 px-4 pr-10 placeholder-gray-400 focus:outline-none focus:border-green-400"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                    >
                      <Search size={20} />
                    </button>
                  </div>
                </form>

                {/* Popular searches */}
                <div className="mt-6 text-center">
                  <p className="text-gray-400 mb-3 text-sm sm:text-base">Popular Searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["T-shirts", "Shoes", "Electronics", "Sale", "New Arrivals"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base rounded-full transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-[min(80%,320px)] bg-white dark:bg-gray-900 z-50 shadow-xl overflow-y-auto"
          >
            <div className="p-4 sm:p-5">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg sm:text-xl font-bold">Menu</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  <MobileNavLink href="/user/homepage" icon={Home} label="Home" onClick={() => setIsOpen(false)} />
                  <MobileNavLink href="/user/products" icon={ShoppingBag} label="Shop" onClick={() => setIsOpen(false)} />
                  <MobileNavLink href="/user/about" icon={Info} label="About" onClick={() => setIsOpen(false)} />
                  <MobileNavLink href="/profile" icon={User} label="Profile" onClick={() => setIsOpen(false)} />
                  <MobileNavLink href="/inbox" icon={Inbox} label="Inbox" onClick={() => setIsOpen(false)} />
                  <MobileNavLink
                    href="/user/cart"
                    icon={ShoppingCart}
                    label="Cart"
                    badgeCount={dataCart.length}
                    onClick={() => setIsOpen(false)}
                  />
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Links</h3>
                  <div className="space-y-2">
                    {[
                      { label: "New Arrivals", href: "/user/products" },
                      { label: "Best Sellers", href: "/user/products" },
                      { label: "Sale Items", href: "/user/products" }
                    ].map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        className="block text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Customer Service */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer Service</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Contact Us", href: "/contact" },
                      { label: "FAQs", href: "/faq" },
                      { label: "Shipping & Returns", href: "/shipping" }
                    ].map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        className="block text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Desktop Navigation Link Component
const NavLink: React.FC<{ href: string; icon: any; label: string }> = ({ href, icon: Icon, label }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={href}
      className="flex items-center space-x-1 relative text-sm xl:text-base"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon size={16} />
      <span>{label}</span>

      {/* Animated underline on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink: React.FC<{
  href: string;
  icon: any;
  label: string;
  badgeCount?: number;
  onClick: () => void;
}> = ({ href, icon: Icon, label, badgeCount, onClick }) => {
  return (
    <Link
      to={href}
      className="flex items-center space-x-3 py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      onClick={onClick}
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
        <Icon size={16} className="text-gray-800 dark:text-gray-200" />
      </div>
      <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">{label}</span>
      {badgeCount && badgeCount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
          {badgeCount}
        </span>
      )}
    </Link>
  );
};

export default Header;