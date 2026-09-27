import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function Logo({ className = '', variant = 'dark' }: LogoProps) {
  const textColor = variant === 'dark' ? 'text-brand-primary' : 'text-white';
  const iconColor = variant === 'dark' ? 'text-brand-accent' : 'text-white';

  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-md ${className}`}
      aria-label="Shiksha Sankalp Foundation - Home"
    >
      <div className={`p-1.5 md:p-2 rounded-lg bg-opacity-10 group-hover:bg-opacity-20 transition-colors ${variant === 'dark' ? 'bg-brand-primary' : 'bg-white'}`}>
        <BookOpen className={`w-5 h-5 md:w-7 md:h-7 ${iconColor}`} />
      </div>
      <div className="flex flex-col">
        <span className={`font-display font-bold text-[17px] md:text-[19px] leading-none ${textColor}`}>
          Shiksha Sankalp
        </span>
        <span className={`text-[9px] md:text-[11px] font-medium uppercase tracking-wider ${variant === 'dark' ? 'text-content-muted' : 'text-white/80'}`}>
          Foundation
        </span>
      </div>
    </Link>
  );
}
