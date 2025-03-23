export interface Player {
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

const profileImageUrl = "/lovable-uploads/9cecca5c-daf2-4f52-a6ca-06e02ca9ea44.png";

export const players: Player[] = [
  // Goalkeepers (3)
  {
    id: 1,
    name: "Daniel Hoban",
    position: "Goalkeeper",
    number: 1,
    image: profileImageUrl,
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
    stats: {
      appearances: 10,
      cleanSheets: 4
    },
    biography: "Fraser provides strong competition for the goalkeeper position and has made vital saves when called upon."
  },
  {
    id: 3,
    name: "Andy Reid",
    position: "Goalkeeper",
    number: 21,
    image: profileImageUrl,
    stats: {
      appearances: 5,
      cleanSheets: 2
    },
    biography: "Andy is a promising young goalkeeper developing through our ranks. Known for his excellent reflexes and distribution."
  },
  
  // Defenders (8)
  {
    id: 4,
    name: "Jevan Anderson",
    position: "Defender",
    number: 2,
    image: profileImageUrl,
    stats: {
      appearances: 24,
      goals: 1,
      assists: 2
    },
    biography: "Jevan is a strong, consistent defender who brings professional experience to the backline."
  },
  {
    id: 5,
    name: "Darryn Kelly",
    position: "Defender",
    number: 4,
    image: profileImageUrl,
    stats: {
      appearances: 22,
      goals: 3,
      assists: 1
    },
    biography: "A commanding centre-back with excellent aerial ability and leadership qualities."
  },
  {
    id: 6,
    name: "Ryan Cunningham",
    position: "Defender",
    number: 3,
    image: profileImageUrl,
    stats: {
      appearances: 20,
      assists: 4
    },
    biography: "Ryan is an attacking full-back known for his pace and crossing ability."
  },
  {
    id: 7,
    name: "Dean Lawrie",
    position: "Defender",
    number: 5,
    image: profileImageUrl,
    stats: {
      appearances: 19,
      goals: 2
    },
    biography: "Dean is a versatile defender who can play in multiple positions across the backline."
  },
  {
    id: 8,
    name: "Mark Campbell",
    position: "Defender",
    number: 12,
    image: profileImageUrl,
    stats: {
      appearances: 17,
      goals: 0,
      assists: 3
    },
    biography: "Mark is a technically gifted defender who's comfortable playing out from the back."
  },
  {
    id: 9,
    name: "Scott Ross",
    position: "Defender",
    number: 15,
    image: profileImageUrl,
    stats: {
      appearances: 21,
      goals: 3,
      assists: 0
    },
    biography: "Scott is a no-nonsense defender known for his strength in the tackle and aerial dominance."
  },
  {
    id: 10,
    name: "Jamie Buglass",
    position: "Defender",
    number: 19,
    image: profileImageUrl,
    stats: {
      appearances: 16,
      goals: 1,
      assists: 2
    },
    biography: "Jamie is a promising young defender who reads the game well beyond his years."
  },
  {
    id: 11,
    name: "Craig McKechnie",
    position: "Defender",
    number: 23,
    image: profileImageUrl,
    stats: {
      appearances: 14,
      goals: 0,
      assists: 1
    },
    biography: "Craig is a dependable full-back who excels in one-on-one defensive situations."
  },
  
  // Midfielders (8)
  {
    id: 12,
    name: "Kane Winton",
    position: "Midfielder",
    number: 6,
    image: profileImageUrl,
    stats: {
      appearances: 26,
      goals: 3,
      assists: 5
    },
    biography: "Kane is the engine room of the team, breaking up opposition attacks and starting our own with intelligent passing."
  },
  {
    id: 13,
    name: "Michael Philipson",
    position: "Midfielder",
    number: 8,
    image: profileImageUrl,
    stats: {
      appearances: 25,
      goals: 7,
      assists: 9
    },
    biography: "A creative midfielder with excellent vision and passing ability. Michael creates numerous chances each game."
  },
  {
    id: 14,
    name: "Lachie Macleod",
    position: "Midfielder",
    number: 10,
    image: profileImageUrl,
    stats: {
      appearances: 23,
      goals: 10,
      assists: 7
    },
    biography: "Lachie is a dynamic attacking midfielder known for his skill on the ball and ability to score from distance."
  },
  {
    id: 15,
    name: "Chris Antoniazzi",
    position: "Midfielder",
    number: 14,
    image: profileImageUrl,
    stats: {
      appearances: 20,
      goals: 6,
      assists: 8
    },
    biography: "Chris is a technically gifted midfielder with excellent close control and dribbling ability."
  },
  {
    id: 16,
    name: "Max Alexander",
    position: "Midfielder",
    number: 16,
    image: profileImageUrl,
    stats: {
      appearances: 18,
      goals: 4,
      assists: 6
    },
    biography: "Max is a versatile midfielder who can play in multiple positions across the middle of the park."
  },
  {
    id: 17,
    name: "Paul Lawson",
    position: "Midfielder",
    number: 18,
    image: profileImageUrl,
    stats: {
      appearances: 22,
      goals: 2,
      assists: 10
    },
    biography: "Paul is an experienced midfielder who brings calm and composure to the team's play."
  },
  {
    id: 18,
    name: "Hamish MacLeod",
    position: "Midfielder",
    number: 20,
    image: profileImageUrl,
    stats: {
      appearances: 19,
      goals: 5,
      assists: 3
    },
    biography: "Hamish is a energetic box-to-box midfielder with a powerful shot from distance."
  },
  {
    id: 19,
    name: "Finn Murray",
    position: "Midfielder",
    number: 22,
    image: profileImageUrl,
    stats: {
      appearances: 17,
      goals: 3,
      assists: 4
    },
    biography: "Finn is a promising young talent with excellent technical ability and vision beyond his years."
  },
  
  // Forwards (4)
  {
    id: 20,
    name: "Mark Gilmour",
    position: "Forward",
    number: 9,
    image: profileImageUrl,
    stats: {
      appearances: 28,
      goals: 15,
      assists: 6
    },
    biography: "Mark is a clinical striker with excellent movement and finishing ability. Top scorer last season."
  },
  {
    id: 21,
    name: "Liam Duell",
    position: "Forward",
    number: 11,
    image: profileImageUrl,
    stats: {
      appearances: 25,
      goals: 12,
      assists: 8
    },
    biography: "A pacy winger who loves to take on defenders and create chances for teammates or finish himself."
  },
  {
    id: 22,
    name: "Jack Henderson",
    position: "Forward",
    number: 17,
    image: profileImageUrl,
    stats: {
      appearances: 22,
      goals: 9,
      assists: 7
    },
    biography: "Jack is a versatile forward who can play across the front line, known for his work rate and finishing."
  },
  {
    id: 23,
    name: "Marcus Goodall",
    position: "Forward",
    number: 24,
    image: profileImageUrl,
    stats: {
      appearances: 20,
      goals: 8,
      assists: 5
    },
    biography: "Marcus is a powerful center forward with excellent hold-up play and aerial ability."
  }
];
