import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';



import Navbar from './Shared/Navbar';
import Footer from './Shared/Footer';
import PageLoader from './Pages/PageLoader';
import ScrollToTop from './Pages/ScrollToTop';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // This simulates the initial load of the brand assets
    // You can also set this to false when your actual API data is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-cream min-h-screen flex flex-col font-body antialiased">
      {/* 1. Global Page Loader */}
      <AnimatePresence mode="wait">
        {isLoading && <PageLoader key="loader" />}
      </AnimatePresence>

      {/* 2. Main Content - Only show when not loading for a clean entrance */}
      {!isLoading && (
        <>
          <ScrollToTop /> {/* Ensures page starts at top on route change */}

          
          <main className="grow">
            <AnimatePresence mode="wait">
              {/* The key ensures animations trigger when switching pages */}
              <div key={location.pathname}>
                <Outlet />
              </div>
            </AnimatePresence>
          </main>
        </>
      )}
    </div>
  );
}

export default App;