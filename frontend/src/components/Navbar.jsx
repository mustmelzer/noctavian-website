import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll function with easing
  const smoothScrollTo = useCallback((targetPosition, duration = 800) => {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const easeInOutCubic = (t) => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition + distance * easeProgress);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      smoothScrollTo(offsetPosition, 800);
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'games', label: t('nav.games') },
    { id: 'collaborative', label: t('nav.collaborative') },
    { id: 'about', label: t('nav.about') },
    { id: 'contact', label: t('nav.contact') }
  ];

  // Light logo for dark background, dark logo for white background
  const logoSrc = isScrolled 
    ? "https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/itz8y3db_Noctavian%20LOGO%20dark_yatay.png"
    : "https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/lrhblok5_Noctavian%20LOGO_yatay.png";

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => scrollToSection('home')}>
            <img 
              src={logoSrc} 
              alt="Noctavian Studio" 
              className="h-10 w-auto transition-all duration-300"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`transition-colors duration-200 font-medium ${
                  isScrolled 
                    ? 'text-slate-700 hover:text-slate-900' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className={`flex items-center space-x-2 px-3 py-2 transition-colors rounded-full ${
                isScrolled 
                  ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe size={20} />
              <span className="text-sm font-medium uppercase">{language}</span>
            </button>

            {/* CTA Button */}
            <button 
              onClick={() => scrollToSection('games')}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
            >
              {t('hero.cta')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className={`p-2 transition-colors ${
                isScrolled ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe size={20} />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-colors ${
                isScrolled ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-4 py-4 space-y-2 ${
          isScrolled ? 'bg-white' : 'bg-slate-900/95 backdrop-blur-md'
        }`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                isScrolled 
                  ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={() => scrollToSection('games')}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full"
          >
            {t('hero.cta')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
