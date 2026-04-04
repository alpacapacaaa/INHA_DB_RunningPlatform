import { useLocation, useNavigate } from 'react-router';
import { Share2, Download, Home, Trophy, Activity, Mountain, Footprints, Calendar, Palette, BookOpen, Route } from 'lucide-react';
import { useRef } from 'react';
import { getCourseById } from '../data/mockData';

export default function RunComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const shareCardRef = useRef<HTMLDivElement>(null);
  
  const { courseId, courseName, distance, duration, averagePace, bestPace, calories, cadence, elevation, heartRate } = location.state || {
    courseId: '1',
    courseName: '광화문 강아지런',
    distance: 5.02,
    duration: 1650, // 27.5 minutes
    averagePace: 5.5,
    bestPace: 4.8,
    calories: 326,
    cadence: 168,
    elevation: 85,
    heartRate: 142,
  };

  const course = courseId ? getCourseById(courseId) : undefined;

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}시간 ${mins}분 ${secs}초`;
    }
    return `${mins}분 ${secs}초`;
  };

  const formatPace = (pace: number): string => {
    const mins = Math.floor(pace);
    const secs = Math.floor((pace - mins) * 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"`;
  };

  const handleShare = () => {
    alert('드로잉 기록이 생성되었어요! 인스타그램으로 공유하세요.');
  };

  const handleDownload = () => {
    alert('드로잉 이미지가 갤러리에 저장되었습니다!');
  };

  // Mocking shoe data
  const shoe = "나이키 페가수스 39";
  const shoeMileage = "245.5";
  const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#1c1a24] text-white flex flex-col font-sans pb-8">
      <div className="flex-1 px-5 py-10 overflow-y-auto">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
          <h1 className="text-[26px] font-black mb-2 tracking-tight text-white drop-shadow-md">
            완주를 축하해요!
          </h1>
          <p className="text-indigo-300 font-bold text-[15px] bg-[#2a2631] inline-block px-5 py-1.5 rounded-full border border-[#3e394b] shadow-sm">
            {courseName || '자유 드로잉'}
          </p>
        </div>

        {/* Share Card Canvas */}
        <div 
          ref={shareCardRef} 
          className="bg-[#2a2631] rounded-[36px] overflow-hidden mb-8 border-4 border-dashed border-[#3e394b] relative shadow-xl"
        >
          {/* GPS Path Area */}
          <div className="aspect-square bg-[#1e1c26] relative flex items-center justify-center border-b border-[#3e394b]">
            {/* Subtle Grid Canvas Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />
            
            {course?.imageUrl ? (
              <img 
                src={course.imageUrl} 
                alt="GPS Path" 
                className="w-full h-full object-cover opacity-90 drop-shadow-2xl mix-blend-screen"
                style={{ filter: 'brightness(1.2) contrast(1.1) drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
              />
            ) : (
              <Route className="w-24 h-24 text-indigo-300 opacity-50 drop-shadow-2xl" />
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a2631] via-transparent to-transparent h-full w-full opacity-80" />
            
            {/* Stamp / Logo */}
            <div className="absolute top-5 left-5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg flex items-center gap-2">
              <Palette className="w-6 h-6 text-white" />
              <div className="font-black text-sm tracking-widest text-indigo-50">RUNTRIP</div>
            </div>
            
            {/* Date Badge */}
            <div className="absolute top-5 right-5 text-right">
              <div className="text-xs font-bold text-indigo-200/80 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                {dateStr}
              </div>
            </div>
          </div>

          {/* Core Stats in Share Card */}
          <div className="p-6 bg-gradient-to-b from-[#2a2631] to-[#221f2d]">
            <div className="flex items-end justify-between mb-6 pb-6 border-b border-dashed border-[#4e485e]">
              <div>
                <div className="text-[11px] font-bold text-indigo-300 mb-1">총 달린 거리</div>
                <div className="flex items-baseline gap-1">
                  <div className="text-[44px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    {distance}
                  </div>
                  <div className="text-lg font-bold text-[#8a8298]">km</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-indigo-300 mb-1">경과 시간</div>
                <div className="text-2xl font-black text-white">{formatTime(duration)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1c1a24] rounded-[24px] p-4 text-center border border-[#3e394b] shadow-inner">
                <div className="text-[11px] font-bold text-[#8a8298] mb-1">평균 페이스</div>
                <div className="text-xl font-black text-indigo-100">{formatPace(averagePace)}<span className="text-xs ml-0.5">/km</span></div>
              </div>
              <div className="bg-[#1c1a24] rounded-[24px] p-4 text-center border border-[#3e394b] shadow-inner">
                <div className="text-[11px] font-bold text-[#8a8298] mb-1">소모 칼로리</div>
                <div className="text-xl font-black text-orange-200">{calories} <span className="text-xs ml-0.5">kcal</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats Section */}
        <div className="bg-[#2a2631] rounded-[32px] p-6 mb-8 border border-[#3e394b] shadow-sm">
          <h2 className="text-lg font-extrabold mb-5 flex items-center gap-2 text-white">
            <BookOpen className="w-5 h-5 text-indigo-300" /> 나의 러닝 일지
          </h2>
          
          <div className="grid grid-cols-2 gap-4 gap-y-6">
            {/* Top row detailed stats */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#8a8298] text-[11px] font-bold">
                <Trophy className="w-3.5 h-3.5" /> 최고 페이스
              </div>
              <div className="font-black text-lg text-indigo-200">{formatPace(bestPace)} <span className="text-xs text-white/50">/km</span></div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#8a8298] text-[11px] font-bold">
                <Activity className="w-3.5 h-3.5" /> 평균 심박수
              </div>
              <div className="font-black text-lg text-rose-300">{heartRate} <span className="text-xs text-white/50">bpm</span></div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#8a8298] text-[11px] font-bold">
                <Activity className="w-3.5 h-3.5" /> 케이던스
              </div>
              <div className="font-black text-lg text-emerald-300">{cadence} <span className="text-xs text-white/50">spm</span></div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#8a8298] text-[11px] font-bold">
                <Mountain className="w-3.5 h-3.5" /> 고도 변화
              </div>
              <div className="font-black text-lg text-amber-200">{elevation} <span className="text-xs text-white/50">m</span></div>
            </div>
            
            {/* Separator line */}
            <div className="col-span-2 h-px bg-dashed bg-white/10 border-t border-dashed border-[#4e485e] my-1" />

            <div className="col-span-2 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#8a8298] text-[11px] font-bold">
                <Footprints className="w-3.5 h-3.5" /> 함께한 러닝화
              </div>
              <div className="flex items-center justify-between">
                <div className="font-bold text-[15px] text-white">{shoe}</div>
                <div className="text-xs font-bold bg-[#1c1a24] px-3 py-1 rounded-full border border-[#3e394b] text-indigo-300">
                  누적 {shoeMileage}km
                </div>
              </div>
            </div>

            <div className="col-span-2 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[#8a8298] text-[11px] font-bold">
                <Calendar className="w-3.5 h-3.5" /> 기록된 시간
              </div>
              <div className="font-bold text-[14px] text-white">
                {dateStr} {timeStr} 시작
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 rounded-[20px] hover:scale-[1.02] transition-transform flex flex-col items-center justify-center gap-1.5 shadow-[0_8px_30px_rgba(244,63,94,0.3)] border border-white/20"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-[13px]">인스타에 자랑하기</span>
          </button>

          <button
            onClick={handleDownload}
            className="bg-[#2a2631] text-indigo-100 font-bold py-4 rounded-[20px] hover:bg-[#343041] transition-colors flex flex-col items-center justify-center gap-1.5 shadow-sm border border-[#3e394b]"
          >
            <Download className="w-5 h-5" />
            <span className="text-[13px]">이미지로 저장하기</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="col-span-2 bg-[#1e1c26] text-[#8a8298] font-bold py-4 rounded-[20px] hover:bg-[#25232e] hover:text-white transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <Home className="w-5 h-5" />
            <span>홈으로 돌아가기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
