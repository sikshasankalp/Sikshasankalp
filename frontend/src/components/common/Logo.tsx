import { Link } from 'react-router-dom';


interface LogoProps {
  className?: string;
  imageClassName?: string;
}

export function Logo({ className = '', imageClassName = '' }: LogoProps) {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-md ${className}`}
      aria-label="Siksha Sankalp Foundation - Home"
    >
      <img 
        src="/logo/logo.jpeg" 
        alt="Siksha Sankalp Foundation Logo" 
        className={`h-[46px] sm:h-12 md:h-[54px] w-auto object-contain transition-transform group-hover:scale-105 rounded-md ${imageClassName}`}
      />
    </Link>
  );
}
