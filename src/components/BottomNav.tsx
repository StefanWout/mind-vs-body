import { Home, PlusCircle, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/log', icon: PlusCircle, label: 'Log' },
    { path: '/trends', icon: TrendingUp, label: 'Trends' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-smooth",
                "hover:bg-muted active:scale-95",
                isActive && "text-primary"
              )}
            >
              <item.icon className={cn(
                "h-6 w-6 transition-smooth",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
