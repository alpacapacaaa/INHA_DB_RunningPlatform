import { Outlet, Link, useLocation } from 'react-router';
import { Compass, User, Clock, PersonStanding } from 'lucide-react'; // "PersonStanding" or similar for run

export default function Layout() {
  const location = useLocation();
  const isRunning = location.pathname === '/run';
  const isDetail = location.pathname.startsWith('/course/');

  // 러닝 트래커 또는 상세 화면에서는 바텀 네비게이션 숨기기
  if (isRunning) {
    return <Outlet />;
  }

  const navItems = [
    { path: '/', icon: Compass, label: 'EXPLORE' },
    { path: '/run', icon: PersonStanding, label: 'RUN' }, // Close enough icon for runner
    { path: '/crew', icon: Clock, label: 'HISTORY' }, // Used '/crew' for History to not break links, but changed label
    { path: '/my-page', icon: User, label: 'PROFILE' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      <main className={`flex-1 ${!isDetail ? 'pb-20' : ''}`}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {!isDetail && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-zinc-900 z-50">
          <div className="max-w-lg mx-auto px-6 py-2 pb-safe">
            <div className="flex items-center justify-between">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center gap-1 transition-colors py-2 px-3 ${
                      isActive ? 'text-[#3B82F6]' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mb-0.5" strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
