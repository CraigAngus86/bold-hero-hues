
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-team-blue py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white text-xl font-bold">Banks O' Dee FC</Link>
          
          <div className="hidden md:flex space-x-4 text-white">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/news" className="hover:underline">News</Link>
            <Link to="/fixtures" className="hover:underline">Fixtures</Link>
            <Link to="/team" className="hover:underline">Team</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
