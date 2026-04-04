import { Course, CrewMeeting, RunRecord, UserProfile } from '../types';

import courseImage1 from 'figma:asset/41ae73e72cf52e658eff6c64e18ff2ac26bbc20d.png';
import courseImage2 from 'figma:asset/067b4dccecc5149c10d871401a8a996e1831daff.png';
import courseImage3 from 'figma:asset/5cae17d1a47d9d935713a73997d8d1514bcca94c.png';
import courseImage4 from 'figma:asset/97723fe2d5edb32691e179f6b715b1a7fbd271e8.png';
import courseImage5 from 'figma:asset/f85e27d4e0b23e9c43fcb0cec21a0602a1765f79.png';

export const mockCourses: Course[] = [
  {
    id: '1',
    name: '여의도 고구마런',
    shapeType: '고구마',
    region: '서울',
    country: '한국',
    distance: 8.0,
    recommendedPace: 5.5,
    difficulty: 'NORMAL',
    isOfficial: true,
    likes: 1243,
    shares: 567,
    completedCount: 3421,
    description: '여의도 한강공원을 따라 고구마 모양을 그리는 인기 코스',
    imageUrl: courseImage4,
  },
  {
    id: '2',
    name: '어린이대공원 붕어빵런',
    shapeType: '붕어빵',
    region: '서울',
    country: '한국',
    distance: 5.0,
    recommendedPace: 6.0,
    difficulty: 'EASY',
    isOfficial: true,
    likes: 2156,
    shares: 892,
    completedCount: 2145,
    description: '어린이대공원 주변을 붕어빵 모양으로 달리는 코스',
    imageUrl: courseImage5,
  },
  {
    id: '3',
    name: '광화문 강아지런',
    shapeType: '강아지',
    region: '서울',
    country: '한국',
    distance: 10.0,
    recommendedPace: 5.5,
    difficulty: 'NORMAL',
    isOfficial: true,
    likes: 3421,
    shares: 1523,
    completedCount: 5678,
    description: '광화문 주변에서 강아지 모양을 그리는 인기 코스',
    imageUrl: courseImage1,
  },
  {
    id: '4',
    name: '남산 하트런',
    shapeType: '하트',
    region: '서울',
    country: '한국',
    distance: 9.0,
    recommendedPace: 5.8,
    difficulty: 'NORMAL',
    isOfficial: true,
    likes: 987,
    shares: 456,
    completedCount: 1234,
    description: '남산 둘레길을 따라 하트 모양을 그리는 코스',
    imageUrl: courseImage2,
  },
  {
    id: '5',
    name: '한강 옷걸이런',
    shapeType: '옷걸이',
    region: '서울',
    country: '한국',
    distance: 30.0,
    recommendedPace: 6.5,
    difficulty: 'HARD',
    isOfficial: true,
    likes: 654,
    shares: 234,
    completedCount: 567,
    description: '한강을 길게 따라 옷걸이 모양을 그리는 도전적인 코스',
    imageUrl: courseImage3,
  }
];

export const mockCrewMeetings: CrewMeeting[] = [
  {
    id: '1',
    courseId: '1',
    date: '2026-04-05',
    time: '21:00',
    maxParticipants: 6,
    currentParticipants: 4,
    chatLink: 'https://open.kakao.com/example1',
  },
  {
    id: '2',
    courseId: '1',
    date: '2026-04-06',
    time: '06:00',
    maxParticipants: 8,
    currentParticipants: 2,
    chatLink: 'https://open.kakao.com/example2',
  },
  {
    id: '3',
    courseId: '3',
    date: '2026-04-05',
    time: '19:00',
    maxParticipants: 10,
    currentParticipants: 7,
  },
];

export const mockRunRecords: RunRecord[] = [
  {
    id: '1',
    courseId: '1',
    courseName: '여의도 고구마런',
    date: '2026-03-28',
    startTime: '19:30',
    distance: 8.0,
    duration: 2805, // 46분 45초
    averagePace: 5.5,
    fastestPace: 4.8,
    calories: 612,
    cadence: 165,
    elevation: 45,
    heartRate: 158,
    shoes: 'Nike Pegasus 40',
  },
  {
    id: '2',
    courseId: '3',
    courseName: '광화문 강아지런',
    date: '2026-03-25',
    startTime: '06:15',
    distance: 10.0,
    duration: 1860, // 31분
    averagePace: 5.0,
    fastestPace: 4.5,
    calories: 445,
    cadence: 170,
    elevation: 28,
    heartRate: 152,
    shoes: 'Nike Pegasus 40',
  },
  {
    id: '3',
    date: '2026-03-20',
    startTime: '20:00',
    distance: 5.0,
    duration: 1650, // 27분 30초
    averagePace: 5.5,
    fastestPace: 5.0,
    calories: 360,
    cadence: 162,
    heartRate: 145,
    shoes: 'Nike Pegasus 40',
  },
];

export const mockUserProfile: UserProfile = {
  id: 'user1',
  name: '러너',
  level: 'INTERMEDIATE',
  levelTested: true,
  age: 28,
  gender: 'M',
  totalDistance: 245.8,
  totalDuration: 78300, // seconds
  averagePace: 5.3,
  records: mockRunRecords,
};

export function getCourseById(id: string): Course | undefined {
  return mockCourses.find((course) => course.id === id);
}

export function getCrewMeetingsByCourseId(courseId: string): CrewMeeting[] {
  return mockCrewMeetings.filter((meeting) => meeting.courseId === courseId);
}
