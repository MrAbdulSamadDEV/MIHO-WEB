import React, { useState } from 'react';
import { Menu, X, Smartphone, BookOpen } from 'lucide-react';

export default function Navbar({ onOpenDownload, onOpenDocs, onOpenRemote }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Product', href: '#product' },
    { name: 'Capabilities', href: '#capabilities' },
    { name: 'Technology', href: '#technology' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header className="top">
      <div className="wrap nav">
        {/* Brand */}
        <a className="brand text-white" href="#home">
          MIHO
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex links">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href}>
              {link.name}
            </a>
          ))}
          <button
            onClick={onOpenDocs}
            className="text-inherit hover:text-white transition-colors cursor-pointer text-xs"
          >
            Documentation
          </button>
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenDownload}
            className="cta"
          >
            DOWNLOAD MIHO ↗
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#aaa] hover:text-white cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050505] border-b border-[#242424] px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-3 text-sm text-[#bbb]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDocs();
              }}
              className="py-1 text-left text-inherit hover:text-white transition-colors cursor-pointer"
            >
              Documentation
            </button>
          </nav>

          <div className="pt-4 border-t border-[#242424] flex flex-col gap-3">
            {/* Mobile Remote Connection Entry Point */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenRemote) onOpenRemote();
              }}
              className="w-full py-2.5 px-4 rounded border border-[#333] bg-[#111] text-xs font-mono text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Remote Connection (Mobile Only)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDownload();
              }}
              className="cta w-full justify-center text-center"
            >
              DOWNLOAD MIHO ↗
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
