import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home';
import App from './App';
import AnimateIn from './Pages/AnimateIn';
import PageLoader from './Pages/PageLoader';
import ImageWithLoader from './Pages/ImageWithLoader';
import Shop from './Pages/Shop';
import Lookbook from './Pages/Lookbook';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Auth from './Pages/Auth';
import Cart from './Pages/Cart';



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


      

    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
