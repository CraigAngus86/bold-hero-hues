
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player } from '../PlayerForm';
import { StaffMember } from '../StaffForm';
import { players as initialPlayers } from '@/data/players';

// Convert to the format we need
const mockPlayers: Player[] = initialPlayers.map((player, index) => ({
  id: (index + 1).toString(),
  name: player.name,
  position: player.position,
  number: player.number || 0,
  age: player.age || 25,
  height: player.height || "5'10\"",
  previousClubs: player.previousClubs || "",
  bio: player.bio || "",
  image: player.image
}));

// Mock staff data
const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Josh Winton',
    role: 'Manager',
    bio: 'Experienced manager with a history of success in the Highland League. Joined Banks o\' Dee in 2022.',
    image: '/lovable-uploads/banks-o-dee-logo.png'
  },
  {
    id: '2',
    name: 'Craig Fraser',
    role: 'Assistant Manager',
    bio: 'Former player who transitioned to coaching. Working alongside the manager to develop team tactics and strategy.',
    image: '/lovable-uploads/banks-o-dee-logo.png'
  },
  {
    id: '3',
    name: 'Sarah McKenzie',
    role: 'Physiotherapist',
    bio: 'Qualified physiotherapist with experience working in sports medicine. Responsible for player rehabilitation and injury prevention.',
    image: '/lovable-uploads/banks-o-dee-logo.png'
  }
];

interface TeamContextType {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);

  return (
    <TeamContext.Provider value={{ players, setPlayers, staff, setStaff }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
