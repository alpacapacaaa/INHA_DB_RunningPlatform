export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';
export type RunLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';

export interface Course {
  id: string;
  name: string;
  shapeType: string;
  region: string;
  district: string;
  distance: number;
  difficulty: Difficulty;
  isOfficial: boolean;
  likes: number;
  shares: number;
  completedCount: number;
  description: string;
  officialScore: number;
  reviewScore: number;
  nearbyDistanceKm: number;
  minLikesForRecommend: number;
  cautions: string[];
  coverColor: string;
  routeCoordinates: { latitude: number; longitude: number }[];
}

export interface CrewMeeting {
  id: string;
  courseId: string;
  title: string;
  date: string;
  weekday: string;
  pace: number;
  maxParticipants: number;
  currentParticipants: number;
  isPrivate: boolean;
  passwordHint?: string;
}

export interface RunRecord {
  id: string;
  courseId?: string;
  courseName?: string;
  date: string;
  startTime: string;
  distance: number;
  duration: number;
  averagePace: number;
  fastestPace: number;
  segmentPaces: number[];
  calories: number;
  district?: string;
  reviewSummary?: string;
}

export interface RunningShoe {
  id: string;
  name: string;
  brand: string;
  totalDistance: number;
  accentStart: string;
  accentEnd: string;
}

export interface UserProfile {
  id: string;
  name: string;
  level?: RunLevel;
  levelTested: boolean;
  totalDistance: number;
  averagePace: number;
  records: RunRecord[];
  shoes: RunningShoe[];
}
