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
import Auth from "./Pages/Auth"; // Correct
// NOT: import { Auth } from './Pages/Auth';
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Order from "./Pages/Order";
import VerifyLogin from "./Pages/VerifyLogin";
import Dashboard from "./Pages/Admin/Dashboard";
import AddProduct from "./Pages/Admin/AddProduct";
import ProductDetail from "./Pages/ProductDetail";
import Profile from "./Pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
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
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/orders",
        element: <Order />,
      },
      {
        path: "/verify-login",
        element: <VerifyLogin />,
      },
      {
        path: "/admin/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/admin/add-product",
        element: <AddProduct />,
      },
      {
        path: "product/:id", // Dynamic route for single product
        element: <ProductDetail />,
      },
            {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
