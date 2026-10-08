import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fetchNeeds } from '../../services/api/need';
import type { NgoNeed } from '../../services/api/need';

// Default fallback items if database is empty or loading
const FALLBACK_NEEDS: Array<Pick<NgoNeed, 'id' | 'title' | 'quantity' | 'category' | 'urgency'>> = [
  {
    id: 'f1',
    title: 'Notebook & Stationery Kits',
    quantity: '150 Kits',
    category: 'Education',
    urgency: 'HIGH',
  },
  {
    id: 'f2',
    title: 'Winter Sweaters & Warm Wear',
    quantity: '80 Sets',
    category: 'Winter Relief',
    urgency: 'CRITICAL',
  },
  {
    id: 'f3',
    title: 'Refurbished Laptops for Computer Class',
    quantity: '3 Laptops',
    category: 'Digital Literacy',
    urgency: 'HIGH',
  },
  {
    id: 'f4',
    title: 'Healthy Snack & Nutrition Packs',
    quantity: '200 Packs / Month',
    category: 'Nutrition',
    urgency: 'HIGH',
  },
  {
    id: 'f5',
    title: 'School Bags & Water Bottles',
    quantity: '60 Bags',
    category: 'Education',
    urgency: 'MEDIUM',
  },
];

export const NeedsTicker: React.FC = () => {
  const [needs, setNeeds] = useState<NgoNeed[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchNeeds()
      .then((data) => {
        if (mounted && data && data.length > 0) {
          setNeeds(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load live NGO needs, using fallback items:', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const items = needs.length > 0 ? needs : (FALLBACK_NEEDS as NgoNeed[]);

  return (
    <div
      role="region"
      aria-label="Current NGO Needs Announcement Ticker"
      className="relative w-full bg-[#1c1917] border-b border-[#38332d] text-white overflow-hidden select-none z-30 shadow-xs flex items-center h-10 sm:h-11"
    >
      {/* Pinned Left Badge */}
      <div className="relative z-20 flex items-center gap-2 px-3.5 sm:px-5 h-full bg-[#1c1917] shrink-0 border-r border-[#38332d] shadow-[4px_0_12px_rgba(0,0,0,0.35)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-white hidden xs:inline" />
          Urgent Needs
        </span>
      </div>

      {/* Continuously Scrolling Marquee Items */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        {/* Soft edge gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 sm:w-8 bg-gradient-to-r from-[#1c1917] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 sm:w-8 bg-gradient-to-l from-[#1c1917] to-transparent z-10" />

        <div className="animate-marquee flex items-center gap-8 sm:gap-10 pl-4 h-full">
          {/* First loop */}
          {items.map((item) => (
            <Link
              key={`tick-1-${item.id}`}
              to="/needs"
              className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] text-white hover:text-white/90 transition-colors whitespace-nowrap group cursor-pointer"
            >
              <span className="font-medium text-white group-hover:underline underline-offset-2">
                {item.title}
              </span>
              {item.quantity && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-white/20 text-white border border-white/25 shadow-2xs">
                  {item.quantity}
                </span>
              )}
              {item.category && (
                <span className="text-[11px] text-stone-300 hidden md:inline">
                  ({item.category})
                </span>
              )}
              <span className="text-stone-500 font-bold ml-2 select-none">•</span>
            </Link>
          ))}

          {/* Duplicated loop for seamless infinite marquee */}
          {items.map((item) => (
            <Link
              key={`tick-2-${item.id}`}
              to="/needs"
              className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] text-white hover:text-white/90 transition-colors whitespace-nowrap group cursor-pointer"
            >
              <span className="font-medium text-white group-hover:underline underline-offset-2">
                {item.title}
              </span>
              {item.quantity && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-white/20 text-white border border-white/25 shadow-2xs">
                  {item.quantity}
                </span>
              )}
              {item.category && (
                <span className="text-[11px] text-stone-300 hidden md:inline">
                  ({item.category})
                </span>
              )}
              <span className="text-stone-500 font-bold ml-2 select-none">•</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Pinned Right "See All" Hyperlink */}
      <div className="relative z-20 flex items-center px-3 sm:px-4 h-full bg-[#1c1917] shrink-0 border-l border-[#38332d] shadow-[-4px_0_12px_rgba(0,0,0,0.35)]">
        <Link
          to="/needs"
          className="group inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold tracking-wide text-white hover:text-white/80 transition-colors underline underline-offset-2 decoration-white/40 hover:decoration-white"
          title="View all items needed by the NGO"
        >
          <span>See All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default NeedsTicker;
