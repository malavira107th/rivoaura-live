// Brand Pixel Studio — Shared Data & Constants
// Platform where fans host their own watch parties with built-in audio & chat rooms

export const SITE_NAME = "Brand Pixel Studio";
export const SITE_DOMAIN = "brandpixelstudio.site";

// Images served from CDN
export const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663073602365/SKAJHsMmNePfWoSaEf6sA3/brand-assets/hero.jpg";
export const COMMUNITY_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663073602365/SKAJHsMmNePfWoSaEf6sA3/brand-assets/community.jpg";
export const AUDIO_ROOM_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663073602365/SKAJHsMmNePfWoSaEf6sA3/brand-assets/audio-room.jpg";
export const CRICKET_ACTION_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663073602365/SKAJHsMmNePfWoSaEf6sA3/brand-assets/cricket-action.jpg";
export const HOW_IT_WORKS_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663073602365/SKAJHsMmNePfWoSaEf6sA3/brand-assets/how-it-works-bg.jpg";

export type EventFormat = "T20" | "ODI" | "Test";
export type EventLeague = "Premier League" | "International" | "Regional Cup" | "Super League" | "Championship";
export type EventStatus = "upcoming" | "live" | "completed";
export type EventVisibility = "public" | "private";

export interface WatchPartyEvent {
  id: string;
  title: string;
  team1: string;
  team2: string;
  format: EventFormat;
  league: EventLeague;
  venue: string;
  startTime: string;
  seatsTaken: number;
  maxCapacity: number;
  status: EventStatus;
  visibility: EventVisibility;
  hosts: { name: string; bio: string }[];
  agenda: { time: string; title: string }[];
}

export const TESTIMONIALS = [
  {
    name: "R.D.",
    location: "Fan from South Asia",
    text: "I hosted my first watch party during a major league final — 200 fans joined and the energy was unreal. It felt like having my own commentary box.",
    avatar: "RD"
  },
  {
    name: "P.N.",
    location: "Fan from Europe",
    text: "Living abroad, I missed watching cricket with friends. Now I host a private party for my crew every match day. It's like being back home.",
    avatar: "PN"
  },
  {
    name: "A.S.",
    location: "Fan from North India",
    text: "I joined a public party for a major international match. 5,000 fans, live audio, real-time chat — nothing else comes close to this experience.",
    avatar: "AS"
  }
];

export const FAQ_DATA = [
  {
    question: "What is Brand Pixel Studio?",
    answer: "Brand Pixel Studio is a free platform where cricket fans can host or join live watch parties for any cricket match. Every party comes with built-in audio rooms and live chat, so you can discuss every ball, every wicket, and every boundary with fellow fans in real-time."
  },
  {
    question: "Is it free to use?",
    answer: "Yes, Brand Pixel Studio is 100% free for everyone. Create an account, host a party, or join one — no charges, no hidden fees. We may introduce optional premium features in the future, but the core experience will always be free."
  },
  {
    question: "How do I host a watch party?",
    answer: "Sign up for a free account, click 'Create Party' in the top menu, pick the match, set your capacity (how many fans can join), write your party rules, choose whether it's public or private, and you're live! You control everything — who joins, who speaks, and how the party runs."
  },
  {
    question: "What's the difference between public and private parties?",
    answer: "Public parties appear on the Watch Parties page for anyone to discover and join. Private parties are hidden — only people with your unique invite link can find and join them. Perfect for watching with just your friends or a specific group."
  },
  {
    question: "Do you provide the live video stream of the match?",
    answer: "No. Brand Pixel Studio is a second-screen companion. You watch the match on your own TV or streaming service, and use our platform for the live audio and chat discussion around the game. Think of it as your personal commentary box."
  },
  {
    question: "What can a host control?",
    answer: "As a host, you control everything: the party capacity (how many fans can join), the rules, whether the party is public or private, who can speak in the audio room, and you can mute or remove anyone who breaks your rules. It's your party, your rules."
  },
  {
    question: "What happens if a party is full?",
    answer: "When a party reaches the capacity set by the host, new users see a 'Join Waitlist' button. If someone leaves, the next person on the waitlist gets notified and can join automatically."
  },
  {
    question: "Can I join multiple parties at the same time?",
    answer: "You can register for multiple upcoming parties, but you can only be active in one live audio room at a time. This ensures you're fully present in the conversation."
  },
  {
    question: "Are the audio discussions recorded?",
    answer: "No. All audio is 100% live and never recorded. This encourages spontaneous, real-time conversation and protects the privacy of every participant."
  },
  {
    question: "How do you handle abusive users?",
    answer: "Hosts can mute or remove anyone from their party instantly. Additionally, any user can report abusive behavior with a single click. Repeated violations lead to a permanent ban from the platform."
  },
  {
    question: "Is there a mobile app?",
    answer: "Currently, Brand Pixel Studio is a mobile-first web platform — it works perfectly on any modern phone browser. A native mobile app is on our roadmap."
  },
  {
    question: "How is this different from a regular group chat or voice call?",
    answer: "Brand Pixel Studio is purpose-built for live cricket. It has structured audio rooms (not chaotic group chats), host moderation tools, match-specific parties with countdowns, capacity management, and a community of cricket fans — not a general-purpose chat app."
  }
];
