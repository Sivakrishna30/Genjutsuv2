export interface SupportedGame {
  id: string;
  title: string;
  shortTitle?: string;
  launcher: "Steam" | "Epic Games" | "Xbox";
  launcherIcon: string;
  launcherColor: string;
  image: string;
  genre: string;
  resolution: string;
  fps: string;
  description: string;
}

export const SUPPORTED_GAMES: SupportedGame[] = [
  {
    id: "hogwarts-legacy",
    title: "Hogwarts Legacy",
    launcher: "Epic Games",
    launcherIcon: "https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg",
    launcherColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/990080/library_600x900_2x.jpg",
    genre: "Action RPG / Open World",
    resolution: "4K UHD Ready",
    fps: "60 - 120 FPS",
    description: "Experience Hogwarts in the 1800s. Your character is a student who holds the key to an ancient secret."
  },
  {
    id: "mortal-kombat-x",
    title: "Mortal Kombat X",
    launcher: "Steam",
    launcherIcon: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
    launcherColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/307780/library_600x900_2x.jpg",
    genre: "Fighting / Competitive",
    resolution: "1440p / 4K Ready",
    fps: "60 FPS Locked",
    description: "Combines cinematic presentation with all new gameplay to deliver the most brutal Kombat experience ever."
  },
  {
    id: "batman-arkham-city-goty",
    title: "Batman: Arkham City - Game of the Year Edition",
    shortTitle: "Batman: Arkham City GOTY",
    launcher: "Steam",
    launcherIcon: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
    launcherColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/200260/library_600x900_2x.jpg",
    genre: "Action / Adventure",
    resolution: "4K UHD Ready",
    fps: "60 - 120 FPS",
    description: "Delivers an intensely atmospheric experience with the definitive Gotham City rogues gallery."
  },
  {
    id: "ea-fc-25",
    title: "EA SPORTS FC™ 25",
    launcher: "Xbox",
    launcherIcon: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg",
    launcherColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2669320/library_600x900_2x.jpg",
    genre: "Sports / Football Simulation",
    resolution: "4K UHD Ready",
    fps: "60 - 120 FPS",
    description: "Features FC IQ tactical overhaul, 5v5 Rush mode, and unparalleled football authenticity across global leagues."
  },
  {
    id: "rise-of-the-tomb-raider",
    title: "Rise of the Tomb Raider™",
    launcher: "Steam",
    launcherIcon: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
    launcherColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/391220/library_600x900_2x.jpg",
    genre: "Action / Survival Adventure",
    resolution: "4K UHD Ready",
    fps: "60 - 120 FPS",
    description: "Join Lara Croft on her first tomb raiding expedition into the treacherous wilderness of Siberia."
  },
  {
    id: "need-for-speed-heat",
    title: "Need for Speed™ Heat",
    launcher: "Xbox",
    launcherIcon: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg",
    launcherColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1222680/library_600x900_2x.jpg",
    genre: "Racing / Street Car Culture",
    resolution: "4K UHD Ready",
    fps: "60 - 120 FPS",
    description: "Hustle by day and risk it all by night in a thrilling street racer where rogue police lines blur as the sun sets."
  }
];
