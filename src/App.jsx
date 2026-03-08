import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import PageLoader from './Pages/PageLoader';
import ScrollToTop from './Pages/ScrollToTop';
import { CartProvider } from './Context/CartContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CartProvider>
      <div className="bg-white min-h-screen flex flex-col font-body antialiased selection:bg-amber-900 selection:text-white">
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#000',
              color: '#fff',
              borderRadius: '0px',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            },
          }} 
        />
        
        <AnimatePresence mode="wait">
          {isLoading && <PageLoader key="loader" />}
        </AnimatePresence>

        {!isLoading && (
          <>
            <ScrollToTop />
            <main className="grow">
              <AnimatePresence mode="wait">
                {/* The motion div here ensures smooth page transitions 
                  between your protected and public routes 
                */}
                <div key={location.pathname}>
                  <Outlet />
                </div>
              </AnimatePresence>
            </main>
          </>
        )}
      </div>
    </CartProvider>
  );
}

export default App;