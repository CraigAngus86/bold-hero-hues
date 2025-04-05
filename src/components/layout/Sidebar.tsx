
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <aside className={cn("w-64 h-screen bg-white shadow-md", className)}>
      <div className="p-4">
        <h2 className="text-xl font-bold text-team-blue">Banks O' Dee FC</h2>
      </div>
      
      <nav className="px-4 py-2">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="block p-2 rounded hover:bg-gray-100">Home</Link>
          </li>
          <li>
            <Link to="/news" className="block p-2 rounded hover:bg-gray-100">News</Link>
          </li>
          <li>
            <Link to="/fixtures" className="block p-2 rounded hover:bg-gray-100">Fixtures</Link>
          </li>
          <li>
            <Link to="/team" className="block p-2 rounded hover:bg-gray-100">Team</Link>
          </li>
          <li>
            <Link to="/table" className="block p-2 rounded hover:bg-gray-100">League Table</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
