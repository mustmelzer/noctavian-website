import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadSiteContent } from '../services/contentService';
import {
  games as fallbackGames,
  collaborativeProjects as fallbackProjects,
  contactInfo as fallbackContactInfo,
} from '../data/mockData';

const SiteContentContext = createContext(null);

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState({
    games: fallbackGames,
    collaborativeProjects: fallbackProjects,
    contactInfo: fallbackContactInfo,
    isLoading: true,
    source: 'fallback',
  });

  const refreshContent = useCallback(async () => {
    const nextContent = await loadSiteContent();
    setContent({
      ...nextContent,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    refreshContent().catch((error) => {
      console.warn('Unable to load remote site content.', error);
      setContent((current) => ({ ...current, isLoading: false }));
    });
  }, [refreshContent]);

  const value = useMemo(
    () => ({
      ...content,
      refreshContent,
    }),
    [content, refreshContent],
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
