
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-lg font-semibold mb-4">Electronics Repair</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Professional repair services for all your electronic devices.
              Quality parts and expert technicians.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/services" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Smartphone Repair
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Laptop & PC Repair
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  TV & Display Repair
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Audio Equipment
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/login" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link 
                  to="/repairs" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Submit Repair
                </Link>
              </li>
              <li>
                <Link 
                  to="/appointments" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  123 Repair Street, Tech City, TX 75001
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary" />
                <span className="text-sm text-muted-foreground">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <span className="text-sm text-muted-foreground">support@electronics-repair.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-10 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Electronics Repair Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
