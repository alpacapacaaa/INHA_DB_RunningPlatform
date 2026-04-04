import { useState } from 'react';
import { Link } from 'react-router';
import { Users, MapPin, Calendar, Clock, PlusCircle } from 'lucide-react';
import { mockCrewMeetings, getCourseById } from '../data/mockData';

export default function CrewList() {
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');

  const regions = ['전체', '서울', '부산', '제주'];

  const meetingsWithCourses = mockCrewMeetings.map((meeting) => ({
    ...meeting,
    course: getCourseById(meeting.courseId),
  }));

  const filteredMeetings = meetingsWithCourses.filter((meeting) => {
    if (selectedRegion === '전체') return true;
    return meeting.course?.region === selectedRegion;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-black mb-2">크루 모집</h1>
        <p className="text-zinc-400 text-sm">함께 달릴 러너를 찾아보세요</p>
      </div>

      {/* Create Button */}
      <div className="px-6 mb-6">
        <button className="w-full bg-lime-400 text-black font-bold py-4 rounded-xl hover:bg-lime-300 transition-colors flex items-center justify-center gap-2">
          <PlusCircle className="w-5 h-5" />
          새 크루 모집하기
        </button>
      </div>

      {/* Region Filter */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                selectedRegion === region
                  ? 'bg-lime-400 text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Meetings List */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            모집 중인 크루{' '}
            <span className="text-zinc-400 text-base font-normal">
              {filteredMeetings.length}개
            </span>
          </h2>
        </div>

        {filteredMeetings.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400">모집 중인 크루가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-zinc-900 rounded-2xl overflow-hidden hover:bg-zinc-800 transition-colors"
              >
                {/* Course Info */}
                {meeting.course && (
                  <Link to={`/course/${meeting.course.id}`}>
                    <div className="aspect-video relative overflow-hidden">
                      {meeting.course.imageUrl ? (
                        <div className="relative w-full h-full">
                          <img
                            src={meeting.course.imageUrl}
                            alt={meeting.course.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          {/* Shape emoji */}
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center text-2xl">
                            {getShapeEmoji(meeting.course.shapeType)}
                          </div>
                          {/* Course name */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="text-sm text-lime-400 font-bold">
                              {meeting.course.name}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-lime-600 to-lime-900 flex items-center justify-center relative">
                          <div className="text-6xl">
                            {getShapeEmoji(meeting.course.shapeType)}
                          </div>
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
                            <div className="text-xs text-lime-400 font-bold">
                              {meeting.course.name}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                )}

                <div className="p-4">
                  {/* Meeting Details */}
                  <div className="space-y-2 mb-4">
                    {meeting.course && (
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {meeting.course.region} • {meeting.course.distance}km
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(meeting.date).toLocaleDateString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Clock className="w-4 h-4" />
                      <span>{meeting.time} 출발</span>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-lime-400" />
                      <span className="text-sm text-zinc-400">참여자</span>
                    </div>
                    <div className="font-bold text-lime-400">
                      {meeting.currentParticipants}/{meeting.maxParticipants}명
                    </div>
                  </div>

                  {/* CTA */}
                  {meeting.chatLink ? (
                    <a
                      href={meeting.chatLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-yellow-400 text-black font-bold py-3 rounded-lg text-center hover:bg-yellow-300 transition-colors"
                    >
                      오픈채팅 참여하기
                    </a>
                  ) : (
                    <button className="w-full bg-lime-400 text-black font-bold py-3 rounded-lg hover:bg-lime-300 transition-colors">
                      참여하기
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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