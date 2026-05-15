import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RunRecord } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type CourseStackParamList = {
  CourseHome: undefined;
  CourseDetail: { courseId: string };
};

export type RunStackParamList = {
  RunTracker: { courseId?: string };
  RunComplete: { record: RunRecord; courseId?: string };
  CreateCourse: { record: RunRecord };
};

export type HistoryStackParamList = {
  HistoryHome: undefined;
  RecordDetail: { record: RunRecord };
};

export type MyPageStackParamList = {
  MyPageHome: undefined;
  Shoes: undefined;
  LevelTest: undefined;
};

export type MainTabParamList = {
  Course: undefined;
  History: undefined;
  Run: { courseId?: string } | undefined;
  Recruit: undefined;
  MyPage: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type CourseStackScreenProps<T extends keyof CourseStackParamList> =
  NativeStackScreenProps<CourseStackParamList, T>;

export type RunStackScreenProps<T extends keyof RunStackParamList> =
  NativeStackScreenProps<RunStackParamList, T>;

export type HistoryStackScreenProps<T extends keyof HistoryStackParamList> =
  NativeStackScreenProps<HistoryStackParamList, T>;

export type MyPageStackScreenProps<T extends keyof MyPageStackParamList> =
  NativeStackScreenProps<MyPageStackParamList, T>;
