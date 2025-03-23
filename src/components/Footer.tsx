
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Lock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-team-blue text-white">
      <div className="container mx-auto px-4">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Club Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/c5b46adc-8c4c-4b59-9a27-4ec841222d92.png" 
                alt="Banks o' Dee FC Logo" 
                className="h-8"
              />
              <h3 className="text-lg font-bold">Banks o' Dee FC</h3>
            </div>
            <p className="text-white/80 mb-4">
              Highland League football club based in Aberdeen, Scotland. 
              Established 1902.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/news" className="text-white/80 hover:text-white transition-colors">News</Link>
              </li>
              <li>
                <Link to="/team" className="text-white/80 hover:text-white transition-colors">Team & Management</Link>
              </li>
              <li>
                <Link to="/fixtures" className="text-white/80 hover:text-white transition-colors">Fixtures & Results</Link>
              </li>
              <li>
                <Link to="/table" className="text-white/80 hover:text-white transition-colors">League Table</Link>
              </li>
              <li>
                <Link to="/stadium" className="text-white/80 hover:text-white transition-colors">Spain Park</Link>
              </li>
              <li>
                <Link to="/tickets" className="text-white/80 hover:text-white transition-colors">Tickets</Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/80 hover:text-white transition-colors flex items-center">
                  <Lock className="w-4 h-4 mr-1" />
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex">
                <MapPin className="w-5 h-5 mr-3 flex-shrink-0 text-white/70" />
                <span className="text-white/80">Spain Park, Aberdeen, Scotland</span>
              </li>
              <li className="flex">
                <Phone className="w-5 h-5 mr-3 flex-shrink-0 text-white/70" />
                <span className="text-white/80">+44 1224 000000</span>
              </li>
              <li className="flex">
                <Mail className="w-5 h-5 mr-3 flex-shrink-0 text-white/70" />
                <span className="text-white/80">info@banksodeefc.com</span>
              </li>
            </ul>
          </div>
          
          {/* Join the Club */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">Join the Club</h3>
            <form className="mb-6">
              <p className="text-white/80 mb-3 text-sm">
                Subscribe to receive the latest match updates and club news.
              </p>
              <div className="flex flex-col space-y-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/10 border border-white/20 px-4 py-2 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                />
                <button 
                  type="submit"
                  className="bg-white text-team-blue font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© {currentYear} Banks o' Dee Football Club. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
