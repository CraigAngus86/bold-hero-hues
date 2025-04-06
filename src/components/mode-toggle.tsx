
import React from 'react';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';

export const ModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleMode}>
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
