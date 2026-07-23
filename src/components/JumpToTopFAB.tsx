import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const JumpToTopFAB: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Tampilkan tombol jika user scroll ke bawah lebih dari 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-40 p-3 bg-[#ccff00] text-black rounded-full shadow-lg hover:bg-[#b3e600] transition-colors cursor-pointer flex items-center justify-center animate-[fadeIn_0.3s_ease-out]"
      title="Jump to Top"
      aria-label="Jump to Top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
