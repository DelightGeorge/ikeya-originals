import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import App from "./App";
import AnimateIn from "./Pages/AnimateIn";
import PageLoader from "./Pages/PageLoader";
import ImageWithLoader from "./Pages/ImageWithLoader";
import Shop from "./Pages/Shop";
import Lookbook from "./Pages/Lookbook";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Auth from "./Pages/Auth";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Order from "./Pages/Order";
import VerifyLogin from "./Pages/VerifyLogin";
import Dashboard from "./Pages/Admin/Dashboard";
import AddProduct from "./Pages/Admin/AddProduct";
import ProductDetail from "./Pages/ProductDetail";
import Profile from "./Pages/Profile";
import ResetPassword from "./Pages/ResetPassword";
import AdminUsers from "./Pages/AdminUsers";
import PaymentCallback from "./Pages/PaymentCallback";
import OrderSuccess from "./Pages/OrderSuccess";
import ProtectedRoute from "./Components/ProtectedRoute"; // ← ADD THIS IMPORT

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // ============================================
      // PUBLIC ROUTES - No login required
      // ============================================
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/animatein",
        element: <AnimateIn />,
      },
      {
        path: "/pageloader",
        element: <PageLoader />,
      },
      {
        path: "/imagewithloader",
        element: <ImageWithLoader />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/lookbook",
        element: <Lookbook />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/login",
        element: <Auth />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/cart",
        element: <Cart />, // Cart is public - guests can view
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/verify-login",
        element: <VerifyLogin />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/payment-callback",
        element: <PaymentCallback />,
      },

      // ============================================
      // PROTECTED ROUTES - Login required
      // ============================================
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        ),
      },
      {
        path: "/order-success",
        element: (
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      // ============================================
      // ADMIN ONLY ROUTES
      // ============================================
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute adminOnly={true}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/add-product",
        element: (
          <ProtectedRoute adminOnly={true}>
            <AddProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute adminOnly={true}>
            <AdminUsers />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
