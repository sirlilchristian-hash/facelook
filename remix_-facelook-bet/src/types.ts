export interface Event {
  id: string;
  title: string;
  matchBanner: string;
  competition: string;
  date: string;
  time: string;
  venue: string;
  participants: number;
  openChallenges: number;
  openPools: number;
  status: "PENDING" | "VERIFIED";
  verificationConfirmations: number;
  homeOdds?: number;
  drawOdds?: number;
  awayOdds?: number;
  homePrediction?: number;
  drawPrediction?: number;
  awayPrediction?: number;
  totalEscrow?: number;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  status: "LIVE" | "UPCOMING";
  time: string;
  score: string;
  odds: {
    "1": number;
    X: number;
    "2": number;
  };
  trivia: string;
  flActiveCount: number;
}

export interface BetCard {
  match: string;
  type: string;
  prediction: string;
  odds: number;
  totalPool: number;
  stakes: {
    creator: number;
    opponents: number;
  };
  status: "OPEN" | "MATCHED" | "RESOLVED";
}

export interface Comment {
  id?: string;
  author: string;
  content: string;
  time: string;
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: Comment[];
  betCard?: BetCard;
  hasLiked?: boolean;
  isGlobalChannel?: boolean;
  reaction?: "like" | "wow" | "love" | "sad" | "lol" | "star";
  repostOf?: Post;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "idle" | "offline";
  mutualFriends: number;
}

export interface Group {
  id: string;
  name: string;
  coverImage: string;
  avatar: string;
  membersCount: number;
  description: string;
  posts: Post[];
  category?: string;
}

export interface LookUptoParams {
  matchId: string;
  matchName: string;
  market: string;
  oddName: string;
  oddsValue: number;
  totalPool: number;
  sendoffsCount: number;
  isSendoffEnabled: boolean;
  calculatedCreatorStake: number;
  calculatedOpponentLiability: number;
}

export interface VideoItem {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  views: string;
  likes: number;
  liked?: boolean;
  commentsCount: number;
  tags: string[];
  duration: string;
  videoUrl?: string;
  thumbnailGradient: string;
  summary: string;
  shares?: number;
  timeAgo?: string;
  bgImage?: string;
  pillTags?: string[];
  verified?: boolean;
  challenge?: {
    id: string;
    title: string;
    pool: number;
    joined: boolean;
    joinedUser?: string;
  };
  privacy?: "public" | "friends" | "private" | "live" | "draft" | "scheduled";
  category?: string;
  isReel?: boolean;
  meantForChildren?: boolean;
  locationRestriction?: string;
}

