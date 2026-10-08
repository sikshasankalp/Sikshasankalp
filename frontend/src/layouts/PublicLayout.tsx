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
        Top padding matches the compact navbar height perfectly, keeping ticker flush.
      */}
      <main className="flex-grow pt-[96px] sm:pt-[94px] md:pt-[98px] flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
