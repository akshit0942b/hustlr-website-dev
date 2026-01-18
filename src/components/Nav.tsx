import React, { useState } from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

const links = [
  { href: "/", label: "home" },

  { href: "/top5", label: "top 5%" },
  { href: "/get-started", label: "get started" },
];

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-[#101010] font-serif">
        <Link
          href="/"
          className=" font-serif text-xl sm:text-2xl tracking-tight text-white"
        >
          hustlr.
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {links.map((link, i) => (
            <Link
              href={link.href}
              key={i}
              className="text-white/90 hover:text-white border-b border-black hover:border-white  transition-all text-lg font-normal"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden text-white/80 hover:text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Nav;
