import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Search, Brush } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { mockCourses } from '../data/mockData';
import { mockUserProfile } from '../data/mockData'; // Assuming there is a mock profile or just use placeholder

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string>('Seoul');
  const [activeTab, setActiveTab] = useState<'Official' | 'Community'>('Official');

  const regions = ['Seoul', 'Incheon', 'Busan', 'Jeju'];

  const filteredCourses = mockCourses.filter((course) => {
    // Basic mapping for demo
    let mapRegion = 'Seoul';
    if (course.region === '부산') mapRegion = 'Busan';
    if (course.region === '제주') mapRegion = 'Jeju';
    if (course.country === '일본') mapRegion = 'Japan';

    const regionMatch = selectedRegion === 'Seoul' ? (course.region === '서울' || course.region === 'Seoul') : mapRegion === selectedRegion;
    const isOfficialMatch = activeTab === 'Official' ? course.isOfficial : !course.isOfficial;
    
    return regionMatch && isOfficialMatch;
  });

  // 지역 필터 결과가 없을 경우 해당 탭(공식/커뮤니티)의 전체 코스라도 보여줍니다.
  const displayCourses = filteredCourses.length > 0 
    ? filteredCourses 
    : mockCourses.filter(c => activeTab === 'Official' ? c.isOfficial : !c.isOfficial);

  return (
    <div className="min-h-screen bg-[#1c1a24] text-[#fdfcf6] font-sans relative">
      {/* Header */}
      <div className="px-5 pt-12 pb-6 bg-gradient-to-b from-[#2a2631] to-[#1c1a24] rounded-b-[40px] shadow-sm mb-6 border-b border-[#3e394b]/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              RUNTRIP
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2d2a37] border-2 border-indigo-400 shadow-md p-1">
            <div className="w-full h-full bg-[#fcd34d] rounded-full flex items-end justify-center overflow-hidden">
              <div className="w-5 h-6 bg-black/20 rounded-t-full" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-indigo-300" />
          </div>
          <input
            type="text"
            placeholder="어떤 모양을 그려볼까요?"
            className="w-full bg-[#2a2736] text-[15px] font-medium text-white placeholder-indigo-300/60 rounded-full py-3.5 pl-12 pr-4 focus:outline-none border-2 border-transparent focus:border-indigo-400/50 transition-all shadow-inner hover:bg-[#2d2a3a]"
          />
        </div>

        {/* Filters - Regions */}
        <div className="flex gap-2.5 mb-2 overflow-x-auto pb-2 scrollbar-hide">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap shadow-sm border ${
                selectedRegion === region
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent'
                  : 'bg-[#2a2736] text-indigo-200/70 hover:bg-[#343041] border-[#3e394b]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-6">
        <div className="flex gap-6 border-b-2 border-[#2d2a37] pb-1">
          {(['Official', 'Community'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[14px] font-bold transition-all relative px-1 ${
                activeTab === tab ? 'text-white' : 'text-indigo-200/50 hover:text-indigo-200'
              }`}
            >
              {tab === 'Official' ? '공식 드로잉' : '크루 드로잉'}
              {activeTab === tab && (
                <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="px-5 pb-32">
        <div className="grid grid-cols-2 gap-4">
          {displayCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <Link
        to="/create-course"
        className="fixed bottom-24 right-5 w-16 h-16 bg-gradient-to-tr from-rose-400 to-orange-400 text-white rounded-[24px] shadow-[0_8px_30px_rgba(251,113,133,0.4)] flex items-center justify-center hover:scale-105 transition-transform z-50 border-2 border-white/20"
      >
        <Brush className="w-7 h-7" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
