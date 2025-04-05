
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-team-blue">Banks O' Dee FC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="font-medium text-gray-600 hover:text-team-blue">Home</Link>
            <Link to="/news" className="font-medium text-gray-600 hover:text-team-blue">News</Link>
            <Link to="/team" className="font-medium text-gray-600 hover:text-team-blue">Team</Link>
            <Link to="/fixtures" className="font-medium text-gray-600 hover:text-team-blue">Fixtures</Link>
            <Link to="/table" className="font-medium text-gray-600 hover:text-team-blue">League Table</Link>
            <Link to="/stadium" className="font-medium text-gray-600 hover:text-team-blue">Stadium</Link>
            <Link to="/tickets" className="font-medium text-gray-600 hover:text-team-blue">Tickets</Link>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMenu}
              className="text-gray-600"
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white pb-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="font-medium text-gray-600 hover:text-team-blue p-2">Home</Link>
            <Link to="/news" className="font-medium text-gray-600 hover:text-team-blue p-2">News</Link>
            <Link to="/team" className="font-medium text-gray-600 hover:text-team-blue p-2">Team</Link>
            <Link to="/fixtures" className="font-medium text-gray-600 hover:text-team-blue p-2">Fixtures</Link>
            <Link to="/table" className="font-medium text-gray-600 hover:text-team-blue p-2">League Table</Link>
            <Link to="/stadium" className="font-medium text-gray-600 hover:text-team-blue p-2">Stadium</Link>
            <Link to="/tickets" className="font-medium text-gray-600 hover:text-team-blue p-2">Tickets</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
