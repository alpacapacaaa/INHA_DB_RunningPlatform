import { useState } from 'react';
import { Trophy, TrendingUp, Clock, Flame, Award, ChevronRight } from 'lucide-react';
import { mockUserProfile } from '../data/mockData';

type PeriodType = 'week' | 'month' | 'year';

export default function MyPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const user = mockUserProfile;

  const periods: { value: PeriodType; label: string }[] = [
    { value: 'week', label: '주간' },
    { value: 'month', label: '월간' },
    { value: 'year', label: '연간' },
  ];

  const getLevelColor = () => {
    if (user.totalDistance < 250) return 'from-blue-600 to-blue-900';
    if (user.totalDistance < 500) return 'from-red-600 to-red-900';
    return 'from-purple-600 to-purple-900';
  };

  const getLevelText = () => {
    if (user.totalDistance < 250) return '블루 러너';
    if (user.totalDistance < 500) return '레드 러너';
    return '퍼플 러너';
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}시간 ${mins}분`;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-6">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-black mb-2">마이페이지</h1>
        <p className="text-zinc-400 text-sm">당신의 러닝 여정</p>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-6">
        <div className={`bg-gradient-to-br ${getLevelColor()} rounded-2xl p-6`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-2xl font-black mb-1">{user.name}</div>
              <div className="text-sm opacity-90">{getLevelText()}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Trophy className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-90">누적 거리</span>
              <span className="font-bold">{user.totalDistance} km</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${(user.totalDistance % 250) / 250 * 100}%` }}
              />
            </div>
            <div className="text-xs opacity-75 text-right">
              다음 레벨까지 {250 - (user.totalDistance % 250)} km
            </div>
          </div>
        </div>
      </div>

      {/* Level Test Banner */}
      {user.levelTested && (
        <div className="px-6 mb-6">
          <div className="bg-zinc-900 rounded-xl p-4 border border-lime-400/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold mb-1 text-lime-400">레벨 테스트 완료</div>
                <div className="text-sm text-zinc-400">
                  당신은 {user.level} 러너입니다
                </div>
              </div>
              <Award className="w-8 h-8 text-lime-400" />
            </div>
          </div>
        </div>
      )}

      {/* Period Selector */}
      <div className="px-6 mb-4">
        <div className="flex gap-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-lime-400 text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Trophy className="w-4 h-4" />
              <span className="text-xs">총 거리</span>
            </div>
            <div className="text-2xl font-black text-lime-400">
              {user.totalDistance}
            </div>
            <div className="text-xs text-zinc-400">킬로미터</div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">총 시간</span>
            </div>
            <div className="text-2xl font-black text-lime-400">
              {Math.floor(user.totalDuration / 3600)}
            </div>
            <div className="text-xs text-zinc-400">시간</div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">평균 페이스</span>
            </div>
            <div className="text-2xl font-black text-lime-400">
              {user.averagePace}
            </div>
            <div className="text-xs text-zinc-400">min/km</div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Flame className="w-4 h-4" />
              <span className="text-xs">러닝 횟수</span>
            </div>
            <div className="text-2xl font-black text-lime-400">
              {user.records.length}
            </div>
            <div className="text-xs text-zinc-400">회</div>
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div className="px-6">
        <h2 className="text-xl font-bold mb-4">최근 기록</h2>
        <div className="space-y-3">
          {user.records.slice(0, 5).map((record) => (
            <div
              key={record.id}
              className="bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold mb-1">
                    {record.courseName || '자유 러닝'}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {new Date(record.date).toLocaleDateString('ko-KR')} • {record.startTime}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="text-lime-400 font-bold">{record.distance} km</span>
                <span className="text-zinc-400">{record.averagePace} min/km</span>
                <span className="text-zinc-400">{Math.floor(record.duration / 60)}분</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
