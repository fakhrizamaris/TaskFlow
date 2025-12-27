'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
}

export function Navbar({ isLoggedIn }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // navbar height offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { label: 'Fitur', href: 'features' },
    { label: 'Cara Kerja', href: 'how-it-works' },
    { label: 'Testimonial', href: 'testimonials' },
  ];

  return (
    <header className={`navbar-blur fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group z-50">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img src="/favicon.png" alt="Flerro Logo" className="relative h-7 w-7" />
          </div>
          <span className="text-xl font-bold gradient-text-glow">Flerro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.href} href={`#${link.href}`} onClick={(e) => handleNavClick(e, link.href)} className="nav-link text-sm text-zinc-400 hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-glow rounded-full px-5 py-2 text-sm font-medium text-white flex items-center gap-2">
              Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-2">
                Masuk
              </Link>
              <Link href="/login" className="btn-glow rounded-full px-5 py-2 text-sm font-medium text-white">
                Mulai Gratis
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden relative z-50 p-2 text-zinc-100 hover:text-white transition-colors cursor-pointer" aria-label="Toggle menu">
          <div className="relative w-6 h-6 flex items-center justify-center">
            <Menu className={`w-6 h-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
            <X className={`w-6 h-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
          </div>
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl transition-all duration-500 md:hidden flex flex-col items-center justify-center ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        >
          <div className={`flex flex-col items-center gap-8 w-full max-w-sm px-6 transition-all duration-500 delay-100 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col items-center gap-6 w-full">
              {navLinks.map((link, index) => (
                <a key={link.href} href={`#${link.href}`} onClick={(e) => handleNavClick(e, link.href)} className="text-2xl font-medium text-zinc-400 hover:text-white transition-colors w-full text-center py-2">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

            {/* Mobile CTA Buttons */}
            <div className="flex flex-col items-center gap-4 w-full">
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-glow w-full rounded-full py-3 text-base font-medium text-white flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  Dashboard <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-glow w-full rounded-full py-3 text-base font-medium text-white text-center" onClick={() => setIsMenuOpen(false)}>
                    Mulai Gratis
                  </Link>
                  <Link href="/login" className="text-base font-medium text-zinc-400 hover:text-white transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                    Masuk
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
