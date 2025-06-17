import { useState, useEffect } from "react";
import Logo from "../common/Logo";

const NotFound = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    setStartAnimation(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: (e.clientX * 100) / window.innerWidth,
          y: (e.clientY * 100) / window.innerHeight,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDragging]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-20 bg-blue-500 ${
              startAnimation ? "animate-pulse" : ""
            }`}
            style={{
              width: `${Math.random() * 10 + 2}rem`,
              height: `${Math.random() * 10 + 2}rem`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${Math.random() * 5 + 3}s`,
            }}
          />
        ))}
      </div>

      {/* Draggable 404 element */}
      <div
        className="absolute text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 cursor-move transform -translate-x-1/2 -translate-y-1/2 select-none z-10"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          textShadow: "0 0 15px rgba(156, 39, 176, 0.5)",
        }}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        404
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4">
        <Logo
          variant="error"
          size="lg"
          color="white"
          className="mb-6"
          noLink={true}
        />
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl mb-8 text-gray-300">
          Oops! The page you're looking for seems to have wandered off.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-lg transition-colors duration-300"
          >
            Go Back
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-lg text-lg transition-all duration-300"
          >
            Return Home
          </a>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-6 text-sm text-gray-400">
        <span className="animate-pulse">
          Psst! Try dragging the "404" around
        </span>
      </div>
    </div>
  );
};

export default NotFound;
