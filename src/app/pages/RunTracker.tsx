import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Pause, Play, Square, MapPin, Palette, Route } from 'lucide-react';
import { getCourseById } from '../data/mockData';

export default function RunTracker() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId, courseName } = location.state || {};

  const course = courseId ? getCourseById(courseId) : undefined;

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [distance, setDistance] = useState(0); // km
  const [currentPace, setCurrentPace] = useState(0); // min/km

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        // Simulate distance increase (0.002km per second = ~7.2km/h)
        setDistance((prev) => prev + 0.002);
        // Calculate current pace (min/km)
        const pace = elapsedTime > 0 ? (elapsedTime / 60) / distance : 0;
        setCurrentPace(pace);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, elapsedTime, distance]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    // Navigate to complete page with run data
    navigate('/run/complete', {
      state: {
        courseId,
        courseName,
        distance: parseFloat(distance.toFixed(2)),
        duration: elapsedTime,
        averagePace: currentPace > 0 ? parseFloat(currentPace.toFixed(2)) : 5.5,
        bestPace: currentPace > 0 ? parseFloat((currentPace * 0.85).toFixed(2)) : 4.8, // Mock best pace
        calories: Math.round(distance * 65),
        cadence: 165 + Math.floor(Math.random() * 15),
        elevation: Math.round(distance * 12 + Math.floor(Math.random() * 20)),
        heartRate: 145 + Math.floor(Math.random() * 10),
      },
    });
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (pace: number): string => {
    if (pace === 0 || !isFinite(pace)) return '--:--';
    const mins = Math.floor(pace);
    const secs = Math.floor((pace - mins) * 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"`;
  };

  return (
    <div className="min-h-screen bg-[#1c1a24] text-white flex flex-col font-sans">
      {/* Map Area Placeholder (Drawing Canvas) */}
      <div className="flex-1 bg-[#2a2631] relative border-b-4 border-dashed border-[#3e394b] overflow-hidden rounded-b-[40px] shadow-sm">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-pulse flex flex-col items-center">
            <Route className="w-16 h-16 text-indigo-400 mb-4 opacity-80" />
            <p className="text-indigo-300 font-bold text-sm bg-[#1c1a24]/50 px-4 py-2 rounded-full border border-indigo-400/20 backdrop-blur-sm">
              {isRunning && !isPaused ? '멋진 그림을 그리는 중!' : '드로잉을 준비하고 있어요'}
            </p>
          </div>
        </div>

        {/* Course Info Badge */}
        {courseName && (
          <div className="absolute top-8 left-6 right-6">
            <div className="bg-[#1c1a24]/80 backdrop-blur-md rounded-[20px] px-5 py-3 border border-[#3e394b] shadow-lg flex items-center justify-between">
              <div>
                <div className="text-[10px] text-indigo-300 font-bold mb-0.5">목표 그림</div>
                <div className="font-black text-[15px]">{courseName}</div>
              </div>
              <MapPin className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        )}

        {/* Real-time Stats Overlay */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="bg-[#1c1a24]/90 backdrop-blur-xl rounded-[32px] p-6 border-2 border-indigo-500/20 shadow-2xl">
            {/* Time */}
            <div className="text-center mb-6 border-b border-dashed border-white/10 pb-6">
              <div className="text-sm font-bold text-indigo-300 mb-1">경과 시간</div>
              <div className="text-[56px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-sm tracking-tight">
                {formatTime(elapsedTime)}
              </div>
            </div>

            {/* Distance & Pace */}
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="absolute inset-y-0 left-1/2 w-px bg-dashed bg-white/10 -translate-x-1/2 border-l border-dashed border-[#3e394b]" />
              
              <div className="text-center pr-2">
                <div className="text-xs font-bold text-indigo-300 mb-2">현재 거리</div>
                <div className="flex items-baseline justify-center gap-1">
                  <div className="text-4xl font-black">{distance.toFixed(2)}</div>
                  <div className="text-sm text-[#8a8298] font-bold">km</div>
                </div>
              </div>
              
              <div className="text-center pl-2">
                <div className="text-xs font-bold text-indigo-300 mb-2">현재 페이스</div>
                <div className="flex items-baseline justify-center gap-1">
                  <div className="text-4xl font-black">{formatPace(currentPace)}</div>
                  <div className="text-sm text-[#8a8298] font-bold">/km</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-[#1c1a24] p-8 pb-10">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-extrabold text-[17px] py-5 rounded-[24px] hover:scale-[1.02] transition-all shadow-[0_8px_30px_rgba(99,102,241,0.4)] flex items-center justify-center gap-3 border border-white/20"
          >
            <Play className="w-6 h-6 fill-current" />
            달리기 시작
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={handlePause}
              className={`flex-1 font-extrabold text-[15px] py-5 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-md border border-white/10 ${
                isPaused
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:scale-[1.02]'
                  : 'bg-[#2a2631] text-white hover:bg-[#343041]'
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  다시 달리기
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  잠깐 쉬기
                </>
              )}
            </button>
            <button
              onClick={handleStop}
              className="flex-[0.6] bg-gradient-to-r from-rose-400 to-orange-400 text-white font-extrabold text-[15px] py-5 rounded-[24px] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(251,113,133,0.4)] border border-white/20"
            >
              <Square className="w-5 h-5 fill-current" />
              완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
