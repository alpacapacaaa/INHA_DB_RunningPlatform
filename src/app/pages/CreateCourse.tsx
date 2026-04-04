import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, TrendingUp, Clock } from 'lucide-react';

type ShapeType = '고양이' | '고구마' | '강아지' | 'Hi' | '하트' | '별' | '기타';
type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    shapeType: '하트' as ShapeType,
    region: '',
    country: '한국',
    distance: '',
    recommendedPace: '',
    difficulty: 'NORMAL' as Difficulty,
    description: '',
  });

  const shapeTypes: ShapeType[] = ['고양이', '고구마', '강아지', 'Hi', '하트', '별', '기타'];
  const difficulties: Difficulty[] = ['EASY', 'NORMAL', 'HARD'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to backend
    alert('코스가 등록되었습니다!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-zinc-800 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">코스 등록하기</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* Course Name */}
        <div>
          <label className="block text-sm font-bold mb-2">코스 이름 *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="예: 여의도 고구마런"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-lime-400"
          />
        </div>

        {/* Shape Type */}
        <div>
          <label className="block text-sm font-bold mb-2">모양 유형 *</label>
          <div className="grid grid-cols-4 gap-2">
            {shapeTypes.map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => setFormData({ ...formData, shapeType: shape })}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-colors ${
                  formData.shapeType === shape
                    ? 'bg-lime-400 text-black'
                    : 'bg-zinc-900 hover:bg-zinc-800'
                }`}
              >
                <span className="text-2xl">{getShapeEmoji(shape)}</span>
                <span className="text-xs font-bold">{shape}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">지역 *</label>
            <input
              type="text"
              required
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="서울"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-lime-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">국가 *</label>
            <input
              type="text"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="한국"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-lime-400"
            />
          </div>
        </div>

        {/* Distance & Pace */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">거리 (km) *</label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              placeholder="10.0"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-lime-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">추천 페이스 *</label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.recommendedPace}
              onChange={(e) =>
                setFormData({ ...formData, recommendedPace: e.target.value })
              }
              placeholder="5.5"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-lime-400"
            />
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-bold mb-2">난이도 *</label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                onClick={() => setFormData({ ...formData, difficulty })}
                className={`py-3 rounded-lg font-bold transition-colors ${
                  formData.difficulty === difficulty
                    ? difficulty === 'EASY'
                      ? 'bg-lime-400 text-black'
                      : difficulty === 'NORMAL'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-red-400 text-black'
                    : 'bg-zinc-900 hover:bg-zinc-800'
                }`}
              >
                {difficulty === 'EASY' ? '쉬움' : difficulty === 'NORMAL' ? '보통' : '어려움'}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold mb-2">코스 설명</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="이 코스에 대해 설명해주세요..."
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-lime-400 resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-sm text-zinc-400 space-y-2">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>직접 달려본 코스만 등록해주세요</span>
            </p>
            <p className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>다른 러너들이 참고할 수 있도록 정확한 정보를 입력해주세요</span>
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-lime-400 text-black font-bold py-4 rounded-xl hover:bg-lime-300 transition-colors"
        >
          코스 등록하기
        </button>
      </form>
    </div>
  );
}

function getShapeEmoji(shapeType: string): string {
  const emojiMap: Record<string, string> = {
    '고양이': '🐱',
    '고구마': '🍠',
    '강아지': '🐶',
    'Hi': '👋',
    '하트': '❤️',
    '별': '⭐',
    '기타': '🎯',
  };
  return emojiMap[shapeType] || '🎯';
}
