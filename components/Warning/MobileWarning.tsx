// components/MobileWarning.tsx
'use client';

import { useEffect, useState } from 'react';

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center p-4 text-center">
      <div
        className="border border-white text-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md"
        role="alert"
        aria-live="assertive"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Desktop Only</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          This application is optimized for desktop screens. Please switch to a larger screen for the best experience.
        </p>
      </div>
    </div>
  );
}
