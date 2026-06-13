import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import { categories, tagColors } from '../data/mockData';
import { Gamepad2, Clock, X, ExternalLink } from 'lucide-react';

// Popup Modal Component
const GameModal = ({ game, language, isOpen, onClose }) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;
  
  const tagStyle = tagColors[game.tag] || tagColors['Mobile Game'];
  const title = language === 'tr' ? game.titleTr : game.title;
  const description = language === 'tr' ? game.descriptionTr : game.description;
  const tag = language === 'tr' ? game.tagTr : game.tag;

  const handleGoToGame = () => {
    if (game.gameUrl) {
      window.open(game.gameUrl, '_blank');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-800 rounded-2xl max-w-lg w-full overflow-hidden border border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X size={20} />
        </button>

        {/* Image */}
        <div className="relative aspect-video">
          <img 
            src={game.image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent" />
          
          {/* Tags - Only show for coming-soon */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            {game.status === 'coming-soon' && (
              <>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border} border backdrop-blur-sm`}>
                  {tag}
                </span>
                <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm rounded-full text-xs font-medium text-slate-300 border border-slate-600/50">
                  <Clock size={12} />
                  <span>{t('games.comingSoon')}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
          <p className="text-slate-300 leading-relaxed">{description}</p>
          
          {/* Action Button */}
          {game.status === 'coming-soon' ? (
            <button 
              disabled
              className="w-full mt-6 py-3 rounded-xl font-medium bg-slate-700/50 text-slate-400 cursor-not-allowed"
            >
              {t('games.comingSoon')}
            </button>
          ) : (
            <a 
              href={game.gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full mt-6 py-3 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-center"
            >
              {t('games.goToGame')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const GameCard = ({ game, language, onOpenModal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();
  
  const tagStyle = tagColors[game.tag] || tagColors['Mobile Game'];
  const title = language === 'tr' ? game.titleTr : game.title;
  const description = language === 'tr' ? game.descriptionTr : game.description;
  const tag = language === 'tr' ? game.tagTr : game.tag;

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenModal(game)}
    >
      <div className="relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={game.image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
          
          {/* Category Tag - Show for all games */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${tagStyle.bg} ${tagStyle.text} ${tagStyle.border} border backdrop-blur-sm`}>
              <span>{tag}</span>
            </span>
          </div>

          {/* Hover Overlay with Description */}
          <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/50 flex flex-col justify-end p-5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-slate-300 text-sm leading-relaxed line-clamp-4 mb-3">
              {description}
            </p>
            {/* Read More Indicator */}
            <div className="flex items-center space-x-1 text-cyan-400 text-sm font-medium">
              <ExternalLink size={14} />
              <span>{language === 'tr' ? 'Devamını oku' : 'Read more'}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            {title}
          </h3>
          
          {/* Action Button */}
          {game.status === 'coming-soon' ? (
            <button 
              disabled
              onClick={(e) => e.stopPropagation()}
              className="w-full mt-3 py-2.5 rounded-xl font-medium bg-slate-700/50 text-slate-400 cursor-not-allowed"
            >
              {t('games.comingSoon')}
            </button>
          ) : (
            <a 
              href={game.gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block w-full mt-3 py-2.5 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-center"
            >
              {t('games.goToGame')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const GamesSection = () => {
  const { language, t } = useLanguage();
  const { games } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState(null);

  const filteredGames = activeCategory === 'all' 
    ? games 
    : games.filter(game => game.category === activeCategory);

  const openModal = (game) => {
    setSelectedGame(game);
  };

  const closeModal = () => {
    setSelectedGame(null);
  };

  return (
    <section id="games" className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-950 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Section Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">{t('games.sectionTag')}</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('games.title').split(' ').map((word, index) => (
              <span key={index} className={index === 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500' : 'text-white'}>
                {word}{' '}
              </span>
            ))}
          </h2>

          {/* Subtitle */}
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t('games.subtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              {language === 'tr' ? category.labelTr : category.label}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              language={language} 
              onOpenModal={openModal}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <Gamepad2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              {language === 'tr' ? 'Bu kategoride henüz oyun yok.' : 'No games in this category yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <GameModal 
          game={selectedGame} 
          language={language} 
          isOpen={!!selectedGame} 
          onClose={closeModal} 
        />
      )}
    </section>
  );
};

export default GamesSection;
