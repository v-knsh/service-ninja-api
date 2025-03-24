
import { useState, useEffect } from 'react';
import { baseUrl } from '../lib/data';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all-slow py-6 px-8 ${
        scrolled ? 'glass-effect' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div 
            className={`text-2xl font-bold bg-clip-text ${
              scrolled ? 'text-primary' : 'text-foreground'
            } transition-all-slow`}
          >
            Electronics Repair API
          </div>
        </div>
        
        <div className="flex space-x-6 items-center">
          <div className="hidden md:flex space-x-6">
            <a href="#authentication" className="text-sm font-medium hover:text-primary transition-colors">
              Authentication
            </a>
            <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </a>
            <a href="#repairs" className="text-sm font-medium hover:text-primary transition-colors">
              Repairs
            </a>
            <a href="#payments" className="text-sm font-medium hover:text-primary transition-colors">
              Payments
            </a>
          </div>
          <div 
            className={`px-4 py-2 rounded-full text-sm ${
              scrolled 
                ? 'bg-primary text-white' 
                : 'bg-secondary text-secondary-foreground'
            } transition-all-slow hover:opacity-90`}
          >
            {baseUrl}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
