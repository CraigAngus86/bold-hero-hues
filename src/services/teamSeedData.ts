import { supabase } from '@/services/supabase/supabaseClient';
import { TeamMember } from '@/types/team';
import { toast } from 'sonner';

// Profile image URLs - using the uploaded images
const profileImageUrls = [
  "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
  "/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png",
  "/lovable-uploads/73ac703f-7365-4abb-811e-159280ad234b.png",
  "/lovable-uploads/940ac3a1-b89d-40c9-957e-217a64371120.png"
];

// Helper function to get a random image URL
const getRandomImageUrl = () => {
  const randomIndex = Math.floor(Math.random() * profileImageUrls.length);
  return profileImageUrls[randomIndex];
};

// Player data
const playerData: Omit<TeamMember, 'id'>[] = [
  // Goalkeepers
  {
    name: "Daniel Hoban",
    member_type: "player",
    position: "Goalkeeper",
    image_url: getRandomImageUrl(),
    bio: "An excellent goalkeeper with incredible reflexes. Daniel has been with the club for 3 seasons.",
    nationality: "Scottish",
    jersey_number: 1,
    previous_clubs: ["Inverness CT", "Forfar Athletic"],
    experience: "5+ years in Highland League",
    is_active: true,
    stats: {
      appearances: 28,
      cleanSheets: 12
    }
  },
  {
    name: "Fraser Hobday",
    member_type: "player",
    position: "Goalkeeper",
    image_url: getRandomImageUrl(),
    bio: "A reliable shot-stopper who provides great competition for the number one spot.",
    nationality: "Scottish",
    jersey_number: 13,
    previous_clubs: ["Turriff United", "Cove Rangers"],
    experience: "8 years professional experience",
    is_active: true,
    stats: {
      appearances: 15,
      cleanSheets: 6
    }
  },
  
  // Defenders
  {
    name: "Jevan Anderson",
    member_type: "player",
    position: "Defender",
    image_url: getRandomImageUrl(),
    bio: "A commanding central defender who is strong in the air and comfortable with the ball at his feet.",
    nationality: "Scottish",
    jersey_number: 4,
    previous_clubs: ["Burton Albion", "Formartine United"],
    experience: "Former professional with Burton Albion",
    is_active: true,
    stats: {
      appearances: 32,
      goals: 3,
      assists: 1
    }
  },
  {
    name: "Darryn Kelly",
    member_type: "player",
    position: "Defender",
    image_url: getRandomImageUrl(),
    bio: "A versatile defender who can play across the backline. Known for his leadership qualities.",
    nationality: "Scottish",
    jersey_number: 5,
    previous_clubs: ["Cove Rangers", "Inverurie Locos"],
    experience: "10+ years in Highland League",
    is_active: true,
    stats: {
      appearances: 28,
      goals: 2,
      assists: 3
    }
  },
  {
    name: "Scott Ross",
    member_type: "player",
    position: "Defender",
    image_url: getRandomImageUrl(),
    bio: "A no-nonsense defender with exceptional aerial ability and great leadership skills.",
    nationality: "Scottish",
    jersey_number: 6,
    previous_clubs: ["Peterhead", "Cove Rangers"],
    experience: "Former SPFL player with Peterhead",
    is_active: true,
    stats: {
      appearances: 29,
      goals: 4,
      assists: 0
    }
  },
  {
    name: "Ryan Cunningham",
    member_type: "player",
    position: "Defender",
    image_url: getRandomImageUrl(),
    bio: "A modern full-back who loves to get forward and contribute in attack.",
    nationality: "Scottish",
    jersey_number: 2,
    previous_clubs: ["Dyce FC", "Aberdeen U20s"],
    experience: "Former youth player with Aberdeen",
    is_active: true,
    stats: {
      appearances: 26,
      goals: 1,
      assists: 7
    }
  },
  
  // Midfielders
  {
    name: "Kane Winton",
    member_type: "player",
    position: "Midfielder",
    image_url: getRandomImageUrl(),
    bio: "The engine of the midfield. Kane's energy and tackling are vital to the team.",
    nationality: "Scottish",
    jersey_number: 8,
    previous_clubs: ["Huntly", "Keith"],
    experience: "7 years Highland League experience",
    is_active: true,
    stats: {
      appearances: 34,
      goals: 5,
      assists: 4
    }
  },
  {
    name: "Michael Philipson",
    member_type: "player",
    position: "Midfielder",
    image_url: getRandomImageUrl(),
    bio: "A creative midfielder with excellent vision and passing range.",
    nationality: "Scottish",
    jersey_number: 10,
    previous_clubs: ["Formartine United", "Aberdeen U20s"],
    experience: "Former Aberdeen youth player",
    is_active: true,
    stats: {
      appearances: 31,
      goals: 9,
      assists: 14
    }
  },
  {
    name: "Lachie Macleod",
    member_type: "player",
    position: "Midfielder",
    image_url: getRandomImageUrl(),
    bio: "A dynamic box-to-box midfielder known for his long-range shooting.",
    nationality: "Scottish",
    jersey_number: 14,
    previous_clubs: ["Formartine United", "Deveronvale"],
    experience: "8 years in Highland League",
    is_active: true,
    stats: {
      appearances: 29,
      goals: 11,
      assists: 6
    }
  },
  
  // Forwards
  {
    name: "Mark Gilmour",
    member_type: "player",
    position: "Forward",
    image_url: getRandomImageUrl(),
    bio: "A clinical striker who knows how to find the back of the net. Last season's top scorer.",
    nationality: "Scottish",
    jersey_number: 9,
    previous_clubs: ["Fraserburgh", "Buckie Thistle"],
    experience: "Over 100 Highland League goals",
    is_active: true,
    stats: {
      appearances: 33,
      goals: 24,
      assists: 6
    }
  },
  {
    name: "Liam Duell",
    member_type: "player",
    position: "Forward",
    image_url: getRandomImageUrl(),
    bio: "A pacey winger who loves to take on defenders and create chances.",
    nationality: "Scottish",
    jersey_number: 11,
    previous_clubs: ["Huntly", "Inverurie Locos"],
    experience: "5 years Highland League experience",
    is_active: true,
    stats: {
      appearances: 30,
      goals: 14,
      assists: 11
    }
  },
  {
    name: "Jack Henderson",
    member_type: "player",
    position: "Forward",
    image_url: getRandomImageUrl(),
    bio: "A versatile forward who can play across the front line. Known for his work rate and finishing.",
    nationality: "Scottish",
    jersey_number: 17,
    previous_clubs: ["Buckie Thistle", "Keith"],
    experience: "Highland League winner with Buckie Thistle",
    is_active: true,
    stats: {
      appearances: 27,
      goals: 12,
      assists: 9
    }
  }
];

// Management data
const managementData: Omit<TeamMember, 'id'>[] = [
  {
    name: "Josh Winton",
    member_type: "management",
    position: "Manager",
    image_url: getRandomImageUrl(),
    bio: "Josh took charge in 2020 and has led the team to multiple cup successes and improved league positions.",
    nationality: "Scottish",
    experience: "Previous clubs: Deveronvale FC (Assistant), Culter FC",
    is_active: true
  },
  {
    name: "Paul Livingstone",
    member_type: "management",
    position: "Assistant Manager",
    image_url: getRandomImageUrl(),
    bio: "Paul brings extensive tactical knowledge and provides vital support to the manager and players.",
    nationality: "Scottish",
    experience: "Playing career: Formartine United, Inverurie Locos",
    is_active: true
  },
  {
    name: "Andrew Douglas",
    member_type: "management",
    position: "Coach",
    image_url: getRandomImageUrl(),
    bio: "Andrew focuses on player development and implementing training regimes to improve performance.",
    nationality: "Scottish",
    experience: "UEFA A License holder with 15 years coaching experience",
    is_active: true
  },
  {
    name: "Mark Wilson",
    member_type: "management",
    position: "Goalkeeping Coach",
    image_url: getRandomImageUrl(),
    bio: "Mark works specifically with our goalkeepers, drawing on his own professional playing experience.",
    nationality: "Scottish",
    experience: "Playing career: Aberdeen FC, Ross County FC",
    is_active: true
  }
];

// Officials data
const officialsData: Omit<TeamMember, 'id'>[] = [
  {
    name: "Thomas Stewart",
    member_type: "official",
    position: "Club Chairman",
    image_url: getRandomImageUrl(),
    bio: "Serving as club chairman since 2018, Thomas has overseen significant growth both on and off the field.",
    nationality: "Scottish",
    experience: "15 years in sports administration",
    is_active: true
  },
  {
    name: "Margaret Wilson",
    member_type: "official",
    position: "Vice Chairman",
    image_url: getRandomImageUrl(),
    bio: "Margaret has been instrumental in growing the club's community presence and youth development program.",
    nationality: "Scottish",
    experience: "Former business consultant with 20 years experience",
    is_active: true
  },
  {
    name: "Craig Stevenson",
    member_type: "official",
    position: "Club Secretary",
    image_url: getRandomImageUrl(),
    bio: "Craig handles all administrative duties with precision and dedication to the club.",
    nationality: "Scottish",
    experience: "10 years with the club in various roles",
    is_active: true
  },
  {
    name: "Alan McRae",
    member_type: "official",
    position: "Treasurer",
    image_url: getRandomImageUrl(),
    bio: "Alan manages the club's finances efficiently, ensuring we operate within our means while still being competitive.",
    nationality: "Scottish",
    experience: "Chartered accountant with 25 years experience",
    is_active: true
  }
];

// Function to seed the database with team data
export const seedTeamData = async () => {
  try {
    // Clear existing data first
    await clearExistingTeamData();
    
    // Insert players
    for (const player of playerData) {
      await supabase
        .from('team_members')
        .insert(player);
    }
    
    // Insert management staff
    for (const staff of managementData) {
      await supabase
        .from('team_members')
        .insert(staff);
    }
    
    // Insert officials
    for (const official of officialsData) {
      await supabase
        .from('team_members')
        .insert(official);
    }
    
    toast.success("Team data seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding team data:", error);
    toast.error("Failed to seed team data");
    return false;
  }
};

// Function to clear existing team data
const clearExistingTeamData = async () => {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .not('id', 'is', null);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error clearing team data:", error);
    throw error;
  }
};
