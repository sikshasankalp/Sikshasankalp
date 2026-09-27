import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/footer/Footer';

export default function PublicLayout() {
  const { pathname } = useLocation();

  // Ensures page scrolls to top on navigation instead of relying on ScrollRestoration
  // which requires a Data Router setup.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* 
        Add top padding to main content to account for fixed navbar.
        The exact padding matches the expected navbar height (e.g., pt-20 to pt-24).
      */}
      <main className="flex-grow pt-[72px] md:pt-[84px] flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
