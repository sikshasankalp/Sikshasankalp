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
        Top padding dynamically matches the navbar height on mobile, keeping ticker flush and never overlapped.
        Desktop md:pt-[98px] remains exactly unchanged.
      */}
      <main className="flex-grow pt-[var(--navbar-height,106px)] md:pt-[98px] flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
