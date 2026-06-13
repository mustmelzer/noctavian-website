import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { Instagram, Linkedin, ArrowUp } from 'lucide-react';

// X (Twitter) Icon Component
const XIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  const { language, t } = useLanguage();
  const { contactInfo } = useSiteContent();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'about', label: t('nav.about') },
    { id: 'games', label: t('nav.games') },
    { id: 'contact', label: t('nav.contact') }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <img 
              src="https://customer-assets.emergentagent.com/job_design-clone-55/artifacts/lrhblok5_Noctavian%20LOGO_yatay.png" 
              alt="Noctavian Studio"
              className="h-12 w-auto mb-6"
            />
            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
              {t('footer.tagline')}
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href={contactInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a 
                href={contactInfo.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-300"
              >
                <XIcon size={16} />
              </a>
              <a 
                href={contactInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">{language === 'tr' ? 'Hızlı Linkler' : 'Quick Links'}</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">{language === 'tr' ? 'İletişim' : 'Contact'}</h3>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-cyan-400 transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contactInfo.phone}`} className="hover:text-cyan-400 transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li>{language === 'tr' ? contactInfo.addressTr : contactInfo.address}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            {t('footer.copyright')}
          </p>
          
          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 p-3 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white hover:bg-cyan-500/20 transition-all duration-300"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
