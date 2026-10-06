import { Link } from 'react-router-dom';


interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  // If you need a white version of the logo for dark backgrounds (like the footer),
  // you can conditionally render a different image or use CSS filters.
  // For now, we'll use the main logo image.
  
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-md ${className}`}
      aria-label="Siksha Sankalp Foundation - Home"
    >
      <img 
        src="/logo/logo.jpeg" 
        alt="Siksha Sankalp Foundation Logo" 
        className="h-12 md:h-16 w-auto object-contain transition-transform group-hover:scale-105 rounded-md"
      />
    </Link>
  );
}
