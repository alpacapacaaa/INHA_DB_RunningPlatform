import { Link } from 'react-router';
import { Course } from '../types';
import { Map, Users } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const difficultyColor = {
    EASY: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', 
    NORMAL: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    HARD: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  }[course.difficulty] || 'bg-zinc-800 text-zinc-300 border-zinc-700';

  const difficultyText = {
    EASY: '초급',
    NORMAL: '중급',
    HARD: '고급'
  }[course.difficulty] || course.difficulty;

  return (
    <Link
      to={`/course/${course.id}`}
      className="block bg-[#282531] rounded-[24px] border-2 border-dashed border-[#3e394b] p-2 hover:border-indigo-400/60 hover:bg-[#2d2a37] transition-all group"
    >
      {/* Course Image Canvas */}
      <div className="aspect-[4/5] relative rounded-[18px] overflow-hidden bg-[#1e1c26] mb-3">
        {course.imageUrl ? (
          <div className="relative w-full h-full">
            <img
              src={course.imageUrl}
              alt={course.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Soft Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#1e1c26] via-[#1e1c26]/60 to-transparent" />
            
            {/* Shape Badge */}
            <div className="absolute top-3 left-3 bg-[#1e1c26]/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center shadow-sm border border-white/10">
              <span>{course.shapeType}</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-[#1e1c26] flex items-center justify-center relative">
            <Map className="w-12 h-12 text-indigo-300/50" />
            <div className="absolute top-3 left-3 bg-[#1e1c26]/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center shadow-sm border border-white/10">
              <span>{course.shapeType}</span>
            </div>
          </div>
        )}
        
        {/* Floating Distance */}
        <div className="absolute bottom-3 right-3 bg-white text-[#1e1c26] px-3 py-1.5 rounded-xl font-bold text-sm shadow-md flex items-baseline gap-0.5">
          {course.distance} <span className="text-[10px] opacity-80">km</span>
        </div>
      </div>

      {/* Course Info */}
      <div className="px-2 pb-1">
        <h3 className="font-bold text-[14px] mb-1.5 text-white/90 line-clamp-1">{course.name}</h3>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-medium text-indigo-300/80 bg-indigo-500/10 px-2 py-0.5 rounded-md">
            {course.region}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${difficultyColor}`}>
            {difficultyText}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-white/50" />
              <span className="text-[11px] font-medium text-white/50">{course.completedCount.toLocaleString()}명 완료</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
