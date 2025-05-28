import { useThemeStore } from "@/app/store/useThemeStore";
import {
  faBars,
  faCopyright,
  faEnvelope,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

const Generating = () => {
  const { darkMode } = useThemeStore();
  const [textShow, setTextShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setTextShow(true), 1800);
  });

  return (
    <div className="relative w-10/12 h-3/4 mx-auto mt-10 border rounded-xl overflow-hidden">
      <div
        className={`w-full flex items-center justify-between text-2xl px-6 py-4`}
      >
        <FontAwesomeIcon
          icon={faHome}
          className="animate-slideIn [animation-fill-mode:backwards]"
          style={{
            animationDelay: "0.3s",
          }}
        />
        <FontAwesomeIcon
          icon={faBars}
          className="animate-slideDown [animation-fill-mode:backwards]"
          style={{
            animationDelay: "0.5s",
          }}
        />
      </div>
      <div
        className="h-px bg-gray-400 animate-sliding [animation-fill-mode:backwards]"
        style={{
          animationDelay: "0.6s",
        }}
      ></div>
      <div
        className="h-full flex justify-center items-center bg-white animate-stretch [animation-fill-mode:backwards]"
        style={{
          animationDelay: "1.4s",
        }}
      ></div>
      {textShow && (
        <div className="absolute top-44 w-full flex justify-center text-2xl font-bold text-zinc-900 overflow-hidden">
          {"Creating Dream Site...".split("").map((char, index) => (
            <span
              className="animate-textReveal [animation-fill-mode:backwards]"
              style={{ animationDelay: `${index * 0.025}s` }}
              key={`${char}-${index}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      )}
      <div
        className={`w-full absolute flex justify-between items-center px-6 bottom-0 h-14 z-40 ${
          darkMode ? "bg-zinc-900" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <svg
            className="w-6 h-6 animate-slideIn [animation-fill-mode:backwards]"
            style={{
              animationDelay: "2.2s",
            }}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
          </svg>{" "}
          <svg
            className="w-7 h-7 -ml-1 animate-slideIn [animation-fill-mode:backwards]"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{
              animationDelay: "2.3s",
            }}
          >
            <path d="M7.75 2C4.6 2 2 4.6 2 7.75v8.5C2 19.4 4.6 22 7.75 22h8.5C19.4 22 22 19.4 22 16.25v-8.5C22 4.6 19.4 2 16.25 2h-8.5zM4 7.75C4 5.68 5.68 4 7.75 4h8.5C18.32 4 20 5.68 20 7.75v8.5c0 2.07-1.68 3.75-3.75 3.75h-8.5C5.68 20 4 18.32 4 16.25v-8.5z" />
            <path d="M12 7.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5zm0 7.5a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5z" />
            <circle cx="17.5" cy="6.5" r="1.5" />
          </svg>
          <FontAwesomeIcon
            icon={faEnvelope}
            className="h-6 animate-slideIn [animation-fill-mode:backwards]"
            style={{
              animationDelay: "2.4s",
            }}
          />{" "}
        </div>
        <FontAwesomeIcon
          icon={faCopyright}
          className="h-6 animate-slideIn [animation-fill-mode:backwards]"
          style={{
            animationDelay: "2.5s",
          }}
        />
      </div>
    </div>
  );
};

export default Generating;
