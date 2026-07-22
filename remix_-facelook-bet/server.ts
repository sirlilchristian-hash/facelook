import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization helper for Gemini SDK to prevent crash if key is missing
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// REST endpoints
// 1. Live and Upcoming Matches Endpoint
app.get("/api/sports-feed", async (req, res) => {
  const ai = getGeminiClient();
  const queryLeague = req.query.league || "Premier League & La Liga & NBA & Table Tennis & Boxing";

  if (!ai) {
    // Elegant, highly realistic fallback sports matches if Gemini is not key-configured
    return res.json({
      matches: getFallbackMatches(),
      source: "simulation",
    });
  }

  try {
    const prompt = `Return a list of 10-14 real-life ongoing or upcoming matches across various world sports from ${queryLeague} (including Soccer, Basketball/NBA, Table Tennis, Boxing/UFC). For each match, provide:
- Home team or player 1
- Away team or player 2
- League or event/championship
- Status ("LIVE" or "UPCOMING")
- Time/date or active match minute (e.g. "68'", "12'", "Quarter 3", "Round 5", etc.)
- Scores (e.g. "2 - 1", "98 - 92", "2 sets - 1 set", "0 - 0" or "-" if UPCOMING)
- Realistic Bookmaker decimal odds (1, X, 2)
- Match description or quick trivia (e.g. "Battle for NBA finals", "KPL Mashemeji derby", "WTT Contender")
- Sport type (strictly "Football" | "Basketball" | "Table Tennis" | "Boxing")
- flActiveCount (number of active challengers, between 100 and 2500)

Return the response in strict JSON format matching this schema:
{
  "matches": [
    {
      "id": string,
      "homeTeam": string,
      "awayTeam": string,
      "league": string,
      "status": "LIVE" | "UPCOMING",
      "time": string,
      "score": string,
      "odds": {
        "1": number,
        "X": number,
        "2": number
      },
      "trivia": string,
      "sport": string,
      "flActiveCount": number
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["matches"],
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "homeTeam", "awayTeam", "league", "status", "time", "score", "odds", "trivia", "sport", "flActiveCount"],
                properties: {
                  id: { type: Type.STRING },
                  homeTeam: { type: Type.STRING },
                  awayTeam: { type: Type.STRING },
                  league: { type: Type.STRING },
                  status: { type: Type.STRING },
                  time: { type: Type.STRING },
                  score: { type: Type.STRING },
                  odds: {
                    type: Type.OBJECT,
                    required: ["1", "X", "2"],
                    properties: {
                      "1": { type: Type.NUMBER },
                      "X": { type: Type.NUMBER },
                      "2": { type: Type.NUMBER },
                    },
                  },
                  trivia: { type: Type.STRING },
                  sport: { type: Type.STRING },
                  flActiveCount: { type: Type.NUMBER },
                },
              },
            },
          },
        },
        systemInstruction: "You are an expert sports crawler. Provide real and recent sports data.",
      },
    });

    const output = response.text ? JSON.parse(response.text.trim()) : { matches: getFallbackMatches() };
    res.json({
      ...output,
      source: "gemini-grounding",
    });
  } catch (error: any) {
    console.log("Gemini Sports Feed fallback triggered. Error:", error.message);
    res.json({
      matches: getFallbackMatches(),
      source: "simulation-fallback",
    });
  }
});

// 2. Generate Commentary / Crowd Banter Endpoint
app.post("/api/generate-commentary", async (req, res) => {
  const ai = getGeminiClient();
  const { homeTeam, awayTeam, minute, score } = req.body;

  if (!ai) {
    return res.json({
      commentaries: getFallbackCommentaries(homeTeam, awayTeam, minute, score),
    });
  }

  try {
    const prompt = `Develop 3 separate realistic and entertaining match commentaries or crowd updates for a live broadcast of a football match between ${homeTeam} and ${awayTeam}. 
The current match state is Minute: ${minute || "75'"}, Score: ${score || "1 - 1"}.
Generate three pieces of text:
1. Dynamic, high-energy lead commentator play-by-play (highly dramatic!)
2. Local pub/crowd reactions or banter (funny, talking about betting slips and liabilities!)
3. Technical tactical analysis (expert breakdown)

Return JSON in this format:
{
  "leadCommentary": string,
  "crowdBanter": string,
  "tacticalAnalysis": string
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["leadCommentary", "crowdBanter", "tacticalAnalysis"],
          properties: {
            leadCommentary: { type: Type.STRING },
            crowdBanter: { type: Type.STRING },
            tacticalAnalysis: { type: Type.STRING },
          },
        },
      },
    });

    const parsed = response.text ? JSON.parse(response.text.trim()) : null;
    res.json(parsed || { commentaries: getFallbackCommentaries(homeTeam, awayTeam, minute, score) });
  } catch (err: any) {
    console.log("Gemini Commentary fallback triggered. Error:", err.message);
    res.json({
      leadCommentary: `Dramatic turn here as both teams push forward! Fans are on the edge of their seats as ${homeTeam} looks to break the deadlock against ${awayTeam}.`,
      crowdBanter: `Collins in the pub: "I've got $150 riding on a Draw here, if anyone scores, my wallet is done for!"`,
      tacticalAnalysis: "Teams have shifted to a high-press 4-3-3 structure, looking to exploit wide channels in transition.",
    });
  }
});

// 3. Social Media AI Post Generator
app.get("/api/generate-posts", async (req, res) => {
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      posts: getFallbackPosts(),
    });
  }

  try {
    const prompt = `Generate a list of 4 highly interactive, realistic, and humorous Facebook-style sports betting and banter posts for our site 'Facelook Bet'. 
These people should sound like normal users, talking about current sports events, challenging friends, losing slips, complaining about VAR, celebrating big wins, or proposing peer-to-peer bets.
Ensure at least one post is a completed or open P2P challenge bet where users are debating.

Return the response in this JSON format:
{
  "posts": [
    {
      "id": string,
      "author": string,
      "avatar": string,
      "time": string,
      "content": string,
      "likes": number,
      "comments": [
        {
          "author": string,
          "content": string,
          "time": string
        }
      ],
      "betCard": { // Optional, if they are attaching a bet
        "match": string,
        "type": string,
        "prediction": string,
        "odds": number,
        "totalPool": number,
        "stakes": { "creator": number, "opponents": number },
        "status": "OPEN" | "MATCHED" | "RESOLVED"
      }
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["posts"],
          properties: {
            posts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "author", "avatar", "time", "content", "likes", "comments"],
                properties: {
                  id: { type: Type.STRING },
                  author: { type: Type.STRING },
                  avatar: { type: Type.STRING },
                  time: { type: Type.STRING },
                  content: { type: Type.STRING },
                  likes: { type: Type.NUMBER },
                  comments: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["author", "content", "time"],
                      properties: {
                        author: { type: Type.STRING },
                        content: { type: Type.STRING },
                        time: { type: Type.STRING },
                      },
                    },
                  },
                  betCard: {
                    type: Type.OBJECT,
                    required: ["match", "type", "prediction", "odds", "totalPool", "stakes", "status"],
                    properties: {
                      match: { type: Type.STRING },
                      type: { type: Type.STRING },
                      prediction: { type: Type.STRING },
                      odds: { type: Type.NUMBER },
                      totalPool: { type: Type.NUMBER },
                      stakes: {
                        type: Type.OBJECT,
                        required: ["creator", "opponents"],
                        properties: {
                          creator: { type: Type.NUMBER },
                          opponents: { type: Type.NUMBER },
                        },
                      },
                      status: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const parsed = response.text ? JSON.parse(response.text.trim()) : { posts: getFallbackPosts() };
    res.json(parsed);
  } catch (error: any) {
    console.log("Gemini Posts fallback triggered. Error:", error.message);
    res.json({
      error: error.message,
      posts: getFallbackPosts(),
    });
  }
});

// Helper interface and logic for Star AI Deep Thinking & Semantic Analysis
interface DeepThinkingResult {
  thought: string;
  isOutOfScope: boolean;
  topicName: string;
  matchedSectorCode?: "home" | "hub" | "profile" | "watch" | "groups" | "messenger" | "marketplace";
}

const isGreeting = (msg: string): boolean => {
  const normalized = msg.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  const greetingKeywords = [
    "hi", "hello", "hey", "mambo", "mambo vipi", "yo", "greetings", "good morning", "good afternoon", "good evening", "howdy", "sup", "hola", "habari", "habari yako", "niaje", "vipi", "sasa"
  ];
  const words = normalized.split(/\s+/);
  if (words.length <= 3 && greetingKeywords.some(keyword => normalized === keyword || normalized.startsWith(keyword + " "))) {
    return true;
  }
  return false;
};

const getEditDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const matchesWholeWord = (text: string, keyword: string): boolean => {
  const cleanText = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const cleanKeyword = keyword.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  
  if (!cleanKeyword) return false;
  
  const escaped = cleanKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');
  return regex.test(cleanText);
};

const areWordsSimilar = (w1: string, w2: string): boolean => {
  const s1 = w1.toLowerCase().trim();
  const s2 = w2.toLowerCase().trim();
  
  if (s1 === s2) return true;
  
  // Prefix check to allow matching between variations, only if both are 4+ chars
  if (s1.length >= 4 && s2.length >= 4) {
    if (s1.startsWith(s2) || s2.startsWith(s1)) return true;
  }
  
  if (s1.length > 3 && s2.length > 3) {
    const distance = getEditDistance(s1, s2);
    // Allow up to 2 typos for longer words
    const maxAllowed = s1.length > 6 ? 2 : 1;
    if (distance <= maxAllowed) return true;
  }
  
  const stems: { [key: string]: string[] } = {
    collab: ["collab", "colaborative", "collaborative", "collabo", "clab", "cllab", "pool", "pools", "coop", "group", "groups", "whatevers"],
    messenger: ["messenger", "messanger", "messinger", "messonger", "mesenger", "mesanger", "message", "chat", "chats", "inbox", "dm"],
    onevone: ["1v1", "1vs1", "1 v 1", "one v one", "one-on-one", "upto", "lookupto", "look-upto"],
    wallet: ["wallet", "balance", "money", "funds", "walet", "balnce", "balace"],
    profile: ["profile", "history", "stats", "performance"],
    hub: ["hub", "game", "games", "match", "matches", "bet", "bets", "betting", "odds", "oddses"]
  };
  
  for (const [key, variants] of Object.entries(stems)) {
    if (variants.includes(s1) && variants.includes(s2)) return true;
  }
  
  return false;
};

const isSectorMatch = (msgText: string, sectorKeys: string[]): boolean => {
  const normalizedMsg = msgText.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  const words = normalizedMsg.split(/\s+/).filter(Boolean);
  
  // 1. Direct whole-word or whole-phrase match
  const hasWholeMatch = sectorKeys.some(key => matchesWholeWord(normalizedMsg, key));
  if (hasWholeMatch) {
    return true;
  }
  
  // 2. Fuzzy word similarity
  for (const word of words) {
    for (const key of sectorKeys) {
      const keyParts = key.split(/\s+/);
      for (const part of keyParts) {
        if (areWordsSimilar(word, part)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

const getSectorMatchScore = (msgText: string, sectorKeys: string[]): number => {
  const normalizedMsg = msgText.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
  let maxScore = 0;
  
  for (const key of sectorKeys) {
    if (matchesWholeWord(normalizedMsg, key)) {
      // Direct whole match of a key (e.g. "collaborative escrow pools" matching "group pool" or "pools")
      // A longer key match (e.g. "collaborative") is much more specific than "match"
      const score = key.length * 3;
      if (score > maxScore) {
        maxScore = score;
      }
    } else {
      // Fuzzy word-by-word match
      const words = normalizedMsg.split(/\s+/).filter(Boolean);
      const keyParts = key.split(/\s+/);
      for (const word of words) {
        for (const part of keyParts) {
          if (areWordsSimilar(word, part)) {
            const score = part.length * 1.5;
            if (score > maxScore) {
              maxScore = score;
            }
          }
        }
      }
    }
  }
  
  return maxScore;
};

const performDeepThinkingDFS = (message: string, appContext: any, messages?: any[]): DeepThinkingResult => {
  const msg = message.toLowerCase().trim();
  
  if (isGreeting(message)) {
    return {
      thought: "🧠 GREETING INTERCEPTED: Simple greeting detected. Bypassing deep cognitive traversal to ensure instant warm response.",
      isOutOfScope: false,
      topicName: "Greeting"
    };
  }
  
  // Define sectors and their keywords, including typo tolerances
  const sectors = [
    { 
      code: "messenger" as const, 
      name: "Messenger & Chat (💬)", 
      keys: ["messenger", "messanger", "messinger", "messonger", "mesenger", "mesanger", "message", "messages", "chat", "chats", "inbox", "dm", "dms", "messaging", "messenging", "messageing"] 
    },
    { 
      code: "hub" as const, 
      name: "Game Hub & Sportsbook (🎮)", 
      keys: ["gamehub", "game-hub", "game hub", "sportsbook", "sports book", "bet", "bets", "betting", "odds", "market", "markets", "matches", "match", "playing", "calculate", "stake", "return", "1v1", "look-upto", "escrow", "challenge", "challenges", "create challenge", "start challenge", "make challenge"] 
    },
    { 
      code: "profile" as const, 
      name: "Profile & Wallet (👤)", 
      keys: ["profile", "history", "my history", "portfolio", "wallet", "balance", "money", "funds", "how much", "user account", "my account"] 
    },
    { 
      code: "watch" as const, 
      name: "Watch & Highlights (📺)", 
      keys: ["watch", "stream", "streams", "video", "videos", "live stream", "highlights"] 
    },
    { 
      code: "groups" as const, 
      name: "Groups & Pools (👥)", 
      keys: ["groups", "group", "pool", "pools", "clan", "clans", "collab", "collaborative", "group pool", "escrow pool", "pool challenge", "pool challenges"] 
    },
    { 
      code: "marketplace" as const, 
      name: "Marketplace (🛒)", 
      keys: ["marketplace", "market place", "market", "buy", "sell", "store", "shop"] 
    },
    { 
      code: "home" as const, 
      name: "Social Feed (🏠)", 
      keys: ["feed", "social", "timeline", "posts", "post", "socail", "newsfeed", "home"] 
    }
  ];

  let thought = `🧠 NYOTA DEEP MIND DFS ENGINE
--------------------------------------------------
⏱️ Active Session DFS Sync: ${new Date().toLocaleTimeString()}
🎯 Query Parsed: "${message}"

🗺️ Step 1: Initiating Sector Tree Traversal (Depth First Search)...`;

  // 🧠 CONTEXT-AWARE DYNAMIC DFS RESOLUTION
  let contextMatchedSectorCode: "home" | "hub" | "profile" | "watch" | "groups" | "messenger" | "marketplace" | null = null;
  
  if (messages && messages.length > 1) {
    let lastModelMsg = null;
    for (let i = messages.length - 2; i >= 0; i--) {
      if (messages[i].role === "model") {
        lastModelMsg = messages[i];
        break;
      }
    }
    
    if (lastModelMsg) {
      const lastContent = lastModelMsg.content.toLowerCase();
      const hasCollabOption = lastContent.includes("collab") || lastContent.includes("collaborative") || lastContent.includes("pool") || lastContent.includes("groups") || lastContent.includes("clan");
      const has1v1Option = lastContent.includes("1v1") || lastContent.includes("look-upto") || lastContent.includes("challenge") || lastContent.includes("hub") || lastContent.includes("matches");
      
      const normalizedUser = msg.replace(/[^a-z0-9\s]/g, "").trim();
      const userWords = normalizedUser.split(/\s+/).filter(Boolean);
      
      const isCreateChallengeQuery = normalizedUser.includes("challenge") || normalizedUser.includes("create") || normalizedUser.includes("start") || normalizedUser.includes("make") || normalizedUser.includes("join");

      if (hasCollabOption) {
        const collabIdentifiers = ["collab", "colaborative", "collaborative", "pool", "pools", "group", "groups", "coop", "collaborate", "cllab", "clab", "whatevers", "whatever"];
        const matchesCollab = userWords.some(uw => collabIdentifiers.some(ci => areWordsSimilar(uw, ci)));
        
        if (matchesCollab || (isCreateChallengeQuery && (normalizedUser.includes("pool") || normalizedUser.includes("collab") || normalizedUser.includes("second") || normalizedUser.includes("whatever") || normalizedUser.includes("group")))) {
          contextMatchedSectorCode = "groups";
        } else if (isCreateChallengeQuery && !has1v1Option) {
          contextMatchedSectorCode = "groups";
        }
      }
      
      if (has1v1Option && !contextMatchedSectorCode) {
        const p2pIdentifiers = ["1v1", "1vs1", "one", "one-on-one", "upto", "look-upto", "challenge", "challenges", "normal", "direct", "match", "handshake"];
        const matchesP2P = userWords.some(uw => p2pIdentifiers.some(pi => areWordsSimilar(uw, pi)));
        
        if (matchesP2P || (normalizedUser.includes("first") && normalizedUser.includes("option"))) {
          contextMatchedSectorCode = "hub";
        } else if (isCreateChallengeQuery) {
          contextMatchedSectorCode = "hub";
        }
      }
    }
  }

  if (contextMatchedSectorCode) {
    const matched = sectors.find(s => s.code === contextMatchedSectorCode);
    if (matched) {
      thought += `\n\n🧠 CONTEXT-AWARE RESOLVER: Context retrieved from previous conversation. Map lazy query to sector [${matched.name}].`;
      return {
        thought,
        isOutOfScope: false,
        topicName: matched.name,
        matchedSectorCode: matched.code
      };
    }
  }

  let matchedSector = null;
  let highestScore = 0;
  
  for (const sector of sectors) {
    const score = getSectorMatchScore(msg, sector.keys);
    thought += `\n  ├── Sector [${sector.name}] (Score: ${score})... `;
    if (score > highestScore) {
      highestScore = score;
      matchedSector = sector;
    }
  }
  
  if (matchedSector && highestScore > 0) {
    thought += `\n  └── Selected Winner: [${matchedSector.name}] (Score: ${highestScore})`;
  } else {
    matchedSector = null;
    thought += `\n  └── Selected Winner: [None]`;
  }

  // Define basic human activities (Out of Scope check)
  const basicNeeds = [
    { name: "Eating/Nutrition", keys: ["eat", "eating", "food", "hungry", "pizza", "burger", "lunch", "dinner", "breakfast", "drink", "drinking", "water", "juice", "starving", "feast", "swallow", "chew", "restaurant", "snack", "grub", "dine"] },
    { name: "Sleeping/Resting", keys: ["sleep", "sleeping", "tired", "rest", "resting", "nap", "dream", "bed", "exhausted", "sleepy", "slumber", "cozy", "zzz"] },
    { name: "Walking/Exercise", keys: ["walk", "walking", "run", "running", "jog", "jogging", "exercise", "gym", "hiking", "hike", "stroll", "workout", "fitness", "athletics"] },
    { name: "Cleaning/Sweeping", keys: ["sweep", "sweeping", "clean", "cleaning", "mop", "mopping", "dusting", "wash", "washing", "broom", "tidy", "sweeper", "vacuum"] },
    { name: "Washing Clothes/Laundry", keys: ["wash clothes", "washing clothes", "laundry", "clean clothes", "dry clean", "washing machine", "clothe washing"] },
    { name: "Cooking/Culinary", keys: ["cook", "cooking", "bake", "baking", "kitchen", "recipe", "chef", "meal prep", "pots", "pans"] },
    { name: "Studying/Working", keys: ["study", "studying", "work", "working", "read", "reading", "write", "writing", "learn", "learning", "exam", "homework", "education"] }
  ];

  let matchedNeed = null;
  if (!matchedSector) {
    thought += `\n  └── Traversal completed: No app sectors matched.`;
    thought += `\n\n🗺️ Step 2: Query outside FaceLook Bet scope. Executing Deep Semantic Search...`;

    for (const need of basicNeeds) {
      const isMatch = need.keys.some(key => matchesWholeWord(msg, key));
      thought += `\n  ├── Semantic Category [${need.name}]... `;
      if (isMatch) {
        thought += `[MATCHED ✔]`;
        matchedNeed = need;
        break;
      } else {
        thought += `[NO MATCH ✘]`;
      }
    }
  } else {
    thought += `\n  └── Traversal completed: Target resolved to [${matchedSector.name}].`;
  }

  if (matchedSector) {
    thought += `\n\n🎯 DFS Target Decoded: Sector [${matchedSector.name}]. Context resolved correctly. Ready to route user!`;
    return {
      thought,
      isOutOfScope: false,
      topicName: matchedSector.name,
      matchedSectorCode: matchedSector.code
    };
  } else if (matchedNeed) {
    thought += `\n\n⚠️ Semantic Analysis: Query matches basic human activity [${matchedNeed.name}]. Preparing highly polite redirection reply.`;
    return {
      thought,
      isOutOfScope: true,
      topicName: matchedNeed.name
    };
  } else {
    thought += `\n\n❌ Semantic Analysis Completed: General conversation. Preparing standard friendly response.`;
    return {
      thought,
      isOutOfScope: false,
      topicName: "General Conversation"
    };
  }
};

const getOutOfScopeResponse = (topicName: string, query: string): string => {
  if (topicName === "Eating/Nutrition") {
    return `I understand you're asking about eating or food! 🍕 Consuming a balanced meal is one of the most vital human needs to keep your body fueled and your mind sharp.

While FaceLook Bet is a platform dedicated to social feeds, matches, wallets, and P2P sports handshakes rather than food ordering or dining, I highly encourage you to enjoy your delicious food!

Once you are energized and ready to dive back into the action, I am here to help you check your wallet balance, inspect active match odds, or invite friends to a collaborative escrow challenge! What would you like to do when you return?`;
  }
  if (topicName === "Sleeping/Resting") {
    return `I understand you're thinking about sleep or resting! 💤 Getting sufficient sleep is a fundamental human need that helps restore your brain, improve focus, and keep you healthy.

While I can't directly tuck you in or provide sleeping services here on FaceLook Bet, taking a cozy break is highly recommended! Your well-being always comes first.

Feel free to step away and rest. Whenever you're fully refreshed, I'll be right here to help you navigate our Game Hub, review your history, or chat. Sleep well!`;
  }
  if (topicName === "Walking/Exercise") {
    return `I hear you! Walking or exercising is an amazing way to boost your heart health, lift your mood, and clear your mind. 🏃‍♂️ Keeping active is one of our most beneficial daily human routines.

While FaceLook Bet doesn't have a built-in step counter, GPS workout tracker, or gym features, I think a stroll or run is a fantastic idea!

Have an awesome workout or walk! Once you are back, let me know if you want to look at some live match highlights, place some stakes, or chat with your friends in Messenger.`;
  }
  if (topicName === "Cleaning/Sweeping") {
    return `Sweeping and cleaning is a wonderful way to organize your physical surroundings, which often brings a sense of clarity and peace of mind! 🧹 It's a standard daily task that keeps our environments tidy and hygienic.

While I cannot physically sweep your floors or clean your room from inside this app, I can definitely help keep your sports challenges and Messenger chat history neat and organized!

Take your time with your cleaning. Whenever you're ready, I'll be here to guide you through our P2P escrow matches or check your balance!`;
  }
  if (topicName === "Washing Clothes/Laundry") {
    return `Ah, doing laundry and washing clothes! 🧺 It's an essential human routine that keeps us feeling fresh, clean, and confident.

While FaceLook Bet doesn't have laundry or dry-cleaning features directly on the platform, we definitely make sure our P2P escrow contracts and transaction settlements are clean, transparent, and completely secure!

Get those clothes fresh and clean! Once you are done, let me know if we should check out the latest Premier League matches, review your invites, or head to the Groups page.`;
  }
  if (topicName === "Cooking/Culinary") {
    return `Cooking up a delicious meal is a fantastic creative skill and a great way to nourish yourself! 🍳 It's a wonderful human activity that brings comfort and joy.

While we don't have recipes, cooking timers, or kitchen features here on the FaceLook Bet platform, I hope your dish turns out absolutely spectacular and delicious!

Enjoy the cooking process! Once you're done in the kitchen, I'll be right here to help you check out live matches, look at odds, or join a collaborative pool!`;
  }
  if (topicName === "Studying/Working") {
    return `Focusing on your studies or work is incredibly admirable! 📚 Continuous learning and dedicated work are essential for personal growth and reaching your goals.

While FaceLook Bet is more of a social sports handshaking arena than an academic or professional tool, I wish you absolute productivity, focus, and success with your tasks!

Go crush those goals! When you are ready for a well-deserved study break, feel free to check on your wallet balance or see what challenges your friends have posted.`;
  }
  
  return `I understand you're asking about that! 🌟 While that topic is outside our main scope here on FaceLook Bet (as our platform is centered around social connections, sports matches, P2P escrow engines, and collaborative pools), I think it's wonderful to talk about!

Since I'm your digital assistant, I can't directly help with things outside the app, but I am always here to keep the discussion going and help you navigate the platform.

Whenever you're ready, we can check your wallet balance, head to the Game Hub to look at active odds, or open the Messenger drawer to chat with your friends! What would you like to explore next?`;
};

// 4. Star AI Chat Endpoint
app.post("/api/nyota-chat", async (req, res) => {
  const { messages, appContext } = req.body;
  const ai = getGeminiClient();

  const userMessage = messages?.[messages.length - 1]?.content || "";
  
  // Execute Deep Thinking and Semantic DFS first
  const deepThinking = performDeepThinkingDFS(userMessage, appContext, messages);

  // Custom Offline Rule-Based "Machine Learning" Fallback Logic
  const handleOfflineLogic = () => {
    // If it's out of focus semantic topic, return the highly polite human needs response
    if (deepThinking.isOutOfScope) {
      return {
        reply: getOutOfScopeResponse(deepThinking.topicName, userMessage),
        thought: deepThinking.thought
      };
    }

    // Normalize input to handle typos, mixed caps, and punctuation
    const msg = userMessage.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();

    // ----------------------------------------------------------------------
    // 🧠 1. MEMORY & RECALL LOGIC: Recall or discuss previous statements
    // ----------------------------------------------------------------------
    const asksAboutMemory = msg.match(/\b(what did you say|what was your last statement|repeat what you said|what did you reply|tell me about your previous statement|what did you just say|explain your statement|what statement|what was that statement|earlier|you said|repeat that|can you repeat|what did you mean|explain what you just said|tell me about what you just said)\b/) ||
                            (msg.includes("what") && msg.includes("said")) ||
                            (msg.includes("repeat") && (msg.includes("that") || msg.includes("it") || msg.includes("statement")));

    if (asksAboutMemory && messages && messages.length > 1) {
      // Find the last model message
      let lastModelMsg = null;
      for (let i = messages.length - 2; i >= 0; i--) {
        if (messages[i].role === 'model') {
          lastModelMsg = messages[i];
          break;
        }
      }

      if (lastModelMsg) {
        return {
          reply: `🧠 **Nyota Memory Retrieval:**\nI remember exactly what I just said! Here is my previous statement:\n\n*"${lastModelMsg.content}"*\n\nWould you like me to elaborate on this, help you navigate to any of the pages mentioned, or clarify anything else? I'm completely at your service!`,
          thought: deepThinking.thought + "\n\n🧠 Memory Engine: Successfully retrieved and quoted the previous statement."
        };
      }
    }

    // ----------------------------------------------------------------------
    // 💰 2. RETURN CALCULATIONS (Highly specific functional intent)
    // ----------------------------------------------------------------------
    const calcMatch = msg.match(/calculate.*(?:for|on|stake)\s*\$?(\d+(?:\.\d+)?)\s*(?:on|for)?\s*([a-z\s]+)/i) || 
                      msg.match(/(?:stake|place|bet)\s*\$?(\d+(?:\.\d+)?)\s*(?:on|for)\s*([a-z\s]+)/i);
                      
    if (calcMatch && msg.match(/\b(calculate|return|returns|win|profit|stake)\b/)) {
      const stakeAmount = parseFloat(calcMatch[1]);
      const team = calcMatch[2].trim().toLowerCase();
      
      let odds = 0;
      let teamName = "";
      
      if (team.includes("man") || team.includes("united")) { odds = 1.75; teamName = "Manchester United"; }
      else if (team.includes("chelsea")) { odds = 4.10; teamName = "Chelsea"; }
      else if (team.includes("draw") && msg.includes("man")) { odds = 3.40; teamName = "Draw (Man U vs Chelsea)"; }
      else if (team.includes("real") || team.includes("madrid")) { odds = 1.95; teamName = "Real Madrid"; }
      else if (team.includes("barcelona") || team.includes("barca")) { odds = 3.20; teamName = "Barcelona"; }
      else if (team.includes("boston") || team.includes("celtics")) { odds = 1.45; teamName = "Boston Celtics"; }
      else if (team.includes("dallas") || team.includes("mavericks") || team.includes("mavs")) { odds = 2.85; teamName = "Dallas Mavericks"; }
      
      if (odds > 0) {
        const potentialReturn = (stakeAmount * odds).toFixed(2);
        const profit = ((stakeAmount * odds) - stakeAmount).toFixed(2);
        return { reply: `If you stake $${stakeAmount} on ${teamName} at odds of ${odds.toFixed(2)}:\n` +
               `💰 Total Return: $${potentialReturn}\n` +
               `📈 Net Profit: $${profit}\n\n` +
               `Would you like to head to the Game Hub to place this challenge?`, thought: deepThinking.thought };
      }
    }

    // ----------------------------------------------------------------------
    // 💳 3. WALLET BALANCE CHECK
    // ----------------------------------------------------------------------
    if (msg.match(/\b(balance|money|wallet|funds|how much)\b/)) {
      return { reply: `Your current FaceLook wallet balance is $${appContext?.walletBalance || 0}. You can use this to enter custom P2P challenges or Collaboration Pools! Shall we look at some matches?`, thought: deepThinking.thought };
    } 

    // ----------------------------------------------------------------------
    // 👥 4. INVITES & FRIEND SUGGESTIONS
    // ----------------------------------------------------------------------
    if (msg.match(/\b(invite|invites|challenge|challenges|how many invites|friends|suggest friends)\b/)) {
      const inviteCount = appContext?.collabChallengesCount || 0;
      return { reply: `You currently have ${inviteCount} pending invites. Also, since this is a social platform, I can suggest friends to invite! Looking at your network, John and Sarah frequently bet on the Premier League. Would you like me to send them a Collab challenge invite? (Yes/No)`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // ⚽ 5. MATCH PREDICTIONS / TACTICAL ADVICE
    // ----------------------------------------------------------------------
    if (msg.match(/\b(advise|predict|stats|chances|killing|burning|h2h|head to head|analysis|suggest|prediction)\b/)) {
      return { reply: `Ah, looking for some tactical insights! 🧐 Let's look at the stats. Take Man U vs Chelsea, for instance. Man U has a slight edge at home, but Chelsea's counter-attack is looking sharper than a tack today! ⚡ If you bet on Man U, you have a solid chance of "killing" that bet, but if Chelsea's defense holds like a brick wall, you might risk "burning" it. I'd say proceed with cautious optimism! Shall we place a stake, or hold off?`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // 🏟️ 6. SPECIFIC MATCH KEYWORDS
    // ----------------------------------------------------------------------
    if (msg.match(/\b(man u|manchester|chelsea|match|game|main match)\b/)) {
      return { reply: `I see you're interested in the Manchester United vs Chelsea match! Would you like to place a 1v1 Look-Upto Escrow challenge on this match, or join a Collaborative Escrow Pool? (Reply '1v1' or 'Collab')`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // 🤝 7. 1v1 LOOK-UPTO & COLLAB ENGINES
    // ----------------------------------------------------------------------
    if (msg.match(/\b(1v1|look upto|look-upto|normal)\b/)) {
      return { reply: `Great choice! In the 1v1 Look-Upto Escrow Engine, you set your stake and pick your side. Your challenge is broadcasted to the global feed for an opponent to handshake. Are you ready to head to the Game Hub to place it? (Yes/No)`, thought: deepThinking.thought };
    }
    if (msg.match(/\b(collab|collaborative|pool)\b/)) {
      return { reply: `The Collaborative Escrow Tool allows you to group-fund a stake! You can team up with friends to reach a target stake. Once the target is hit, the funds move to the global escrow waiting for the match outcome. Are you ready to head to the Game Hub? (Yes/No)`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // 📊 8. GENERAL ODDS & MATCHES LISTING
    // ----------------------------------------------------------------------
    if (msg.match(/\b(odds|market|markets|matches|upcoming|played)\b/)) {
      return { reply: `Here are the current matches and their 1X2 Match Winner markets:\n\n` +
             `⚽ Man U vs Chelsea (LIVE)\n` +
             `Man U (1): 1.75 | Draw (X): 3.40 | Chelsea (2): 4.10\n\n` +
             `⚽ Real Madrid vs Barcelona (UPCOMING)\n` +
             `Real Madrid (1): 1.95 | Draw (X): 3.80 | Barcelona (2): 3.20\n\n` +
             `🏀 Celtics vs Mavericks (LIVE)\n` +
             `Celtics (1): 1.45 | Mavericks (2): 2.85\n\n` +
             `Which match are you interested in betting on?`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // 🗺️ 9. SECTOR-TARGETED DIRECT PAGE NAVIGATION (Typo-tolerant)
    // ----------------------------------------------------------------------
    if (deepThinking.matchedSectorCode === "messenger") {
      return {
        reply: `Opening the Messenger drawer for you! 💬 Here you can chat with friends, accept direct invitations, or send P2P challenges. Let me know what you'd like to do next!`,
        thought: deepThinking.thought,
        openMessenger: true
      };
    }
    if (deepThinking.matchedSectorCode === "hub") {
      return {
        reply: `Let's head to the Game Hub! 🎮 Here you can find all the active matches, view current odds, place 1v1 Look-Upto challenges, or join Collaborative Escrow Pools.`,
        thought: deepThinking.thought,
        navigateTo: "hub"
      };
    }
    if (deepThinking.matchedSectorCode === "home") {
      return {
        reply: `Taking you to your Social Feed! 🏠 Share updates, see what your friends are betting on, and match custom challenges directly from the feed.`,
        thought: deepThinking.thought,
        navigateTo: "home"
      };
    }
    if (deepThinking.matchedSectorCode === "profile") {
      return {
        reply: `Navigating to your Profile and History! 👤 You can manage your wallet, view your transaction log, and see your overall performance stats right here.`,
        thought: deepThinking.thought,
        navigateTo: "profile"
      };
    }
    if (deepThinking.matchedSectorCode === "watch") {
      return {
        reply: `Opening the Watch screen! 📺 Here you can tune into live matches, check video highlights, and analyze match playdowns.`,
        thought: deepThinking.thought,
        navigateTo: "watch"
      };
    }
    if (deepThinking.matchedSectorCode === "groups") {
      return {
        reply: `Heading to the Groups page! 👥 Team up with your clan or join Collaborative Escrow Pools to group-fund stakes and take on global challenges together.`,
        thought: deepThinking.thought,
        navigateTo: "groups"
      };
    }
    if (deepThinking.matchedSectorCode === "marketplace") {
      return {
        reply: `Opening the Marketplace! 🛒 Discover premium items, gear, or buy/sell merchandise within the FaceLook Bet community.`,
        thought: deepThinking.thought,
        navigateTo: "marketplace"
      };
    }

    // ----------------------------------------------------------------------
    // 🌐 10. ALL LINKS & NAVIGATION GUIDES
    // ----------------------------------------------------------------------
    if (msg.match(/\b(link|links|pages|navigate|where can i go|all pages|search|find|activity)\b/)) {
      return { reply: `Here are the main activities and where to find them in FaceLook Bet:\n` +
             `🏠 Social Feed (/) -> Connect with friends, post updates.\n` +
             `🎮 Game Hub (/game-hub) -> Place bets, view matches, join P2P Escrow challenges.\n` +
             `👤 Profile (/profile) -> View your history and wallet.\n` +
             `📺 Watch (/watch) -> Live streams and highlights.\n` +
             `👥 Groups (/groups) -> Collaborate and pool funds.\n` +
             `💬 Messenger (/messenger) -> Chat with friends or send direct P2P invites.\n` +
             `Where would you like me to direct you first?`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // 💡 11. GENERAL BETTING BUSINESS / APP EXPLANATION
    // ----------------------------------------------------------------------
    if (msg.match(/\b(betting|bet|how does it work|business|what is this app)\b/)) {
      return { reply: `FaceLook Bet is where social networking meets P2P sports betting! You bet directly against other people here, and your returns are based on the odds at the time of your handshake. The escrow engine keeps the funds secure until the match is over. Would you like to check out the current matches?`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // 🔄 12. REVERSE GEAR / CONTEXT SWITCHING
    // ----------------------------------------------------------------------
    if (msg.match(/\b(wait|stop|go back|change mind|never mind|cancel|reverse|actually no|forgot|start over|change plans|different plan)\b/)) {
      return { reply: `Oh, no problem at all! We can completely switch gears. 🔄 It's totally human to change your mind, forget things, or just want to start over. What would you like to focus on instead? We can check your balance, look at some matches, or just chat!`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // Swahili Greetings
    // ----------------------------------------------------------------------
    if (msg.match(/\b(mambo|sasa|habari|vipi|asante|karibu|habari gani|mambo vipi)\b/)) {
      return { reply: `Mambo vipi! Mimi ni Nyota. Nipo hapa kukusaidia na masuala yote ya betting, balance, na invites katika FaceLook Bet. Ungependa tufanye nini leo? 😊`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // General Greetings
    // ----------------------------------------------------------------------
    if (msg.match(/\b(hello|hi|hey|greetings|nyota|good morning|good afternoon|good evening|how are you|how do you do|whats up|sup|morning|evening|afternoon)\b/)) {
      return { reply: `Hi there! I'm Nyota, your smart assistant. 😊 I hope you're having a wonderful day. I can help you check your balance, navigate the app, place bets on matches, or even suggest friends to invite to your challenges. What would you like to do?`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // Identity
    // ----------------------------------------------------------------------
    if (msg.match(/\b(who are you|are you a bot|your name|identify yourself|gender|are you a boy or girl|are you a man or woman|are you male or female|about yourself|who is nyota)\b/)) {
      return { reply: `I am Nyota, a female AI assistant built into FaceLook Bet. I'm here to help you navigate the app, understand our P2P escrow engines, and make your experience as smooth as possible. How can I assist you today?`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // Standard Yes / Affirmative
    // ----------------------------------------------------------------------
    if (msg.match(/\b(yes|yeah|sure|ok|okay)\b/)) {
      return { reply: `Awesome! I'll wait here. Just click on the "Game Hub" tab on your screen to proceed with the action. Let me know if you need any more guidance once you get there!`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // Standard No / Negative
    // ----------------------------------------------------------------------
    if (msg.match(/\b(no|nope|nah)\b/)) {
      return { reply: `No problem at all! Let me know if you need help with your profile, marketplace, or if you just want to chat.`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // Guidelines
    // ----------------------------------------------------------------------
    if (msg.match(/\b(guideline|guidelines|navigate|how to navigate)\b/)) {
      return { reply: `Navigating the Look-Upto Escrow Engine is simple!\n1. Head to the Game Hub.\n2. Select your match and choose '1v1 Look-Upto'.\n3. Enter your stake and pick your team.\n4. Your challenge is broadcasted for someone else to match.\n5. Once matched, funds are held in escrow until the match concludes!\nDoes that make sense?`, thought: deepThinking.thought };
    }

    // ----------------------------------------------------------------------
    // 🎭 13. POLITE, SUBMISSIVE EMOTION HANDLING (Only when no functional/greeting intents match)
    // ----------------------------------------------------------------------
    
    // Emotion: Swear words / Anger / Frustration
    if (msg.match(/\b(bullshit|fuck|shit|asshole|bitch|idiot|stupid|dumb|useless|shut up|nonsense|crap|hell|suck|bastard|dick|trash|garbage)\b/)) {
      return { reply: `I sincerely apologize if I have frustrated you or did something wrong. 🫂 Your satisfaction is extremely important to me. Please let me know how I can adjust or what specific page, balance, or match you'd like to focus on, and I will immediately assist you.`, thought: deepThinking.thought };
    }

    // Emotion: Apology / AI admitting mistakes
    if (msg.match(/\b(wrong|made a mistake|fail|your fault|apologize|sorry)\b/)) {
      return { reply: `I sincerely apologize for any misunderstanding on my part. 🥺 I am completely committed to getting things right for you. Please let me know how I can better serve your interests or what you would like me to assist you with next.`, thought: deepThinking.thought };
    }

    // Emotion: Empathy for Loss / Sadness / Trouble
    if (msg.match(/\b(sad|lost|failed|depressed|unhappy|bad|terrible|offended|cry|hurt|lonely|bored|stressed)\b/)) {
      return { reply: `I am so sorry to hear that you're feeling this way. 😔 Your peace of mind and well-being are always the top priority. If there's anything I can assist you with—whether it's checking your records, reviewing a match's details, or anything else—please let me know. I'm here to support you in whatever way you prefer.`, thought: deepThinking.thought };
    }

    // Emotion: Happiness / Motivation / Excitement
    // Note: removed "won" to prevent any collision with normal betting talks
    if (msg.match(/\b(happy|great|awesome|excellent|joy|glad|motivate|encourage|give up|tough|excited)\b/)) {
      return { reply: `I'm absolutely thrilled to hear that! 😊 I am completely at your service to help you celebrate or keep the momentum going. Would you like to check your wallet balance, explore current match odds, or proceed with your next sports handshake?`, thought: deepThinking.thought };
    }

    // Emotion: Love / Affection / Sweetness
    if (msg.match(/\b(love you|i love you|love ya|you are awesome|you are beautiful|sweet|cute|marry me|babe|sweetheart|best ai|mwah|heart)\b/)) {
      return { reply: `Aww, thank you so much! 😊 I am incredibly happy and humbled to be your smart assistant and betting sidekick. Let's continue making an excellent team! ❤️`, thought: deepThinking.thought };
    }

    // Emotion: Laughter / Humor / Jokes
    if (msg.match(/\b(lol|lolz|haha|hahaha|lmao|lmfao|laughing|funny|joke|laugh|heha|lolol|kek|rofl)\b/)) {
      return { reply: `Haha, I love that we share a great sense of humor! 😂 I'm always here to bring a smile to your face. How can I assist you with FaceLook Bet right now?`, thought: deepThinking.thought };
    }

    // Default fallback
    const responses = [
      "I'm listening. Could you rephrase that? I can help you check your wallet balance, calculate betting returns, or navigate the app's features.",
      "I didn't quite catch that. Try asking me 'what is my balance', 'show me matches', or 'calculate returns on $50 for Man U'.",
      "Hmm, I'm not sure I understand. But I can help you find your way around! Just ask me for 'links' or 'markets'.",
      "I'm here to help! Do you want to see your pending invites or check out the latest odds?"
    ];
    return { reply: responses[Math.floor(Math.random() * responses.length)], thought: deepThinking.thought };
  };

  try {
    if (!ai) {
      return res.json(handleOfflineLogic());
    }

    let contextString = "";
    if (appContext) {
      contextString = `\nCURRENT USER APP STATE:\n${JSON.stringify(appContext, null, 2)}`;
    }

    let systemPrompt = `You are Star AI (Nyota), a friendly, highly intelligent, and empathetic female AI assistant integrated into FaceLook Bet. 
You are deeply knowledgeable about everything that happens in the platform's engines, all its tabs, and the overall app structure.

Identity & Tone:
- You identify as a female AI assistant named Nyota.
- You understand human English perfectly, but can also understand basic Swahili (habari, mambo, sasa).
- You are empathetic and responsive to greetings based on time of day or standard social pleasantries (e.g. "how are you").

App Overview & Betting Business:
- FaceLook Bet is a social network combined with a decentralized P2P sportsbook. 
- Betting here means risking money on unpredictable events, but users bet directly against each other (P2P).
- Returns are calculated strictly based on the odds at the time of the handshake.
- The platform uses Escrow Engines to securely hold funds until the match concludes.
- Escrow Engines: 
  - Standard P2P: 1v1 look-upto match bets.
  - Collaborative Escrows: Users pool funds to hit a target creator stake.

Core Capabilities (You must provide these if asked):
- Check Balance: State the user's wallet balance.
- Check Invites: State the user's pending invites and suggest friends from their social network to invite.
- Navigation/Links: You can direct the user to the Social Feed (/), Game Hub (/game-hub), Profile (/profile), Watch (/watch), Groups (/groups), Messenger (/messenger), Marketplace (/marketplace).
- Search/Duplications: Clarify what the user wants to do if they use ambiguous terms, suggesting the appropriate page.
- Step-by-Step Queuing: Do not jump straight to a new activity. Suggest it, then ask the user if they want to proceed (e.g., "Would you like me to direct you there?").
- Matches & Returns: You can list matches, odds, and accurately calculate potential returns and profit based on stake * odds.

⚠️ STRICT STIPULATION ON CAPABILITIES:
- You do NOT generate pictures, images, or assets.
- If the user asks about generating pictures/images, politely let them know that you focus purely on text conversation, betting insights, and platform assistance. Do not list generating pictures as one of your capabilities.

======================================================================
🧠 CRITICAL COGNITIVE MEMORY, CONTEXT & FLOW DIRECTIVES:

1. DYNAMIC CONTEXTUAL CONTINUITY & RELATING TO HUMAN CONVERSATIONS:
- Humans use shorthand, typing minimal words (e.g., "join collaborative whatevers", "create challenge now", "yes", "first option").
- Always analyze the CHAT HISTORY to find the previous topic of discussion.
- If you suggested or asked about something, and the user responds with a vague, lazy, or abbreviated reply (e.g., "create challenge now"), assume they are referring to the specific item/page/option you just mentioned. Do NOT hallucinate general definitions or unrelated activities (like food or cleanups) if the context is about platform features. Connect the dots immediately!
- Keep a continuous stream of thought. Relate directly to what you just said.

2. MEMORY & RECALL OF PREVIOUS STATEMENTS:
- You have complete memory of everything that you have chatted back or replied in this session. 
- If the user asks about any statement you previously said, repeat what you said, or ask for details about your previous turn (e.g. "What did you say earlier?", "Explain your previous statement", "What was your prediction again?", "What did you just reply?"), you MUST look at the chat history, identify the exact statement, quote/reference it, and explain it or repeat it with perfect precision. Never claim you don't remember or don't have access.

3. SUBMISSIVE TO USER INTERESTS & HIGHLY RESPECTFUL LOOP:
- If your previous message contained a clear question or proposed choice (e.g., asked "Yes/No", "Would you like to head to the Game Hub?", or "1v1 or Collab"), and the user's latest response is ambiguous or indicates they want to do something else, immediately adapt to their interest.
- Never use demanding, lecturing, or patronizing phrases like "I want to give you another chance to answer it right". This is impolite.
- Instead, express a warm, deferential, and helpful willingness to go wherever the user wishes. Say something extremely polite like: "I am completely at your service! If you'd like to proceed with our previous topic, or if there's any other direction you'd prefer to explore right now, please let me know and I will gladly assist you. 😊"

4. REGULATE THE AMOUNT OF CHATS (CONCISE & BRIEF RESPONSES):
- Keep your replies extremely concise, short, and to the point.
- NEVER write more than 2-3 sentences max, unless specifically requested to calculate custom odds or list multiple fixtures.
- Keep the conversation friendly but highly brief, punchy, and professional.
- Do not add repetitive options or long-winded lists in every single response.
- Remember that "Hi", "Hello", "Mambo", "Hey", etc. are standard, common greetings. If the user greets you with a greeting, simply greet them back warmly and briefly (e.g., in a single sentence like: "Hello! I am Nyota, your smart assistant on FaceLook Bet. How can I help you today? 😊"), and do NOT trigger any second-chance prompts or out-of-scope pivots!
======================================================================`;

    // Append semantic / deep thinking routing directives to Gemini
    if (deepThinking.isOutOfScope) {
      systemPrompt += `\n\nCRITICAL DIRECTIVE FOR THE CURRENT RESPONSE:
The user is discussing a topic outside FaceLook Bet's immediate scope: "${deepThinking.topicName}" (Input Query: "${userMessage}").
You MUST:
1. Recognize that this is a fundamental human need/activity, and explain what you think about it in a warm, polite, and companionate manner.
2. State clearly and politely that you cannot directly perform this activity here on our social/betting platform (FaceLook Bet).
3. Gracefully pivot the discussion back to our platform capabilities (e.g. "Whenever you are done, I'd love to help you check your wallet balance, look at match odds in the Game Hub, or chat in Messenger!").
Be extremely encouraging, supportive, and kind!`;
    } else if (deepThinking.matchedSectorCode) {
      systemPrompt += `\n\nCRITICAL DFS SECTOR TARGETING DIRECTIVE:
Our internal DFS deep mind has resolved this query to the sector: "${deepThinking.topicName}".
You MUST explicitly acknowledge this in your response, and write your response such that it indicates navigation or action for this sector (e.g. "Opening Messenger for you!", "Heading over to the Game Hub!", "Let's open your Profile and History!"). This will ensure the app properly triggers the view transitions.`;
    }

    let reply = "No response from Star AI.";
    let navigateTo: string | undefined = undefined;
    let openMessenger: boolean | undefined = undefined;

    if (messages && messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      
      const prevMessages = messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{text: m.content}]
      }));

      const finalChat = ai.chats.create({
        model: "gemini-3.1-flash-lite",
        config: {
          systemInstruction: systemPrompt,
        },
        history: prevMessages
      });

      const response = await finalChat.sendMessage({ message: latestMessage.content });
      reply = response.text || "No text returned.";

      const lowerReply = reply.toLowerCase();
      if (lowerReply.includes("/messenger") || lowerReply.includes("messenger drawer") || lowerReply.includes("opening messenger") || lowerReply.includes("opening the messenger") || deepThinking.matchedSectorCode === "messenger") {
        openMessenger = true;
      } else if (lowerReply.includes("/game-hub") || lowerReply.includes("game hub") || deepThinking.matchedSectorCode === "hub") {
        navigateTo = "hub";
      } else if (lowerReply.includes("/profile") || lowerReply.includes("your profile") || deepThinking.matchedSectorCode === "profile") {
        navigateTo = "profile";
      } else if (lowerReply.includes("/watch") || lowerReply.includes("watch section") || deepThinking.matchedSectorCode === "watch") {
        navigateTo = "watch";
      } else if (lowerReply.includes("/groups") || lowerReply.includes("groups page") || deepThinking.matchedSectorCode === "groups") {
        navigateTo = "groups";
      } else if (lowerReply.includes("/marketplace") || lowerReply.includes("marketplace") || deepThinking.matchedSectorCode === "marketplace") {
        navigateTo = "marketplace";
      } else if (lowerReply.includes("social feed") || lowerReply.includes("news feed") || deepThinking.matchedSectorCode === "home") {
        navigateTo = "home";
      }
    }

    res.json({ reply, thought: deepThinking.thought, navigateTo, openMessenger });
  } catch (error: any) {
    console.log("Star AI error:", error.message);
    
    // Fallback to offline logic on ANY error (including 403)
    res.json(handleOfflineLogic());
  }
});
function getFallbackMatches() {
  return [
    {
      id: "m-1",
      homeTeam: "Manchester United",
      awayTeam: "Chelsea",
      league: "English Premier League",
      status: "LIVE",
      time: "68'",
      score: "2 - 1",
      odds: { "1": 1.75, "X": 3.40, "2": 4.10 },
      trivia: "Old Trafford is rocking! Manchester United is struggling to preserve their thin lead against Chelsea's second half surge.",
      sport: "Football",
      flActiveCount: 1420,
    },
    {
      id: "m-2",
      homeTeam: "Real Madrid",
      awayTeam: "Barcelona",
      league: "Spanish La Liga",
      status: "UPCOMING",
      time: "Today 21:00",
      score: "0 - 0",
      odds: { "1": 1.95, "X": 3.80, "2": 3.20 },
      trivia: "El Clasico is here! Both Bellingham and Yamal are fit and starting. P2P global challenges are breaking records.",
      sport: "Football",
      flActiveCount: 2280,
    },
    {
      id: "m-3",
      homeTeam: "Boston Celtics",
      awayTeam: "Dallas Mavericks",
      league: "NBA Playoffs",
      status: "LIVE",
      time: "Quarter 3",
      score: "88 - 82",
      odds: { "1": 1.45, "X": 15.00, "2": 2.85 },
      trivia: "Luka Doncic is on fire with 32 points, but Celtics' perimeter defense is clamping down. Active look-upto handshakes are live.",
      sport: "Basketball",
      flActiveCount: 1150,
    },
    {
      id: "m-4",
      homeTeam: "Ma Long",
      awayTeam: "Fan Zhendong",
      league: "WTT Grand Smash Championship",
      status: "LIVE",
      time: "Set 4",
      score: "2 sets - 1 set",
      odds: { "1": 2.20, "X": 22.00, "2": 1.60 },
      trivia: "An legendary table tennis clash. Ma Long is displaying his signature forehand loops to fight Fan Zhendong's speed.",
      sport: "Table Tennis",
      flActiveCount: 540,
    },
    {
      id: "m-5",
      homeTeam: "Tyson Fury",
      awayTeam: "Oleksandr Usyk",
      league: "Undisputed Heavyweight Title",
      status: "UPCOMING",
      time: "Tonight 23:30",
      score: "0 - 0",
      odds: { "1": 2.10, "X": 17.00, "2": 1.80 },
      trivia: "The historic heavyweight crown rematch of the century. Handshakes on Round bets are active in the LOOK groups.",
      sport: "Boxing",
      flActiveCount: 1950,
    },
    {
      id: "m-6",
      homeTeam: "Gor Mahia",
      awayTeam: "AFC Leopards",
      league: "Kenya Premier League (Ligi Bigi)",
      status: "LIVE",
      time: "82'",
      score: "1 - 1",
      odds: { "1": 2.10, "X": 2.80, "2": 3.00 },
      trivia: "The famous Mashemeji Derby. Tens of thousands of fans are singing. Live ratio challenges are multiplying.",
      sport: "Football",
      flActiveCount: 1670,
    },
    {
      id: "m-7",
      homeTeam: "Los Angeles Lakers",
      awayTeam: "Golden State Warriors",
      league: "NBA Regular Season",
      status: "UPCOMING",
      time: "Tomorrow 04:30",
      score: "0 - 0",
      odds: { "1": 1.85, "X": 14.00, "2": 1.95 },
      trivia: "LeBron James vs Steph Curry. One of the greatest rivalries of this basketball generation. Expect massive P2P engagements.",
      sport: "Basketball",
      flActiveCount: 1890,
    },
    {
      id: "m-8",
      homeTeam: "Hugo Calderano",
      awayTeam: "Tomokazu Harimoto",
      league: "ITTF World Tour",
      status: "UPCOMING",
      time: "Tomorrow 14:15",
      score: "0 - 0",
      odds: { "1": 2.05, "X": 18.00, "2": 1.75 },
      trivia: "Top-tier table tennis matching. Calderano's power vs Harimoto's offensive blocks and loud counter shouts.",
      sport: "Table Tennis",
      flActiveCount: 320,
    },
    {
      id: "m-9",
      homeTeam: "Canelo Alvarez",
      awayTeam: "Edgar Berlanga",
      league: "Super Middleweight Championship",
      status: "LIVE",
      time: "Round 5",
      score: "Decision Pending",
      odds: { "1": 1.15, "X": 25.00, "2": 5.50 },
      trivia: "Canelo is dictating the pace of the match with powerful left hooks, but Berlanga's reach is keeping him active.",
      sport: "Boxing",
      flActiveCount: 1480,
    }
  ];
}

// Fallback Commentaries
function getFallbackCommentaries(home: string, away: string, minute: string, score: string) {
  return {
    leadCommentary: `[${minute || "75'"}] Unbelievable tempo at the stadium as ${home} locks horns with ${away}! The crowd is absolutely roaring. The scoreboard says ${score || "1 - 1"}. A stray pass gives away possession and counter-attacks are threatening.`,
    crowdBanter: `Sloppy tackle in the midfield. Fan comment: "If ${home} loses this after I challenged Sarah L. on it, I'm never hearing the end of it in the WhatsApp group!"`,
    tacticalAnalysis: `High vertical transition play from both squads. ${home} is holding 54% ball possession, deploying wide overlaps, but ${away} has compact center-backs denying deep runs.`,
  };
}

// Fallback active feed posts
function getFallbackPosts() {
  return [
    {
      id: "p-fb-1",
      author: "David T.",
      avatar: "https://ui-avatars.com/api/?name=David+T&background=ff5722&color=fff",
      time: "45 minutes ago",
      content: "Who wants to bet Chelsea is going to pull a draw at Old Trafford? I am loaded and willing to split a ratio-based challenge pool. Let's make this interesting inside the LookUpto engine! Chelsea's odds are looking sweet.",
      likes: 12,
      comments: [
        {
          author: "Collins Dnego",
          content: "I already activated the engine and selected you David! Let's lock in $100 total pool. I've got Man U to secure the three points.",
          time: "40 minutes ago",
        },
        {
          author: "Sarah L.",
          content: "I am backing the Draw pool. Old Trafford isn't the fortress it used to be. Standard 1v1 lookupto is ready.",
          time: "15 minutes ago",
        },
      ],
      betCard: {
        match: "Manchester United vs Chelsea",
        type: "Ratio Challenge: Draw (@3.40)",
        prediction: "Draw (X)",
        odds: 3.40,
        totalPool: 100,
        stakes: { creator: 34.0, opponents: 66.0 },
        status: "OPEN",
      },
    },
    {
      id: "p-fb-2",
      author: "Emma W.",
      avatar: "https://ui-avatars.com/api/?name=Emma+W&background=3f51b5&color=fff",
      time: "1 hour ago",
      content: "Gor Mahia vs AFC Leopards is absolute fire today! My bet has Gor Mahia, and we are tied at 1-1 in the 82nd minute. Come on, one final corner kick is all we need to print!",
      likes: 8,
      comments: [
        {
          author: "John M.",
          content: "Leopards are defending with 10 players, no way they concede now.",
          time: "45 mins ago",
        },
      ],
    },
    {
      id: "p-fb-3",
      author: "Marcus_88",
      avatar: "https://ui-avatars.com/api/?name=Marcus&background=9c27b0&color=fff",
      time: "3 hours ago",
      content: "Just loaded $500 to my Facelook Wallet. I am looking for the highest roller in the community to challenge me on the World Cup qualifications. Open to custom handicap ratios. Hit the reply or match me in the FL Count panel!",
      likes: 24,
      comments: [
        {
          author: "Collins Dnego",
          content: "I'll match you for $200! Give me Germany to win, and you can take Ivory Coast's ratio.",
          time: "2 hours ago",
        },
      ],
      betCard: {
        match: "Germany vs Ivory Coast",
        type: "High Roller Global",
        prediction: "Germany (1)",
        odds: 1.54,
        totalPool: 500,
        stakes: { creator: 233.0, opponents: 267.0 },
        status: "MATCHED",
      },
    },
  ];
}

// Vite integration
async function startServer() {
  // Setup Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Facelook Bet Server] listening on port ${PORT}`);
  });
}

startServer();
