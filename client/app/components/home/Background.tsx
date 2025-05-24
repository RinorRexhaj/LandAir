import React, { useEffect, useRef, useState } from "react";

const Background = () => {
  const scrollY = useRef(0);
  const [transformStyles, setTransformStyles] = useState({
    topLeft: "translateY(0px)",
    bottomRight: "translateY(0px)",
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      scrollY.current = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const offset = scrollY.current;
          setTransformStyles({
            topLeft: `translateY(${offset * 0.2}px)`,
            bottomRight: `translateY(${-offset * 0.2}px)`,
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden -z-10">
      <div
        className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] md:w-[300px] md:h-[300px] bg-gradient-to-br from-blue-700 to-purple-700 opacity-5 rounded-full blur-3xl animate-gradient-shift"
        style={{ transform: transformStyles.topLeft }}
      />
      <div
        className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] md:w-[300px] md:h-[300px] bg-gradient-to-br from-purple-500 to-blue-500 opacity-5 rounded-full blur-3xl animate-gradient-shift"
        style={{ transform: transformStyles.bottomRight }}
      />
    </div>
  );
};

export default Background;
