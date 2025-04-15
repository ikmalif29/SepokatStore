import { useState, useEffect } from "react";
import SideBarAdmin from "../../components/SideBarAdmin";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement, RadialLinearScale } from 'chart.js';
import { Doughnut, Bar, Line, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement, RadialLinearScale);

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Mouse follower effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Data dashboard
  const dashboardData = {
    products: 120,
    users: 85,
    orders: 45,
    revenue: 15680,
    growth: 24.8,
    visitors: 1458
  };

  // Data untuk Doughnut Chart
  const doughnutData = {
    labels: ['Products', 'Users', 'Orders'],
    datasets: [{
      data: [dashboardData.products, dashboardData.users, dashboardData.orders],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: 'rgba(255, 255, 255, 0.6)',
      borderWidth: 2,
      hoverOffset: 15,
      hoverBorderColor: '#ffffff',
      hoverBorderWidth: 4,
    }],
  };

  // Data untuk Bar Chart
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Order Trends',
      data: [20, 30, 45, 60, 50, 70],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(139, 92, 246, 0.7)',
        'rgba(236, 72, 153, 0.7)'
      ],
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 1,
      borderRadius: 8,
      hoverBackgroundColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(236, 72, 153, 1)'
      ],
    }],
  };

  // Data untuk Line Chart
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue ($)',
      data: [1200, 1900, 3000, 5400, 8600, 15680],
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      borderColor: 'rgba(59, 130, 246, 1)',
      tension: 0.4,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#3B82F6',
      pointRadius: 6,
      pointHoverRadius: 10,
    }],
  };

  // Data untuk Radar Chart
  const radarData = {
    labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency', 'Design'],
    datasets: [{
      label: 'Product Ratings',
      data: [90, 85, 95, 80, 88, 92],
      backgroundColor: 'rgba(139, 92, 246, 0.4)',
      borderColor: 'rgba(139, 92, 246, 1)',
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#8B5CF6',
      pointRadius: 5,
      pointHoverRadius: 8,
    }],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Poppins', sans-serif"
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        titleFont: {
          size: 16,
          weight: 'bold',
          family: "'Poppins', sans-serif"
        },
        bodyFont: {
          size: 14,
          family: "'Poppins', sans-serif"
        },
        borderWidth: 1,
        padding: 15,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(255, 255, 255, 0.08)',
          borderDash: [5, 5] 
        },
        ticks: { 
          color: 'rgba(255, 255, 255, 0.7)',
          font: { family: "'Poppins', sans-serif", size: 12 },
          padding: 10
        }
      },
      x: {
        grid: { 
          color: 'rgba(255, 255, 255, 0.08)',
          borderDash: [5, 5]
        },
        ticks: { 
          color: 'rgba(255, 255, 255, 0.7)',
          font: { family: "'Poppins', sans-serif", size: 12 },
          padding: 10
        }
      },
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.15)' },
        grid: { color: 'rgba(255, 255, 255, 0.15)' },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.9)',
          font: { family: "'Poppins', sans-serif", size: 12 }
        },
        ticks: {
          backdropColor: 'transparent',
          color: 'rgba(255, 255, 255, 0.7)',
          font: { family: "'Poppins', sans-serif", size: 10 }
        }
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 } 
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, y: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 20 } 
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: { 
      opacity: 1, y: 0, rotateX: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 15 } 
    },
    hover: { 
      scale: 1.03, rotateY: 5, 
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
      transition: { type: 'spring', stiffness: 400, damping: 10 } 
    },
    tap: { scale: 0.98, rotateY: 0 }
  };

  const iconContainerVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    tap: { scale: 0.9, transition: { duration: 0.1 } }
  };

  const floatingIconVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  // Load data effect
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  // Stat Card Component
  const StatCard = ({ title, value, icon, color, trend, percentage, description }) => {
    // Extract color name for icon
    const getColorClass = (gradientClass) => {
      const colorMap = {
        'from-green-400': 'text-green-400',
        'from-blue-400': 'text-blue-400',
        'from-red-400': 'text-red-400',
        'from-yellow-400': 'text-yellow-400', 
        'from-purple-400': 'text-purple-400',
        'from-pink-400': 'text-pink-400'
      };
      
      // Find the matching color class
      for (const [key, value] of Object.entries(colorMap)) {
        if (gradientClass.includes(key)) {
          return value;
        }
      }
      
      return 'text-blue-400'; // Default fallback
    };
    
    const iconColorClass = getColorClass(color);
    
    return (
      <motion.div 
        className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 overflow-hidden relative group"
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
        onMouseEnter={() => setHoveredCard(title)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Background pulse effect */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-2xl`}
          variants={pulseVariants}
          animate="animate"
        />
        
        {/* Card content */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>
          <motion.div 
            className="p-3 rounded-full bg-white/10"
            variants={iconContainerVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
          >
            <motion.div
              variants={floatingIconVariants}
              animate="animate"
              className={iconColorClass}
            >
              {icon}
            </motion.div>
          </motion.div>
        </div>
        
        <div className="flex items-end gap-3 mb-1">
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <div className={`flex items-center mb-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {trend === 'up' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9a1 1 0 01-1-1V6a1 1 0 011-1h2a1 1 0 011 1v1zm-6 6a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1zm8-6a1 1 0 00-1 1v4a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 01-1 1H9a1 1 0 01-1-1v-1a1 1 0 011-1h2a1 1 0 011 1v1zm-6-6a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H7a1 1 0 01-1-1V7zm8 6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1v-1z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm font-medium ml-1">{percentage}%</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-400 text-sm">{description}</p>
        
        {/* Interactive hover reflection effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)",
            borderRadius: "16px"
          }}
        />
      </motion.div>
    );
  };

  // Chart Card Component
  const ChartCard = ({ title, description, chartType, data, height = "h-72" }) => {
    return (
      <motion.div 
        className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 overflow-hidden relative group"
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        {description && <p className="text-gray-400 text-sm mb-4">{description}</p>}
        
        <div className={`${height} w-full relative`}>
          {chartType === "doughnut" && <Doughnut data={data} options={chartOptions} />}
          {chartType === "bar" && <Bar data={data} options={chartOptions} />}
          {chartType === "line" && <Line data={data} options={chartOptions} />}
          {chartType === "radar" && <Radar data={data} options={chartOptions} />}
          
          {/* Interactive glow effect on hover */}
          <motion.div 
            className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
            animate={{
              boxShadow: hoveredCard === title 
                ? "0 0 30px rgba(255, 255, 255, 0.2)" 
                : "0 0 0px rgba(255, 255, 255, 0)",
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Decorative element */}
        <motion.div 
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    );
  };

  return (
    <main 
      className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white min-h-screen"
      onMouseMove={handleMouseMove}
    >
      <SideBarAdmin />

      <div className="flex-1 p-6 md:p-8 overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <AnimatePresence>
          {isLoaded ? (
            <motion.div
              className="container mx-auto relative z-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Header with animated gradient text */}
              <motion.div
                variants={headerVariants}
                className="text-center mb-12"
              >
                <motion.h1 
                  className="text-5xl font-extrabold mb-2"
                  style={{
                    background: "linear-gradient(to right, #10B981, #3B82F6, #8B5CF6, #EC4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundSize: "200% auto",
                  }}
                  animate={{
                    backgroundPosition: ['0% center', '200% center'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear"
                  }}
                >
                  Dashboard Admin
                </motion.h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                  Overview statistik dan performa terkini, diupdate secara real-time untuk membantu pengambilan keputusan yang lebih baik.
                </p>
              </motion.div>

              {/* Main dashboard content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Statistical Cards */}
                <StatCard 
                  title="Products" 
                  value={dashboardData.products} 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  }
                  color="from-green-400 to-green-600" 
                  trend="up" 
                  percentage="12" 
                  description="Total produk tersedia" 
                />
                
                <StatCard 
                  title="Users" 
                  value={dashboardData.users} 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                  color="from-blue-400 to-blue-600" 
                  trend="up" 
                  percentage="8.5" 
                  description="Total pengguna terdaftar" 
                />
                
                <StatCard 
                  title="Orders" 
                  value={dashboardData.orders} 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  }
                  color="from-red-400 to-red-600" 
                  trend="down" 
                  percentage="3.2" 
                  description="Total pemesanan" 
                />
                
                <StatCard 
                  title="Revenue" 
                  value={`$${dashboardData.revenue.toLocaleString()}`} 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  color="from-yellow-400 to-yellow-600" 
                  trend="up" 
                  percentage="24.8" 
                  description="Pendapatan bulan ini" 
                />
                
                <StatCard 
                  title="Growth" 
                  value={`${dashboardData.growth}%`} 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                  color="from-purple-400 to-purple-600" 
                  trend="up" 
                  percentage="5.4" 
                  description="Pertumbuhan tahunan" 
                />
                
                <StatCard 
                  title="Visitors" 
                  value={dashboardData.visitors.toLocaleString()} 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  }
                  color="from-pink-400 to-pink-600" 
                  trend="up" 
                  percentage="18.3" 
                  description="Pengunjung situs" 
                />

                {/* Charts */}
                <div className="col-span-1 md:col-span-2">
                  <ChartCard 
                    title="Revenue Analytics" 
                    description="Trend pendapatan 6 bulan terakhir dengan proyeksi pertumbuhan"
                    chartType="line" 
                    data={lineData} 
                    height="h-80"
                  />
                </div>

                <div className="col-span-1">
                  <ChartCard 
                    title="Distribution" 
                    description="Perbandingan data utama"
                    chartType="doughnut" 
                    data={doughnutData}
                    height="h-80" 
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <ChartCard 
                    title="Monthly Orders" 
                    description="Statistik pemesanan bulanan dengan tren perubahan"
                    chartType="bar" 
                    data={barData}
                    height="h-80" 
                  />
                </div>

                <div className="col-span-1">
                  <ChartCard 
                    title="Product Ratings" 
                    description="Evaluasi performa produk berdasarkan kriteria utama"
                    chartType="radar" 
                    data={radarData}
                    height="h-80" 
                  />
                </div>
              </div>

              {/* Footer */}
              <motion.div 
                className="mt-12 text-center text-gray-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: { delay: 1.5, duration: 0.8 }
                }}
              >
                <p>Dashboard diperbarui terakhir: {new Date().toLocaleString()}</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="flex justify-center items-center h-screen"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              <motion.div 
                className="flex flex-col items-center"
                animate={{ scale: [0.9, 1, 0.9] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
              >
                <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-xl font-medium text-blue-400">Loading Dashboard...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Dashboard;