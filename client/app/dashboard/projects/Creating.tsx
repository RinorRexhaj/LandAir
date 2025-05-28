import { useThemeStore } from "@/app/store/useThemeStore";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Creating = () => {
  const { darkMode } = useThemeStore();
  return (
    <div className="col-span-full flex flex-col items-center justify-center h-full mt-20 py-20 px-4 rounded-xl">
      <div className="relative flex items-center justify-center mb-28">
        {[
          { angle: 0, distance: 50, size: 72 },
          { angle: 120, distance: 40, size: 96 },
          { angle: 240, distance: 50, size: 80 },
        ].map((gear, index) => (
          <div
            key={"creating-gear-" + index}
            className="absolute rounded-full"
            style={{
              rotate: `${gear.angle}deg`,
              transform: `translateX(${gear.distance}px)`,
            }}
          >
            <FontAwesomeIcon
              icon={faGear}
              key={"gear" + index}
              spin
              style={{
                width: `${gear.size}px`,
                height: `${gear.size}px`,
              }}
            />
          </div>
        ))}
      </div>
      <h3
        className={`text-xl font-medium mb-2 ${
          darkMode ? "text-white" : "text-zinc-900"
        }`}
      >
        Creating your project
      </h3>
    </div>
  );
};

export default Creating;
