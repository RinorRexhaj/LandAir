"use client";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { handleScroll } from "../utils/Scroll";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const links = ["Features", "How it Works", "Pricing", "Get Started"];

const Navbar: React.FC = () => {
  const [activeLink, setActiveLink] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mainPage, setMainPage] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (window.location.href !== process.env.NEXT_PUBLIC_URL) {
      setMainPage(false);
    }
  }, [setMainPage]);

  useEffect(() => {
    const handleScrollEvent = () => {
      // Update scrolled state
      setScrolled(window.scrollY > 100);

      // Find the current active section
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      let currentSection = "";

      for (const link of links) {
        const sectionId = link.toLowerCase().replace(/\s+/g, "-");
        const section = document.getElementById(sectionId);

        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = link;
            break;
          }
        }
      }

      // If we're at the top of the page, set active to empty
      if (window.scrollY < 100) {
        currentSection = "";
      }

      // Only update if the active section has changed
      if (currentSection !== activeLink) {
        setActiveLink(currentSection);
      }
    };

    // Initial check
    handleScrollEvent();

    // Add scroll event listener
    window.addEventListener("scroll", handleScrollEvent);

    // Cleanup
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, [activeLink]);

  const scroll = (id: string) => {
    if (!mainPage) {
      router.push("/");
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      handleScroll(element);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`w-screen py-4 fixed top-0 left-0 z-50 font-orbitron transition-all text-white duration-300 ${
        scrolled
          ? "bg-white/5 backdrop-blur-md shadow-md border-b border-white/10"
          : "bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="w-11/12 max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={(e) => {
            e.preventDefault();
            scroll("hero");
          }}
          className="flex items-center gap-2"
        >
          <Image
            src={"/icons/favicon-120x120.png"}
            alt="LandAir"
            width={32}
            height={32}
            className="animate-fade [animation-fill-mode:backwards]"
            style={{
              animationDelay: "0.25s",
            }}
          />
          <h1
            className="flex text-3xl md:text-2xl font-semibold overflow-hidden"
            aria-label="LandAir logo"
          >
            {"LandAir".split("").map((char, index) => (
              <p
                className="animate-textReveal [animation-fill-mode:backwards]"
                style={{ animationDelay: `${index * 0.1}s` }}
                key={`${char}-${index}`}
              >
                {char === " " ? "\u00A0" : char}
              </p>
            ))}
          </h1>
        </button>

        {/* Desktop Links */}
        {mainPage && (
          <ul className="md:hidden flex items-center font-medium gap-1">
            {links.map((link, index) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scroll(link.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  className={`cursor-pointer transition text-lg animate-slideIn p-2 px-4 hover:bg-gray-600 rounded-md [animation-fill-mode:backwards] ${
                    activeLink === link
                      ? "text-meta-5 bg-gray-500/80"
                      : "hover:text-meta-5"
                  }`}
                  style={{ animationDelay: `${index * 0.3 + 0.1}s` }}
                  aria-current={activeLink === link ? "page" : undefined}
                  title={`Go to ${link} section`}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Link
            href={"/sign-up"}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition animate-slideDown [animation-fill-mode:backwards]"
            style={{
              animationDelay: "0.8s",
            }}
          >
            Sign Up
          </Link>
          {mainPage && (
            <button
              className="hidden md:block animate-fade [animation-fill-mode:backwards]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile navigation menu"
              title="Toggle menu"
              style={{
                animationDelay: "1s",
              }}
            >
              {isMobileMenuOpen ? (
                <FontAwesomeIcon className="w-7 h-7" icon={faXmark} />
              ) : (
                <FontAwesomeIcon className="w-7 h-7" icon={faBars} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && mainPage && (
        <ul className="hidden md:flex mt-4 px-6 py-4 flex-col space-y-4 text-sm font-medium bg-white/5 backdrop-blur-sm border-t border-white/10 animate-fade [animation-fill-mode:backwards]">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={(e) => {
                  e.preventDefault();
                  scroll(link.toLowerCase().replace(/\s+/g, "-"));
                }}
                className={`cursor-pointer py-2 px-3 rounded-lg text-lg ${
                  activeLink === link
                    ? "text-meta-5 bg-gray-600"
                    : "hover:text-meta-5"
                }`}
                aria-current={activeLink === link ? "page" : undefined}
                title={`Go to ${link} section`}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
