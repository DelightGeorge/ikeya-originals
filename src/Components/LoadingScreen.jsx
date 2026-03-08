import { Loader2 } from "lucide-react";

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-amber-900 mb-4" size={32} />
      <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold">
        {message}
      </p>
    </div>
  );
};

export default LoadingScreen;
