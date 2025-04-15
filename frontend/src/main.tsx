import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, RouteObject } from "react-router-dom";
import App from "./App";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { CartPage } from "./pages/client/CartPage.tsx";
import Homepage from "./pages/client/HomePage.tsx";
import SelectedProductPage from "./pages/client/SelectedProductPage.tsx";
import AboutPage from "./pages/client/AboutPage.tsx";
import Checkout from "./pages/client/CheckoutPage.tsx";
import OrderHistory from "./pages/client/OrderHistory.tsx";
import ProfileUserPage from "./pages/client/ProfileUserPage.tsx";
import CheckoutSelected from "./pages/client/CheckOutSelected.tsx";
import UserController from "./pages/server/UserController.tsx";
import ProductController from "./pages/server/ProductController.tsx";
import OrderHistoryController from "./pages/server/OrderController.tsx";
import ApprovedOrdersController from "./pages/server/DetailPemesanan.tsx";
import OrderDetailPage from "./pages/client/DetailOrder.tsx";

// Lazy loading
const Login = lazy(() => import("./pages/Login.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));

// User Pages
const ProductPage = lazy(() => import("./pages/client/ProductPage.tsx"));

// Admin Pages
const Admin = lazy(() => import("./pages/server/Admin.tsx"));
const Dashboard = lazy(() => import("./pages/server/Dashboard.tsx"));

/**
 * Router untuk USER
*/
const userRouter: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "user",
        element: <ProtectedRoute allowedRole="user" />,
        children: [
            { path: "homepage", element: <Homepage /> },
            { path: "products", element: <ProductPage /> },
            { path: "selected/:id", element: <SelectedProductPage /> },
            { path: "cart", element: <CartPage /> },
            { path: "checkout", element: <Checkout /> },
            { path: "selectedCheckout", element: <CheckoutSelected /> }, // ✅ Path benar
            { path: "history", element: <OrderHistory /> },
            { path: "about", element: <AboutPage /> },
            { path: "order-detail", element: <OrderDetailPage /> },
            { path: "profile", element: <ProfileUserPage /> },
        ],
      },
    ],
  },
];

/**
 * Router untuk ADMIN
*/
const adminRouter: RouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedRoute allowedRole="admin" />, // Proteksi admin
    children: [
      {
        index: true,
        element: <Admin />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "users",
        element: <UserController />
      },
      {
        path: "pdc",
        element: <ProductController />
      },
      {
        path: "detail-pemesanan-controller",
        element: <ApprovedOrdersController />
      },
      {
        path: "orderslist",
        element: <OrderHistoryController />
      },
    ],
  },
];

/**
 * Menggabungkan router
 */
const router = createBrowserRouter([...userRouter, ...adminRouter]);

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
