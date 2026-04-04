import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Heart, Users, MapPin, MessageSquare, Sparkles, Play, Leaf, Flame, Zap, Inbox, Map } from 'lucide-react';
import { getCourseById, getCrewMeetingsByCourseId } from '../data/mockData';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = id ? getCourseById(id) : undefined;
  const crewMeetings = id ? getCrewMeetingsByCourseId(id) : [];

  if (!course) {
    return (
      <div className="min-h-screen bg-[#1c1a24] text-white flex items-center justify-center font-sans">
        <p className="text-indigo-300 font-bold bg-[#2a2631] px-6 py-3 rounded-full border border-indigo-500/30">
          코스를 찾을 수 없어요
        </p>
      </div>
    );
  }

  const difficultyColor = {
    EASY: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', 
    NORMAL: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    HARD: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  }[course.difficulty] || 'bg-zinc-800 text-zinc-300 border-zinc-700';

  const difficultyText = {
    EASY: '초급 러너에게 추천해요',
    NORMAL: '기분 좋은 러닝이에요',
    HARD: '도전적인 코스예요'
  }[course.difficulty] || course.difficulty;

  const LevelIcon = course.difficulty === 'EASY' ? Leaf : course.difficulty === 'NORMAL' ? Flame : Zap;

  return (
    <div className="min-h-screen bg-[#1c1a24] text-white font-sans pb-32">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[#1c1a24]/90 backdrop-blur-md z-40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-[#2a2631] rounded-full flex items-center justify-center text-indigo-200 hover:text-white hover:scale-105 transition-all shadow-sm border border-[#3e394b]">
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-[15px] font-extrabold tracking-wide text-white/90">
            드로잉 상세
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2d2a37] border-2 border-indigo-400/50 p-1 shadow-sm">
          <div className="w-full h-full bg-[#fcd34d] rounded-full flex items-end justify-center overflow-hidden">
            <div className="w-5 h-6 bg-black/20 rounded-t-full" />
          </div>
        </div>
      </div>

      {/* Hero Image Canvas */}
      <div className="px-5 mt-6 mb-8">
        <div className="aspect-[4/5] relative rounded-[40px] overflow-hidden bg-[#2a2631] border-[3px] border-dashed border-[#3e394b] shadow-xl group">
          {course.imageUrl ? (
            <div className="w-full h-full relative">
              <img
                src={course.imageUrl}
                alt={course.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a24]/80 via-transparent to-[#1c1a24]/20 mix-blend-multiply" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-[#1c1a24] flex items-center justify-center">
              <Map className="w-24 h-24 text-indigo-300 opacity-50" />
            </div>
          )}
          
          {/* Shape Type Badge inside image */}
          <div className="absolute top-6 left-6 bg-white text-[#1c1a24] px-4 py-2 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2">
            {course.shapeType} 드로잉
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-5 mb-8 text-center flex flex-col items-center">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-[13px] bg-indigo-500/10 px-4 py-1.5 rounded-full mb-3 border border-indigo-500/20">
          <MapPin className="w-4 h-4 text-indigo-400" strokeWidth={2.5} />
          {course.region}, {course.country}
        </div>
        <h1 className="text-[28px] leading-tight font-black mb-2 text-white">
          {course.name}
        </h1>
        <p className="text-[#a29baf] font-medium text-sm px-4">
          {course.description || `${course.region}에서 ${course.shapeType} 모양을 그리며 달려보세요!`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="px-5 mb-10 flex gap-3">
        <div className="flex-1 bg-gradient-to-b from-[#2a2631] to-[#24212c] rounded-[28px] p-5 border border-[#3e394b] shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3 text-indigo-300">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="text-[24px] font-black text-white leading-none mb-1">
            {course.distance}<span className="text-[13px] text-indigo-300 font-bold ml-1">km</span>
          </div>
          <div className="text-[11px] font-bold text-[#8a8298]">거리</div>
        </div>

        <div className="flex-1 bg-gradient-to-b from-[#2a2631] to-[#24212c] rounded-[28px] p-5 border border-[#3e394b] shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-3 text-orange-300">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-[24px] font-black text-white leading-none mb-1">
            {course.recommendedPace.toFixed(2).replace('.', ':')}<span className="text-[13px] text-indigo-300 font-bold ml-1">/km</span>
          </div>
          <div className="text-[11px] font-bold text-[#8a8298]">추천 페이스</div>
        </div>
      </div>

      {/* Level Banner */}
      <div className="px-5 mb-10">
        <div className={`w-full rounded-[24px] p-4 flex items-center justify-between border ${difficultyColor} shadow-sm`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <LevelIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white/90">난이도: {course.difficulty}</div>
              <div className="text-xs font-medium opacity-80 mt-0.5">{difficultyText}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Row */}
      <div className="px-5 mb-12 flex items-center justify-between bg-[#2a2631]/50 mx-5 rounded-[24px] p-4 border border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-current" />
            <span className="font-bold text-sm">{(course.likes / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" strokeWidth={2.5} />
            <span className="font-bold text-sm text-indigo-100">{(course.completedCount / 1000).toFixed(1)}K <span className="text-[#a29baf] text-xs">명 완료</span></span>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-bold rounded-full shadow-md flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> 핫플
        </div>
      </div>

      {/* Lightning Meetings */}
      <div className="px-5 mb-6">
        <div className="flex items-end justify-between mb-5 px-2">
          <h2 className="text-[18px] font-black text-white flex items-center gap-2">
            러닝 크루 모집
          </h2>
          <span className="text-[12px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            참여 가능
          </span>
        </div>

        <div className="space-y-4">
          {crewMeetings.length > 0 ? (
            crewMeetings.map((meeting, i) => {
              const dateObj = new Date(meeting.date);
              const dayStr = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
              const isAlmostFull = meeting.currentParticipants >= meeting.maxParticipants - 2;

              return (
                <div key={meeting.id} className="bg-[#2a2631] rounded-[28px] p-5 flex items-center justify-between shadow-sm border border-[#3e394b] hover:border-indigo-400/50 transition-colors">
                  <div className="flex items-center">
                    <div className="pr-5 border-r border-dashed border-[#4e485e]">
                      <div className="text-indigo-200 text-xs font-bold mb-1">
                        {dateObj.getMonth() + 1}월 {dateObj.getDate()}일 ({dayStr})
                      </div>
                      <div className={`text-2xl font-black ${i === 0 ? 'text-rose-400' : 'text-indigo-400'}`}>
                        {meeting.time}
                      </div>
                    </div>
                    <div className="pl-5">
                      <div className="text-white/60 text-[11px] font-bold mb-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {isAlmostFull ? '마감 임박!' : `${meeting.currentParticipants}명 참여중`}
                      </div>
                      <div className={`text-[13px] font-bold ${isAlmostFull ? 'text-rose-300' : 'text-indigo-300'}`}>
                        {isAlmostFull ? `${meeting.maxParticipants - meeting.currentParticipants}자리 남음` : '지금 신청하세요!'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-12 h-12 rounded-full bg-[#fcd34d] flex items-center justify-center hover:scale-105 transition-transform shadow-md border-2 border-[#f59e0b]/50">
                      <MessageSquare className="w-5 h-5 text-[#854d0e] fill-current" />
                    </button>
                    <button className={`text-[13px] font-bold px-5 py-3.5 rounded-full transition-all shadow-md ${
                      i === 0 ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90' : 'bg-[#3e394b] text-white hover:bg-[#4a455a]'
                    }`}>
                      참여
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-[#2a2631] rounded-[28px] p-8 text-center border-2 border-dashed border-[#3e394b] flex flex-col items-center">
              <Inbox className="w-10 h-10 mb-3 text-white/20" />
              <p className="text-[#a29baf] font-bold text-sm">아��� 모집 중인 크루가 없어요.<br/>직접 첫 크루를 만들어볼까요?</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Bottom Sticky */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#1c1a24] via-[#1c1a24]/95 to-transparent pt-12 pb-8 z-50">
        <Link
          to="/run"
          state={{ courseId: course.id, courseName: course.name }}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-400 text-white h-16 rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_8px_30px_rgba(99,102,241,0.4)] active:scale-[0.98] border border-white/20"
        >
          <Play className="w-5 h-5 fill-current" />
          <span className="font-extrabold text-[16px] tracking-wide">
            드로잉 출발하기
          </span>
        </Link>
      </div>
    </div>
  );
}
