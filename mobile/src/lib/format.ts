import { Difficulty } from '../types';

export function formatDistance(distance: number) {
  return distance.toFixed(2);
}

export function formatPace(pace: number) {
  if (!Number.isFinite(pace) || pace <= 0) return '--';
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}'${seconds}"`;
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;
  const hours = Math.floor(minutes / 60);
  const remainMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}시간 ${remainMinutes}분 ${remainSeconds}초`;
  }

  return `${minutes}분 ${remainSeconds}초`;
}

export function difficultyLabel(difficulty: Difficulty) {
  return {
    EASY: '쉬움',
    NORMAL: '보통',
    HARD: '어려움',
  }[difficulty];
}
