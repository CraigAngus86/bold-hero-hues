
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-team-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Club Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Banks O' Dee FC</h3>
            <p className="mb-2">Founded in 1902</p>
            <p className="mb-4">Spain Park, Aberdeen</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/news" className="hover:underline">Latest News</Link></li>
              <li><Link to="/fixtures" className="hover:underline">Fixtures &amp; Results</Link></li>
              <li><Link to="/team" className="hover:underline">First Team</Link></li>
              <li><Link to="/tickets" className="hover:underline">Buy Tickets</Link></li>
              <li><Link to="/table" className="hover:underline">League Table</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>01224 701548</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:info@banksofdeefc.co.uk" className="hover:underline">info@banksofdeefc.co.uk</a>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Spain Park, Aberdeen, AB12 5XA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-sm text-center">
          <p>&copy; {currentYear} Banks O' Dee Football Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
