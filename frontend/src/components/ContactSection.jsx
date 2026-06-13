import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { submitContactMessage } from '../services/contentService';
import { Mail, Phone, MapPin, Send, Sparkles, Instagram, Linkedin } from 'lucide-react';

// X (Twitter) Icon Component
const XIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ContactSection = () => {
  const { language, t } = useLanguage();
  const { contactInfo } = useSiteContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      submitContactMessage(formData).catch((error) => {
        console.error('Supabase message storage error:', error);
      });

      // Send to Formspree - emails go to noctavianstudio@gmail.com
      const response = await fetch('https://formspree.io/f/xnjnnbvn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
    
    setIsSubmitting(false);
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">{t('contact.sectionTag')}</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('contact.title').split(' ').map((word, index) => (
              <span key={index} className={index === 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500' : 'text-white'}>
                {word}{' '}
              </span>
            ))}
          </h2>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Email */}
              <a 
                href={`mailto:${contactInfo.email}`}
                className="group flex items-center space-x-4 p-5 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-colors">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Email</div>
                  <div className="text-white font-medium group-hover:text-cyan-400 transition-colors">{contactInfo.email}</div>
                </div>
              </a>

              {/* Phone */}
              <a 
                href={`tel:${contactInfo.phone}`}
                className="group flex items-center space-x-4 p-5 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">{language === 'tr' ? 'Telefon' : 'Phone'}</div>
                  <div className="text-white font-medium group-hover:text-purple-400 transition-colors">{contactInfo.phone}</div>
                </div>
              </a>

              {/* Address */}
              <div className="group flex items-center space-x-4 p-5 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">{language === 'tr' ? 'Adres' : 'Address'}</div>
                  <div className="text-white font-medium">{language === 'tr' ? contactInfo.addressTr : contactInfo.address}</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">{language === 'tr' ? 'Bizi Takip Edin' : 'Follow Us'}</h3>
              <div className="flex space-x-4">
                <a 
                  href={contactInfo.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href={contactInfo.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-300"
                >
                  <XIcon size={18} />
                </a>
                <a 
                  href={contactInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-800/30 rounded-3xl p-8 border border-slate-700/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder={language === 'tr' ? 'Adınızı girin' : 'Enter your name'}
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder={language === 'tr' ? 'E-posta adresinizi girin' : 'Enter your email'}
                />
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                  placeholder={language === 'tr' ? 'Mesajınızı yazın' : 'Write your message'}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t('contact.form.send')}</span>
                    <Send size={18} />
                  </>
                )}
              </button>

              {/* Success Message */}
              {isSubmitted && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-center">
                  {language === 'tr' ? 'Mesajınız başarıyla gönderildi!' : 'Your message has been sent successfully!'}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
