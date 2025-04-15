import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

interface EditFormData {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileUserPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EditFormData>({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", duration: 0.5 } },
    exit: { opacity: 0, scale: 0.7 },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = localStorage.getItem("userLogin");
        if (response) {
          const parsedData = JSON.parse(response);
          setUser(parsedData);
          setFormData((prev) => ({
            ...prev,
            username: parsedData.username,
            email: parsedData.email,
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError("Current password is required to update password");
        return false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords don't match");
        return false;
      }
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        return false;
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;
    setUpdateLoading(true);

    try {
      const updateData: any = {
        username: formData.username,
        email: formData.email,
      };
      if (formData.newPassword && formData.currentPassword) {
        updateData.password = formData.newPassword;
        updateData.currentPassword = formData.currentPassword;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/update/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update profile");

      const updatedUser = { ...user, username: formData.username, email: formData.email };
      setUser(updatedUser);
      localStorage.setItem("userLogin", JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setTimeout(() => setShowEditPopup(false), 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("userLogin");
    Cookies.remove("token");
    navigate("/");
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-pulse rounded-full h-16 w-16 bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-gray-100 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">User Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <main className={`${darkMode ? "dark bg-gray-900" : "bg-gray-100"} min-h-screen transition-colors duration-300`}>
      <Header />
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Profile Header */}
          <motion.div
            variants={cardVariants}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20"></div>
            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 p-1 shadow-xl"
              >
                <div className="bg-white dark:bg-gray-700 h-full w-full rounded-full flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-300">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-indigo-400 opacity-50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">{user.username}</h1>
                <p className="text-indigo-600 dark:text-indigo-300 mt-1">{user.role}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div
            className="flex space-x-4 sm:space-x-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto scrollbar-hide"
            variants={cardVariants}
          >
            {["profile", "settings", "activity"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 font-medium rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mt-6"
            >
              {activeTab === "profile" && (
                <motion.div variants={containerVariants} className="space-y-6">
                  <motion.div
                    variants={cardVariants}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                  >
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                      User Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{user.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{user.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{user.id}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                  >
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                      Account Statistics
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {["Posts", "Comments", "Followers", "Following"].map((stat, index) => (
                        <motion.div
                          key={stat}
                          whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                          className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center"
                        >
                          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                            {index * 12 + 5}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{stat}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={cardVariants} className="flex justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative overflow-hidden bg-red-600 text-white py-2 px-6 rounded-lg font-medium"
                      onClick={handleLogout}
                    >
                      <span className="relative z-10">LogOut</span>
                      <motion.span
                        className="absolute inset-0 bg-red-700"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 2, opacity: 0.3 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative overflow-hidden bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium"
                      onClick={() => setShowEditPopup(true)}
                    >
                      <span className="relative z-10">Edit Profile</span>
                      <motion.span
                        className="absolute inset-0 bg-indigo-700"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 2, opacity: 0.3 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  variants={cardVariants}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
                >
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Settings Page
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">Settings content will be displayed here</p>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  variants={cardVariants}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
                >
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Activity Log
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">User activity will be displayed here</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Edit Profile Popup */}
        <AnimatePresence>
          {showEditPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                variants={popupVariants}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Profile</h2>
                  <button
                    onClick={() => setShowEditPopup(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 p-3 rounded-lg mb-4 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 p-3 rounded-lg mb-4 text-sm"
                  >
                    {success}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                      Change Password
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Leave blank if you don't want to change your password
                    </p>

                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="mt-3">
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="mt-3">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowEditPopup(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={updateLoading}
                      className={`relative overflow-hidden px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium ${
                        updateLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      <span className="relative z-10">
                        {updateLoading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </span>
                      <motion.span
                        className="absolute inset-0 bg-indigo-700"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 2, opacity: 0.3 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </main>
  );
};

export default ProfileUserPage;