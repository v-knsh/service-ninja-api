
import { baseUrl } from '../lib/data';

const Footer = () => {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-semibold mb-4">Electronics Repair API</h3>
            <p className="text-muted-foreground text-sm">
              A comprehensive API for electronics repair services management.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#authentication" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Authentication
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a 
                  href="#repairs" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Repairs
                </a>
              </li>
              <li>
                <a 
                  href="#payments" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Payments
                </a>
              </li>
              <li>
                <a 
                  href="#reviews" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reviews
                </a>
              </li>
              <li>
                <a 
                  href="#appointments" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Appointments
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">API Information</h3>
            <p className="text-sm text-muted-foreground mb-2">Base URL:</p>
            <div className="bg-muted px-3 py-2 rounded-md text-sm font-mono mb-4">
              {baseUrl}
            </div>
            <p className="text-sm text-muted-foreground">
              Authentication required for protected endpoints.
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-10 pt-10 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Electronics Repair API Documentation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
