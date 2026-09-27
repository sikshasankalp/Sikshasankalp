import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Logo } from '../common/Logo';
import { Button } from '../buttons/Button';
import { mainNavigation, moreNavigation } from '../../data/navigation';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body scroll lock for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const DesktopNavLinks = mainNavigation.slice(0, 5).map((item) => {
    const isActive = location.pathname === item.href || 
      (item.href !== '/' && location.pathname.startsWith(item.href));
      
    return (
      <Link
        key={item.label}
        to={item.href}
        className={`text-[14px] font-medium transition-colors hover:text-brand-primary ${
          isActive ? 'text-brand-primary' : 'text-content-secondary'
        }`}
      >
        {item.label}
      </Link>
    );
  });

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5' 
          : 'bg-white py-3 md:py-4'
      }`}
    >
      {/* Full width container with minimal padding to push items to the edges like Spotify */}
      <div className="w-full px-4 md:px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Right: All Navigation & Actions */}
        <nav className="hidden lg:flex items-center">
          {/* Nav Links */}
          <div className="flex items-center gap-5">
            {DesktopNavLinks}
            
            {/* More Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMoreDropdownOpen(true)}
              onMouseLeave={() => setIsMoreDropdownOpen(false)}
            >
              <button 
                className="flex items-center gap-1 text-[14px] font-medium text-content-secondary hover:text-brand-primary transition-colors py-2"
                aria-expanded={isMoreDropdownOpen}
                aria-haspopup="true"
              >
                More
                <ChevronDown className={`w-[14px] h-[14px] transition-transform ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-elevated border border-border overflow-hidden transition-all duration-200 origin-top-right ${
                  isMoreDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                }`}
              >
                <div className="py-2">
                  {[...mainNavigation.slice(5), ...moreNavigation].map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        className={`block px-4 py-2 text-[14px] transition-colors hover:bg-surface-muted ${
                          isActive ? 'text-brand-primary font-medium bg-brand-primary/5' : 'text-content-secondary'
                        }`}
                        onClick={() => setIsMoreDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[1px] h-4 bg-border mx-4"></div>

          <div className="flex items-center gap-4">
            {/* Language Switcher Placeholder */}
            <button 
              className="flex items-center gap-1.5 text-[14px] font-medium text-content-secondary hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm"
              aria-label="Switch language to Hindi"
            >
              <Globe className="w-[14px] h-[14px]" />
              <span className="mt-[1px]">हिन्दी</span>
            </button>
            
            {/* Donate CTA */}
            <Button variant="accent" size="sm" to="/donate" className="text-[14px] px-4 py-1.5">
              Donate Now
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end gap-4 lg:hidden">
          <Button variant="accent" size="sm" to="/donate" className="text-xs px-3 py-1.5 md:px-4 md:py-2">
            Donate
          </Button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-content-secondary hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-md"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 top-[60px] md:top-[72px] bg-white z-40 transition-transform duration-300 ease-in-out overflow-y-auto lg:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex-1 px-4 py-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-1 border-b border-border pb-6">
            <span className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-2 px-3">Main</span>
            {mainNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive 
                      ? 'bg-brand-primary/5 text-brand-primary' 
                      : 'text-content-primary hover:bg-surface-muted'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <nav className="flex flex-col gap-1 pb-6">
            <span className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-2 px-3">More</span>
            {moreNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive 
                      ? 'bg-brand-primary/5 text-brand-primary' 
                      : 'text-content-secondary hover:bg-surface-muted'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border bg-surface-muted mt-auto">
          <button className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-border rounded-md text-content-primary font-medium hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
            <Globe className="w-5 h-5 text-brand-primary" />
            <span>Read in हिन्दी</span>
          </button>
        </div>
      </div>
    </header>
  );
}
