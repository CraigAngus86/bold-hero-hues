import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TeamMember {
  id: number;
  name: string;
  position?: string;
  role?: string;
  number?: number;
  image: string;
  biography?: string;
  bio?: string;
  type: 'player' | 'management' | 'official';
  stats?: {
    appearances?: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
  };
  experience?: string;
}

// Mock player image
const profileImageUrl = "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png";

// Initial team members data
const initialTeamMembers: TeamMember[] = [
  // Goalkeepers
  {
    id: 1,
    name: "Daniel Hoban",
    position: "Goalkeeper",
    number: 1,
    image: profileImageUrl,
    type: "player",
    stats: {
      appearances: 18,
      cleanSheets: 8
    },
    biography: "Daniel joined Banks o' Dee in 2022 and has been a reliable presence between the posts."
  },
  {
    id: 2,
    name: "Fraser Hobday",
    position: "Goalkeeper",
    number: 13,
    image: profileImageUrl,
    type: "player",
    stats: {
      appearances: 10,
      cleanSheets: 4
    },
    biography: "Fraser provides strong competition for the goalkeeper position and has made vital saves when called upon."
  },
  
  // Defenders
  {
    id: 3,
    name: "Jevan Anderson",
    position: "Defender",
    number: 2,
    image: profileImageUrl,
    type: "player",
    stats: {
      appearances: 24,
      goals: 1,
      assists: 2
    },
    biography: "Jevan is a strong, consistent defender who brings professional experience to the backline."
  },
  {
    id: 4,
    name: "Darryn Kelly",
    position: "Defender",
    number: 4,
    image: profileImageUrl,
    type: "player",
    stats: {
      appearances: 22,
      goals: 3,
      assists: 1
    },
    biography: "A commanding centre-back with excellent aerial ability and leadership qualities."
  },
  
  // Midfielders
  {
    id: 5,
    name: "Kane Winton",
    position: "Midfielder",
    number: 6,
    image: profileImageUrl,
    type: "player",
    stats: {
      appearances: 26,
      goals: 3,
      assists: 5
    },
    biography: "Kane is the engine room of the team, breaking up opposition attacks and starting our own with intelligent passing."
  },
  {
    id: 6,
    name: "Michael Philipson",
    position: "Midfielder",
    number: 8,
    image: profileImageUrl,
    type: "player",
    stats: {
      appearances: 25,
      goals: 7,
      assists: 9
    },
    biography: "A creative midfielder with excellent vision and passing ability. Michael creates numerous chances each game."
  },
  
  // Forwards
  {
    id: 7,
    name: "Mark Gilmour",
    position: "Forward",
    number: 9,
    image: profileImageUrl,
    type: "player",
    stats: {
      appearances: 28,
      goals: 15,
      assists: 6
    },
    biography: "Mark is a clinical striker with excellent movement and finishing ability. Top scorer last season."
  },
  {
    id: 8,
    name: "Liam Duell",
    position: "Forward",
    number: 11,
    image: profileImageUrl,
    type: "player",
    stats: {
      appearances: 25,
      goals: 12,
      assists: 8
    },
    biography: "A pacy winger who loves to take on defenders and create chances for teammates or finish himself."
  },
  
  // Management
  {
    id: 9,
    name: "Josh Winton",
    role: "Manager",
    image: profileImageUrl,
    type: "management",
    bio: "Josh has been with the club for many years and has led the team to multiple successes in recent seasons.",
    experience: "5 years"
  },
  {
    id: 10,
    name: "Tommy Forbes",
    role: "Assistant Manager",
    image: profileImageUrl,
    type: "management",
    bio: "Tommy brings a wealth of tactical knowledge to the coaching staff and works closely with the players on match preparation.",
    experience: "3 years"
  },
  {
    id: 11,
    name: "Mark Robb",
    role: "First Team Coach",
    image: profileImageUrl,
    type: "management",
    bio: "Mark focuses on player development and implementing the team's playing style through focused training sessions.",
    experience: "2 years"
  },
  
  // Officials
  {
    id: 12,
    name: "Brian Winton",
    role: "Club President",
    image: profileImageUrl,
    type: "official",
    bio: "Brian has been instrumental in the club's progress and development over the past decade.",
    experience: "10 years"
  },
  {
    id: 13,
    name: "Allan Hale",
    role: "Club Secretary",
    image: profileImageUrl,
    type: "official",
    bio: "Allan handles all the administrative aspects of the club, ensuring smooth operations behind the scenes.",
    experience: "8 years"
  },
  {
    id: 14,
    name: "Hugh Robertson",
    role: "Club Treasurer",
    image: profileImageUrl,
    type: "official",
    bio: "Hugh oversees the club's finances and has helped secure important sponsorship deals.",
    experience: "7 years"
  }
];

interface TeamStore {
  teamMembers: TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: number) => void;
  getPlayersByPosition: (position: string) => TeamMember[];
  getManagementStaff: () => TeamMember[];
  getClubOfficials: () => TeamMember[];
  clearAllTeamMembers: () => void;
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teamMembers: initialTeamMembers,
      
      addTeamMember: (member) => {
        set((state) => ({
          teamMembers: [...state.teamMembers, member]
        }));
      },
      
      updateTeamMember: (member) => {
        set((state) => ({
          teamMembers: state.teamMembers.map((m) => 
            m.id === member.id ? member : m
          )
        }));
      },
      
      deleteTeamMember: (id) => {
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== id)
        }));
      },
      
      getPlayersByPosition: (position) => {
        const players = get().teamMembers.filter(m => m.type === 'player');
        return position === "All" 
          ? players 
          : players.filter(p => p.position === position);
      },
      
      getManagementStaff: () => {
        return get().teamMembers.filter(m => m.type === 'management');
      },
      
      getClubOfficials: () => {
        return get().teamMembers.filter(m => m.type === 'official');
      },
      
      clearAllTeamMembers: () => set({ teamMembers: [] })
    }),
    {
      name: 'team-storage'
    }
  )
);
