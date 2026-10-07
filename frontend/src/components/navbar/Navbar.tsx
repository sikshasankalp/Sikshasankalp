import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Logo } from '../common/Logo';
import { Button } from '../buttons/Button';
import { mainNavigation, moreNavigation } from '../../data/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { language: currentLanguage, setLanguage: setCurrentLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

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
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-border/40 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-sm' 
            : 'bg-background'
        }`}
      >
        {/* Top Compliance & 80G Tax Exemption Announcement Bar (like Bal Raksha Bharat) */}
        <div className="bg-[#B84E1F] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 text-center font-medium tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 shadow-inner">
          <span className="hidden sm:inline">
            {currentLanguage === 'Hindi'
              ? 'शिक्षा संकल्प फाउंडेशन आयकर अधिनियम 1961 की धारा 12A एवं 80G के तहत पंजीकृत है। सभी दान 50% कर-मुक्त हैं।'
              : 'Siksha Sankalp Foundation is registered under Sections 12A & 80G of the Income Tax Act, 1961. All donations are 50% tax exempt.'}
          </span>
          <span className="inline sm:hidden">
            {currentLanguage === 'Hindi'
              ? '12A एवं 80G प्रमाणित NGO • 50% कर छूट'
              : '12A & 80G Registered NGO • 50% Tax Exempt'}
          </span>
          <Link
            to="/transparency"
            className="underline font-bold text-amber-200 hover:text-white transition-colors inline-flex items-center gap-0.5 shrink-0 ml-1"
          >
            {currentLanguage === 'Hindi' ? 'प्रमाणपत्र देखें →' : 'View Certificates →'}
          </Link>
        </div>

        {/* Full width container with compact padding for modern crisp look */}
        <div className={`w-full px-4 md:px-6 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'py-1 md:py-1.5' : 'py-1.5 md:py-2'
        }`}>
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
                {t('navbar.navbar.text1')}
                                              <ChevronDown className={`w-[14px] h-[14px] transition-transform ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full right-0 mt-1 w-48 bg-surface rounded-lg shadow-elevated border border-border overflow-hidden transition-all duration-200 origin-top-right ${
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
            {/* Language Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsLanguageDropdownOpen(true)}
              onMouseLeave={() => setIsLanguageDropdownOpen(false)}
            >
              <button 
                className="flex items-center gap-1 text-[14px] font-medium text-content-secondary hover:text-brand-primary transition-colors py-2"
                aria-expanded={isLanguageDropdownOpen}
                aria-haspopup="true"
              >
                <Globe className="w-[14px] h-[14px]" />
                <span className="mt-[1px]">{currentLanguage === 'English' ? 'EN' : 'HI'}</span>
                <ChevronDown className={`w-[14px] h-[14px] transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div 
                className={`absolute top-full right-0 mt-1 w-36 bg-surface rounded-lg shadow-elevated border border-border overflow-hidden transition-all duration-200 origin-top-right ${
                  isLanguageDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                }`}
              >
                <div className="py-2">
                  <button
                    onClick={() => {
                      setCurrentLanguage('English');
                      setIsLanguageDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-[14px] transition-colors hover:bg-surface-muted ${
                      currentLanguage === 'English' ? 'text-brand-primary font-medium bg-brand-primary/5' : 'text-content-secondary'
                    }`}
                  >
                    {t('navbar.navbar.text2')}
                                                        </button>
                  <button
                    onClick={() => {
                      setCurrentLanguage('Hindi');
                      setIsLanguageDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-[14px] transition-colors hover:bg-surface-muted ${
                      currentLanguage === 'Hindi' ? 'text-brand-primary font-medium bg-brand-primary/5' : 'text-content-secondary'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link to="/admin/dashboard" className="text-[14px] font-medium text-content-secondary hover:text-brand-primary transition-colors">
                    {t('navbar.navbar.text3')}
                                                        </Link>
                )}
                <Link to="/account/donations" className="text-[14px] font-medium text-content-secondary hover:text-brand-primary transition-colors">
                  {t('navbar.navbar.text4')}
                                                  </Link>
                <Button variant="outline" size="sm" onClick={() => logout()} className="text-[14px] px-4 py-1.5">
                  {t('navbar.navbar.text5')}
                                                  </Button>
                <Button variant="accent" size="sm" to="/donate" className="text-[14px] px-4 py-1.5">
                  {t('navbar.navbar.text6')}
                                                  </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="text-[14px] font-medium text-content-secondary hover:text-brand-primary transition-colors px-2 py-1.5"
                >
                  {t('navbar.navbar.text7')}
                </Link>
                <Button variant="accent" size="sm" to="/donate" className="text-[14px] px-4 py-1.5 font-semibold shadow-sm">
                  {t('navbar.navbar.text6')}
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end gap-4 lg:hidden">
          <Button variant="accent" size="sm" to="/donate" className="text-xs px-3.5 py-1.5 md:px-4 md:py-2 font-semibold shadow-sm">
            {t('navbar.navbar.text8')}
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
    </header>

    {/* Mobile Drawer (placed outside header to prevent backdrop-filter containing block trap) */}
    <div 
      className={`fixed inset-x-0 bottom-0 top-[56px] md:top-[70px] bg-background z-40 transition-transform duration-300 ease-in-out overflow-y-auto lg:hidden flex flex-col shadow-2xl ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}
    >
      <div className="flex-1 px-4 py-6 flex flex-col gap-6">
        <nav className="flex flex-col gap-1 border-b border-border pb-6">
          <span className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-2 px-3">{t('navbar.navbar.text10')}</span>
          {mainNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
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
          <span className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-2 px-3">{t('navbar.navbar.text11')}</span>
          {moreNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
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
          
          {user && (
            <>
              <span className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-2 px-3 mt-4">{t('navbar.navbar.text12')}</span>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-3 rounded-md text-base font-medium transition-colors text-content-secondary hover:bg-surface-muted"
                >
                  {t('navbar.navbar.text13')}
                </Link>
              )}
              <Link
                to="/account/donations"
                className="px-3 py-3 rounded-md text-base font-medium transition-colors text-content-secondary hover:bg-surface-muted"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navbar.navbar.text14')}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-3 rounded-md text-base font-medium transition-colors text-content-secondary hover:bg-surface-muted"
              >
                {t('navbar.navbar.text15')}
              </button>
            </>
          )}

          {!user && (
            <div className="pt-2 px-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full py-2.5 px-4 rounded-lg text-sm font-semibold border border-border text-content-primary hover:bg-surface-muted transition-colors"
              >
                {t('navbar.navbar.text7')}
              </Link>
            </div>
          )}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border bg-surface-muted mt-auto">
        <button 
          onClick={() => setCurrentLanguage(currentLanguage === 'English' ? 'Hindi' : 'English')}
          className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-border rounded-md text-content-primary font-medium hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <Globe className="w-5 h-5 text-brand-primary" />
          <span>{currentLanguage === 'English' ? 'Read in हिन्दी' : 'Read in English'}</span>
        </button>
      </div>
    </div>
  </>
  );
}
