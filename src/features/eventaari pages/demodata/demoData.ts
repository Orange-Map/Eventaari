export type EventItem = {
  id: string;
  title: string;
  category: string;
  displayDate?: string;
  date?: string;
  calendarDate?: string;
  time: string;
  location: string;
  description: string;
};

export type Challenge = {
  id: string;
  title: string;
  reward: string;
  description: string;
};

export type Badge = {
  title: string;
  icon: string;
  requirement: number;
  goal: string;
  description: string;
};

export const STORAGE_KEYS = {
  customEvents: "eventaari_custom_events_familiar_structure",
  completedChallenges: "eventaari_completed_challenges_familiar_structure",
};

export const USER_PROGRESS = {
  baseXP: 1375,
  xpPerLevel: 2000,
  levelNames: {
    1: "Explorer",
    2: "Event Scout",
    3: "Bus Stop Hero",
    4: "Party Animal",
    5: "Coffee Commander",
    6: "Badge Collector",
    7: "Local Legend",
  } as Record<number, string>,
};

export const baseEvents: EventItem[] = [
  {
    id: "fight-club-festival",
    title: "Fight club Festival",
    category: "Music",
    displayDate: "24.09.1984",
    calendarDate: "1984-09-24",
    time: "18:00",
    location: "Land somewhere far",
    description:
      "A totally normal music event. Nothing suspicious. Please do not ask what the first rule is.",
  },
  {
    id: "lorem-exhibition-night",
    title: "Lorem ipsum Exhibition Night",
    category: "Culture",
    displayDate: "25.01.2028",
    calendarDate: "2028-01-25",
    time: "12:00",
    location: "Isengard",
    description:
      "A culture evening for people who enjoy placeholder text, dramatic towers and questionable travel plans.",
  },
  {
    id: "does-anybody-read-these",
    title: "Does anybody even read these?",
    category: "Sports",
    displayDate: "26.02.3000",
    calendarDate: "3000-02-26",
    time: "10:00",
    location: "The sun",
    description:
      "Extreme sports taken maybe a little too literally. Sunscreen is probably not enough.",
  },
  {
    id: "space-food-market",
    title: "Space Food Market",
    category: "Food",
    displayDate: "27.02.2029",
    calendarDate: "2029-02-27",
    time: "16:00",
    location: "In the spaceship",
    description:
      "Taste food that is definitely edible and probably not floating away from the plate.",
  },
  {
    id: "community-heist",
    title: "Community Heist",
    category: "Community",
    displayDate: "28.08.2035",
    calendarDate: "2035-08-28",
    time: "14:00",
    location: "it's a secret",
    description:
      "A mysterious community event. The location is secret, but somehow everyone knows where to go.",
  },
];

export const challenges: Challenge[] = [
  {
    id: "first-event",
    title: "Attend your first event",
    reward: "+100 XP",
    description:
      "Open the Events page and pick one event that looks interesting enough to leave the house for.",
  },
  {
    id: "new-category",
    title: "Try a new category",
    reward: "+150 XP",
    description:
      "Explore a category you would not normally choose, even if it sounds new.",
  },
  {
    id: "coffee-quest",
    title: "Find the coffee route",
    reward: "+200 XP",
    description:
      "Discover an event or place that could reasonably lead to coffee. Very important student research.",
  },
  {
    id: "last-bus",
    title: "Catch the last bus",
    reward: "+250 XP",
    description:
      "Attend an evening event and still make it home. Via train or bus. Or teleportation if you are lucky.",
  },
];

export const badges: Badge[] = [
  {
    title: "Party Animal",
    icon: "🎤",
    requirement: 1,
    goal: "attend 1 student-style event.",
    description:
      "You survived your first student-style event and lived to tell the story.",
  },
  {
    title: "Badge Hunter",
    icon: "🧵",
    requirement: 2,
    goal: "Collect events from 3 different categories.",
    description: "For users who collect experiences like overall patches.",
  },
  {
    title: "cafestronaut Veteran",
    icon: "☕",
    requirement: 2,
    goal: "Attend 2 café, food or campus break events.",
    description: "You understand that coffee is basically student fuel.",
  },
  {
    title: "Overalls Hero",
    icon: "🚌",
    requirement: 3,
    goal: "Attend 1 evening event.",
    description: "You made it home after an evening event. Somehow.",
  },
  {
    title: "Torille!",
    icon: "🏆",
    requirement: 3,
    goal: "Save or attend 1 local city event.",
    description:
      "A badge for finding something worth leaving the house for.",
  },
  {
    title: "Restaraunt Master",
    icon: "🌭",
    requirement: 3,
    goal: "Save or attend 1 food or market event.",
    description: "You found a food event that feels suspiciously Finnish.",
  },
  {
    title: "Sisu Mode",
    icon: "🧊",
    requirement: 4,
    goal: "Complete 3 local challenges.",
    description:
      "You explored even when staying inside would have been easier.",
  },
  {
    title: "Local Legend",
    icon: "📍",
    requirement: 4,
    goal: "Complete 5 local challenges in the full version.",
    description:
      "You are starting to look like someone who knows the city.",
  },
];

export const leaderboard = [
  {
    name: "Spurdo spärdö",
    level: "Level 7 Local Legend",
    initials: "AK",
    profileImage: "/assets/sprudo.png",
  },
  {
    name: "test 123",
    level: "Level 5 Coffee Commander",
    initials: "MM",
    profileImage: "",
  },
  {
    name: "Mikko Mallikas",
    level: "Level 4 Sitsit Survivor",
    initials: "SN",
    profileImage: "",
  },
  {
    name: "Hämeenlinna Student",
    level: "Level 3 Bus Stop Hero",
    initials: "JV",
    profileImage: "",
  },
  {
    name: "Demo User",
    level: "Level 1 Explorer",
    initials: "DU",
    profileImage: "/assets/profile-picture.png",
  },
];

export function getChallengeXP(challenge: Challenge) {
  const match = challenge.reward.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

export function calculateUserProgress(completedIds: string[]) {
  const challengeXP = challenges
    .filter((challenge) => completedIds.includes(challenge.id))
    .reduce((total, challenge) => total + getChallengeXP(challenge), 0);

  const totalXP = USER_PROGRESS.baseXP + challengeXP;
  const level = Math.floor(totalXP / USER_PROGRESS.xpPerLevel) + 1;
  const currentLevelXP = totalXP % USER_PROGRESS.xpPerLevel;
  const neededXP = USER_PROGRESS.xpPerLevel - currentLevelXP;
  const levelName = USER_PROGRESS.levelNames[level] || "Local Legend";

  return {
    totalXP,
    level,
    levelName,
    levelLabel: `Level ${level} ${levelName}`,
    currentLevelXP,
    neededXP,
    progressPercent: (currentLevelXP / USER_PROGRESS.xpPerLevel) * 100,
  };
}
