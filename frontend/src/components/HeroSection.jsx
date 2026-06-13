import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();

  // Smooth scroll function with easing
  const smoothScrollTo = (targetPosition, duration = 800) => {
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
  };

  const scrollToGames = () => {
    const element = document.getElementById('games');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      smoothScrollTo(offsetPosition, 800);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">{t('hero.tagline')}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {t('hero.title').split(' ').map((word, index) => (
                <span 
                  key={index}
                  className={index % 2 === 0 ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'}
                >
                  {word}{' '}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* CTA Button */}
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={scrollToGames}
                className="group inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
              >
                <span>{t('hero.cta')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Content - Logo Animation */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl scale-150 animate-pulse" />
              
              {/* Logo */}
              <div className="relative z-10 animate-float-slow">
                <img 
                  src="https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/zjpsuaoj_Noctavian%20LOGO_light.png" 
                  alt="Noctavian Studio" 
                  className="w-80 h-auto drop-shadow-2xl"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl rotate-12 animate-bounce-slow shadow-lg shadow-cyan-500/30" />
              <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl -rotate-12 animate-bounce-slow shadow-lg shadow-purple-500/30" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 -right-16 w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg rotate-45 animate-bounce-slow shadow-lg shadow-orange-500/30" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-slate-400 rounded-full animate-scroll" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
