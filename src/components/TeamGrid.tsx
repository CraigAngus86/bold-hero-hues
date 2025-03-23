
import { useState } from 'react';
import { motion } from 'framer-motion';
import PlayerCard from './PlayerCard';

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  image: string;
  stats: {
    appearances?: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
  };
  biography: string;
}

const mockPlayers: Player[] = [
  {
    id: 1,
    name: "Jamie Buglass",
    position: "Goalkeeper",
    number: 1,
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 24,
      cleanSheets: 12
    },
    biography: "Jamie has been the first-choice goalkeeper for Banks o' Dee since 2019. Known for his exceptional reflexes and commanding presence in the box."
  },
  {
    id: 2,
    name: "Mark Gilmour",
    position: "Defender",
    number: 4,
    image: "https://images.unsplash.com/photo-1498609458988-7b2c698fecfe?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 28,
      goals: 2,
      assists: 3
    },
    biography: "A rock in defense, Mark is known for his exceptional aerial ability and leadership at the back. Club captain since 2021."
  },
  {
    id: 3,
    name: "Liam Duell",
    position: "Midfielder",
    number: 8,
    image: "https://images.unsplash.com/photo-1506432278326-7878fc8740cc?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 30,
      goals: 6,
      assists: 10
    },
    biography: "The engine of the team, Liam controls the midfield with his excellent passing range and vision. Local Aberdeen talent who joined the club in 2020."
  },
  {
    id: 4,
    name: "Hamish MacLeod",
    position: "Forward",
    number: 9,
    image: "https://images.unsplash.com/photo-1499368919119-2c7332a83f39?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 26,
      goals: 18,
      assists: 7
    },
    biography: "The team's top scorer for the past two seasons, Hamish is a clinical finisher with pace to burn. Joined from local rivals in 2018."
  }
];

const positions = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];

const TeamGrid = () => {
  const [selectedPosition, setSelectedPosition] = useState("All");
  
  const filteredPlayers = selectedPosition === "All" 
    ? mockPlayers 
    : mockPlayers.filter(player => player.position === selectedPosition);
  
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Team & Management</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the players and staff who represent Banks o' Dee FC. Click on a player card to learn more about them.
          </p>
        </motion.div>
        
        <div className="mb-10 flex justify-center">
          <div className="inline-flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
            {positions.map((position) => (
              <button
                key={position}
                onClick={() => setSelectedPosition(position)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedPosition === position
                    ? "bg-team-blue text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {position}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              name={player.name}
              position={player.position}
              number={player.number}
              image={player.image}
              stats={player.stats}
              biography={player.biography}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;
