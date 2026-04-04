export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';
export type ShapeType = '고양이' | '고구마' | '강아지' | 'Hi' | '하트' | '별' | '기타';
export type RunLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';

export interface Course {
  id: string;
  name: string;
  shapeType: ShapeType;
  region: string;
  country: string;
  distance: number; // km
  recommendedPace: number; // min/km
  difficulty: Difficulty;
  isOfficial: boolean;
  likes: number;
  shares: number;
  completedCount: number;
  imageUrl?: string;
  description?: string;
  gpxPath?: string;
}

export interface CrewMeeting {
  id: string;
  courseId: string;
  date: string;
  time: string;
  maxParticipants: number;
  currentParticipants: number;
  chatLink?: string;
}

export interface RunRecord {
  id: string;
  courseId?: string;
  courseName?: string;
  date: string;
  startTime: string;
  distance: number; // km
  duration: number; // seconds
  averagePace: number; // min/km
  fastestPace: number; // min/km
  calories: number;
  cadence?: number;
  elevation?: number;
  heartRate?: number;
  shoes?: string;
  gpxPath?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  level?: RunLevel;
  levelTested: boolean;
  age?: number;
  gender?: 'M' | 'F';
  totalDistance: number; // km
  totalDuration: number; // seconds
  averagePace: number; // min/km
  records: RunRecord[];
}
