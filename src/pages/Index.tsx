
import { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import Header from '@/components/Header';
import ApiSection from '@/components/ApiSection';
import Footer from '@/components/Footer';
import { categories, endpoints } from '@/lib/data';

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4">
        <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Documentation
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Electronics Repair Service API
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive RESTful API for managing electronics repair services, 
            appointments, payments, and customer reviews.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href="#authentication" 
              className="px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Explore API
            </a>
            <div className="text-sm text-muted-foreground">
              All endpoints available at <code className="bg-secondary px-2 py-1 rounded">api.example.com</code>
            </div>
          </div>
        </div>
        
        <div className={`absolute bottom-10 animate-bounce transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <a href="#authentication" className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xs mb-2">Explore Documentation</span>
            <ArrowDown size={18} />
          </a>
        </div>
        
        {/* Decorative gradient blob */}
        <div className="absolute -z-10 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[80px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </section>
      
      {/* API sections */}
      <div className="bg-background">
        {categories.map((category) => (
          <ApiSection 
            key={category.id}
            category={category}
            endpoints={endpoints.filter(e => e.category === category.id)}
          />
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
