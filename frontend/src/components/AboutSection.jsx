import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { services } from '../data/mockData';
import { Gamepad2, Palette, Award, Users, Sparkles } from 'lucide-react';

const iconMap = {
  Gamepad2,
  Palette,
  Award,
  Users
};

const ServiceCard = ({ service, language, index }) => {
  const IconComponent = iconMap[service.icon];
  const title = language === 'tr' ? service.titleTr : service.title;
  const description = language === 'tr' ? service.descriptionTr : service.description;

  return (
    <div 
      className="group relative p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-colors">
        <IconComponent className="w-7 h-7 text-cyan-400" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const AboutSection = () => {
  const { language, t } = useLanguage();

  return (
    <section id="about" className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <div className="relative order-2 lg:order-1">
            {/* Main Image Container */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl rotate-12 blur-xl" />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl -rotate-12 blur-xl" />
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700/50 backdrop-blur-sm">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/zjpsuaoj_Noctavian%20LOGO_light.png" 
                    alt="Noctavian Studio"
                    className="w-48 h-auto"
                  />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-2xl p-5 text-center border border-slate-700/30">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">15+</div>
                    <div className="text-sm text-slate-400 mt-1">{language === 'tr' ? 'Oyun Projesi' : 'Game Projects'}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl p-5 text-center border border-slate-700/30">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">3</div>
                    <div className="text-sm text-slate-400 mt-1">{language === 'tr' ? 'Platform' : 'Platforms'}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl p-5 text-center border border-slate-700/30">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">100%</div>
                    <div className="text-sm text-slate-400 mt-1">{language === 'tr' ? 'Tutku' : 'Passion'}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl p-5 text-center border border-slate-700/30">
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">24/7</div>
                    <div className="text-sm text-slate-400 mt-1">{language === 'tr' ? 'Yaratıcılık' : 'Creativity'}</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-2xl border border-slate-700/40 bg-slate-950/35 px-5 py-4 text-center text-sm text-slate-300">
                  {language === 'tr' ? (
                    <>
                      <a href="https://flagroom.studio" target="_blank" rel="noreferrer" aria-label="Flagroom Studio">
                        <img
                          src="/flagroom-logo-white.png"
                          alt="Flagroom Studio"
                          className="h-7 w-auto max-w-[160px] object-contain transition-opacity hover:opacity-80"
                        />
                      </a>
                      <span>yaratıcı girişimidir.</span>
                    </>
                  ) : (
                    <>
                      <span>A creative initiative by</span>
                      <a href="https://flagroom.studio" target="_blank" rel="noreferrer" aria-label="Flagroom Studio">
                        <img
                          src="/flagroom-logo-white.png"
                          alt="Flagroom Studio"
                          className="h-7 w-auto max-w-[160px] object-contain transition-opacity hover:opacity-80"
                        />
                      </a>
                    </>
                  )}
                </div>

              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 right-8 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl rotate-12 animate-bounce-slow shadow-lg shadow-orange-500/30" />
              <div className="absolute -bottom-4 left-8 w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg -rotate-12 animate-bounce-slow shadow-lg shadow-emerald-500/30" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            {/* Section Tag */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">{t('about.sectionTag')}</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t('about.title').split(',').map((part, index) => (
                <span key={index}>
                  {index === 0 ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{part}</span>
                  ) : (
                    <span className="text-white">{part}</span>
                  )}
                </span>
              ))}
            </h2>

            {/* Subtitle */}
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              {t('about.subtitle')}
            </p>

            {/* Services Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  language={language}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
