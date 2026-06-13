import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from './context/LanguageContext';
import { SiteContentProvider } from './context/SiteContentContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import GamesSection from './components/GamesSection';
import CollaborativeSection from './components/CollaborativeSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection />
      <GamesSection />
      <CollaborativeSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <SiteContentProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </SiteContentProvider>
    </LanguageProvider>
  );
}

export default App;
