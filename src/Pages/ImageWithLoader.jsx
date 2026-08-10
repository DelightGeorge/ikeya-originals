import { useState } from 'react';
import { PulseLoader } from 'react-spinners';

const ImageWithLoader = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full bg-amber-50/40 flex items-center justify-center overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <PulseLoader color="#92400e" size={8} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-all duration-700 ease-out ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default ImageWithLoader;