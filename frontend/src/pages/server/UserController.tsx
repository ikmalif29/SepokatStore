import { useEffect, useState } from "react";
import { Users, Search, Eye, RefreshCw, Download, ChevronUp, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";
import SideBarAdmin from "../../components/SideBarAdmin";

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string;
}

const UserController: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchBy, setSearchBy] = useState<"username" | "email">("username");
    const [sortField, setSortField] = useState<keyof User>("username");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [usersPerPage] = useState<number>(6);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [animateSearch, setAnimateSearch] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(Array.isArray(data) ? data : [data]);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to load users. Please try again later.");
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search term, search field, and exclude admins
    const filteredUsers = users.filter(user => {
        // Filter out admin users
        if (user.role === "admin") return false;

        if (!searchTerm) return true;

        if (searchBy === "username") {
            return user.username.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            return user.email.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    // Sort users
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    // Get current users for pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSort = (field: keyof User) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    // Function to close modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    // Trigger search animation
    const triggerSearchAnimation = () => {
        setAnimateSearch(true);
        setTimeout(() => setAnimateSearch(false), 1000);
    };

    // Export users data to CSV
    const exportUsers = () => {
        // Create CSV content
        const headers = ["ID", "Username", "Email", "Role"];
        const csvContent = [
            headers.join(","),
            ...filteredUsers.map(user => [
                user.id,
                user.username,
                user.email,
                user.role
            ].join(","))
        ].join("\n");

        // Create and download the file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "users_export.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Empty state component
    const EmptyState = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center p-12 text-center"
        >
            <motion.div
                className="bg-gray-50 rounded-full p-4 mb-4"
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            >
                <Users size={48} className="text-indigo-500" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
            <p className="text-gray-500 mb-6 max-w-md">No results match your search criteria. Try adjusting your search or filter to find what you're looking for.</p>
            <motion.button
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg flex items-center space-x-2 hover:bg-indigo-600 transition-colors shadow-sm"
                onClick={() => {
                    setSearchTerm("");
                    setSearchBy("username");
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <RefreshCw size={16} />
                <span>Reset Search</span>
            </motion.button>
        </motion.div>
    );

    // Get role-specific styling
    const getRoleStyle = (role: string) => {
        switch (role) {
            case 'moderator':
                return 'bg-amber-100 text-amber-800';
            case 'editor':
                return 'bg-emerald-100 text-emerald-800';
            case 'viewer':
                return 'bg-cyan-100 text-cyan-800';
            case 'user':
                return 'bg-violet-100 text-violet-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    // Get user avatar gradient
    const getUserAvatarGradient = (username: string) => {
        // Simple hash function to determine consistent colors for users
        const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const gradients = [
            'from-pink-400 to-rose-600',
            'from-amber-400 to-orange-600',
            'from-emerald-400 to-teal-600',
            'from-cyan-400 to-sky-600',
            'from-violet-400 to-indigo-600',
            'from-fuchsia-400 to-purple-600'
        ];

        return gradients[hash % gradients.length];
    };

    return (
        <main>
            <SideBarAdmin />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-md p-6 max-w-6xl mx-auto my-8"
            >
                {/* Header section */}
                <motion.div
                    className="mb-8"
                    initial={{ x: -50 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                >
                    <div className="flex items-center mb-2">
                        <motion.div
                            className="bg-indigo-50 rounded-lg p-2 mr-3"
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Users className="h-6 w-6 text-indigo-600" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-gray-800">User Directory</h1>
                    </div>
                    <p className="text-gray-500 ml-11">View and search through all registered users</p>
                </motion.div>

                {/* Search and filter controls */}
                <motion.div
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <motion.div
                                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                animate={animateSearch ? {
                                    scale: [1, 1.5, 1],
                                    rotate: [0, 15, -15, 0],
                                    color: ["#9CA3AF", "#4F46E5", "#9CA3AF"]
                                } : {}}
                                transition={{ duration: 0.7 }}
                            >
                                <Search className="h-5 w-5 text-gray-400" />
                            </motion.div>
                            <motion.input
                                type="text"
                                placeholder={`Search by ${searchBy}...`}
                                className="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (e.target.value) triggerSearchAnimation();
                                }}
                                animate={animateSearch ? { boxShadow: ["0px 0px 0px rgba(79, 70, 229, 0)", "0px 0px 10px rgba(79, 70, 229, 0.5)", "0px 0px 0px rgba(79, 70, 229, 0)"] } : {}}
                                transition={{ duration: 0.7 }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <motion.select
                                value={searchBy}
                                onChange={(e) => setSearchBy(e.target.value as "username" | "email")}
                                className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <option value="username">Username</option>
                                <option value="email">Email</option>
                            </motion.select>
                            <motion.button
                                className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center space-x-2"
                                onClick={() => setSearchTerm("")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                >
                                    <RefreshCw size={18} />
                                </motion.div>
                                <span>Reset</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Table content */}
                <motion.div
                    className="overflow-hidden rounded-xl border border-gray-100 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    {loading ? (
                        <div className="flex justify-center items-center py-16 bg-white">
                            <motion.div
                                className="h-12 w-12 border-4 border-t-indigo-500 border-gray-200 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            ></motion.div>
                        </div>
                    ) : error ? (
                        <motion.div
                            className="bg-red-50 border-l-4 border-red-500 p-6 rounded"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center">
                                <div className="text-red-500">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-red-700 font-medium">{error}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : currentUsers.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("username")}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Username</span>
                                                {sortField === "username" && (
                                                    <motion.div
                                                        animate={{ rotate: sortDirection === "asc" ? 0 : 180 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ChevronUp size={16} />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("email")}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Email</span>
                                                {sortField === "email" && (
                                                    <motion.div
                                                        animate={{ rotate: sortDirection === "asc" ? 0 : 180 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ChevronUp size={16} />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("role")}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Role</span>
                                                {sortField === "role" && (
                                                    <motion.div
                                                        animate={{ rotate: sortDirection === "asc" ? 0 : 180 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ChevronUp size={16} />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {currentUsers.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            className="hover:bg-indigo-50 transition-colors"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getUserAvatarGradient(user.username)} flex items-center justify-center text-white font-medium`}>
                                                            {user.username.substring(0, 2).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                        <div className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleStyle(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                                                    title="View Details"
                                                    onClick={() => handleViewUser(user)}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Pagination */}
                {!loading && !error && filteredUsers.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-500">
                            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                        </div>
                        <div className="flex items-center space-x-1">
                            <button
                                className={`px-3 py-1.5 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-1.5 rounded-md ${currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                className={`px-3 py-1.5 rounded-md ${currentPage === Math.ceil(filteredUsers.length / usersPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => currentPage < Math.ceil(filteredUsers.length / usersPerPage) && paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Export data button */}
                {!loading && !error && filteredUsers.length > 0 && (
                    <div className="mt-6 flex justify-end">
                        <button
                            className="px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 rounded-lg flex items-center space-x-2 hover:from-indigo-100 hover:to-purple-100 transition-colors"
                            onClick={exportUsers}
                        >
                            <Download size={18} />
                            <span>Export Data</span>
                        </button>
                    </div>
                )}

                {/* User Detail Modal */}
                {showModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            {/* Modal header */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white flex justify-between items-center">
                                <h3 className="text-lg font-semibold">User Details</h3>
                                <button onClick={closeModal} className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* User info */}
                            <div className="p-6">
                                <div className="flex items-center mb-6">
                                    <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${getUserAvatarGradient(selectedUser.username)} flex items-center justify-center text-white text-xl font-medium`}>
                                        {selectedUser.username.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-xl font-semibold text-gray-800">{selectedUser.username}</h4>
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mt-1 ${getRoleStyle(selectedUser.role)}`}>
                                            {selectedUser.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="border-b border-gray-100 pb-3">
                                        <p className="text-sm text-gray-500 mb-1">User ID</p>
                                        <p className="text-gray-800 font-medium">{selectedUser.id}</p>
                                    </div>
                                    <div className="border-b border-gray-100 pb-3">
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <p className="text-gray-800 font-medium">{selectedUser.email}</p>
                                    </div>
                                    <div className="pt-3">
                                        <p className="text-sm text-gray-500 mb-1">Role</p>
                                        <p className="text-gray-800 font-medium capitalize">{selectedUser.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </main>
    );
};

export default UserController;