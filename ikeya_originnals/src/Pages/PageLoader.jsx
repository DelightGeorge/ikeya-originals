import { SyncLoader } from "react-spinners";
import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-999 bg-cream flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center">
        {/* Elegant Logo Mark */}
        <h1 className="text-3xl font-display font-bold text-plum tracking-[0.3em] uppercase mb-4">
          Ikeyà
        </h1>
        {/* The Spinner */}
        <SyncLoader color="#B76E79" size={10} margin={4} />
        <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-plum opacity-40">
          Loading Authenticity
        </p>
      </div>
    </motion.div>
  );
};

export default PageLoader;