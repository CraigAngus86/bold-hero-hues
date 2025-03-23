
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

export const players: Player[] = [
  {
    id: 1,
    name: "Daniel Hoban",
    position: "Goalkeeper",
    number: 1,
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 10,
      cleanSheets: 4
    },
    biography: "Fraser provides strong competition for the goalkeeper position and has made vital saves when called upon."
  },
  {
    id: 3,
    name: "Jevan Anderson",
    position: "Defender",
    number: 2,
    image: "https://images.unsplash.com/photo-1631757229605-c990f337570f?auto=format&fit=crop&w=800&q=80",
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
    image: "https://images.unsplash.com/photo-1627076632318-8b9a16723e81?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 22,
      goals: 3,
      assists: 1
    },
    biography: "A commanding centre-back with excellent aerial ability and leadership qualities."
  },
  {
    id: 5,
    name: "Ryan Cunningham",
    position: "Defender",
    number: 3,
    image: "https://images.unsplash.com/photo-1605971658318-d527373e4d5d?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 20,
      assists: 4
    },
    biography: "Ryan is an attacking full-back known for his pace and crossing ability."
  },
  {
    id: 6,
    name: "Dean Lawrie",
    position: "Defender",
    number: 5,
    image: "https://images.unsplash.com/photo-1590515680467-5417b4e7fedb?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 19,
      goals: 2
    },
    biography: "Dean is a versatile defender who can play in multiple positions across the backline."
  },
  {
    id: 7,
    name: "Kane Winton",
    position: "Midfielder",
    number: 6,
    image: "https://images.unsplash.com/photo-1506432278326-7878fc8740cc?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 26,
      goals: 3,
      assists: 5
    },
    biography: "Kane is the engine room of the team, breaking up opposition attacks and starting our own with intelligent passing."
  },
  {
    id: 8,
    name: "Michael Philipson",
    position: "Midfielder",
    number: 8,
    image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 25,
      goals: 7,
      assists: 9
    },
    biography: "A creative midfielder with excellent vision and passing ability. Michael creates numerous chances each game."
  },
  {
    id: 9,
    name: "Lachie Macleod",
    position: "Midfielder",
    number: 10,
    image: "https://images.unsplash.com/photo-1491309055486-24ae511c15c7?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 23,
      goals: 10,
      assists: 7
    },
    biography: "Lachie is a dynamic attacking midfielder known for his skill on the ball and ability to score from distance."
  },
  {
    id: 10,
    name: "Mark Gilmour",
    position: "Forward",
    number: 9,
    image: "https://images.unsplash.com/photo-1499368919119-2c7332a83f39?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 28,
      goals: 15,
      assists: 6
    },
    biography: "Mark is a clinical striker with excellent movement and finishing ability. Top scorer last season."
  },
  {
    id: 11,
    name: "Liam Duell",
    position: "Forward",
    number: 11,
    image: "https://images.unsplash.com/photo-1516292077215-e0e28f992fe4?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 25,
      goals: 12,
      assists: 8
    },
    biography: "A pacy winger who loves to take on defenders and create chances for teammates or finish himself."
  },
  {
    id: 12,
    name: "Jack Henderson",
    position: "Forward",
    number: 17,
    image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=800&q=80",
    stats: {
      appearances: 22,
      goals: 9,
      assists: 7
    },
    biography: "Jack is a versatile forward who can play across the front line, known for his work rate and finishing."
  }
];
