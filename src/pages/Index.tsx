
import { useState, useEffect } from 'react';
import { ArrowRight, Smartphone, Laptop, Tv, Headphones, Clock, Shield, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const features = [
    {
      title: "Quick Diagnostics",
      description: "Professional assessment of your device's condition with clear troubleshooting steps",
      icon: <Clock className="h-10 w-10 text-primary" />
    },
    {
      title: "Expert Technicians",
      description: "Our certified repair specialists have years of experience with all types of electronics",
      icon: <Shield className="h-10 w-10 text-primary" />
    },
    {
      title: "Affordable Pricing",
      description: "Competitive rates with no hidden fees or surprises after service",
      icon: <CreditCard className="h-10 w-10 text-primary" />
    }
  ];

  const serviceCategories = [
    {
      title: "Smartphone Repair",
      description: "Screen replacements, battery swaps, water damage recovery",
      icon: <Smartphone className="h-16 w-16 text-primary" />,
      link: "/services"
    },
    {
      title: "Laptop & PC Repair",
      description: "Hardware upgrades, virus removal, data recovery",
      icon: <Laptop className="h-16 w-16 text-primary" />,
      link: "/services"
    },
    {
      title: "TV & Display Repair",
      description: "Screen fixes, power issues, calibration services",
      icon: <Tv className="h-16 w-16 text-primary" />,
      link: "/services"
    },
    {
      title: "Audio Equipment",
      description: "Headphones, speakers, amplifier troubleshooting",
      icon: <Headphones className="h-16 w-16 text-primary" />,
      link: "/services"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-background to-background/95">
        <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Professional Repairs
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Expert Electronics Repair Services
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Fast, reliable repairs for all your electronic devices.
            Professional technicians and quality parts guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" asChild>
              <Link to={isAuthenticated ? "/repairs" : "/register"}>
                {isAuthenticated ? "Request Repair" : "Get Started"}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">
                Browse Services
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Decorative gradient blob */}
        <div className="absolute -z-10 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </section>
      
      {/* Features section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Service</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We deliver the highest quality repairs with exceptional customer service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-card shadow-sm border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Repair Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional repair services for all types of electronic devices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceCategories.map((category, index) => (
              <Link 
                key={index}
                to={category.link}
                className="group bg-card border border-border rounded-lg p-8 text-center hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="mb-4 flex justify-center">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <div className="flex items-center justify-center text-primary font-medium group-hover:underline">
                  <span>View services</span>
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to fix your device?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Our team of experts is ready to help you get your electronics back to working condition
          </p>
          <Button size="lg" asChild>
            <Link to={isAuthenticated ? "/repairs" : "/register"}>
              {isAuthenticated ? "Submit a repair request" : "Get started now"}
            </Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
