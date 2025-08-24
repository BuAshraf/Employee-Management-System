import React, { useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useI18n } from '../i18n';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme, gsap, useGSAP } = useI18n();
  const toggleRef = useRef();
  const iconRef = useRef();

  useGSAP(() => {
    // Initial setup
    if (theme === 'dark') {
      gsap.set(toggleRef.current, { backgroundColor: '#374151' });
      gsap.set(iconRef.current, { rotation: 180 });
    }
  }, [theme]);

  const handleToggle = () => {
    // Animate the toggle switch
    gsap.to(toggleRef.current, {
      duration: 0.3,
      backgroundColor: theme === 'light' ? '#374151' : '#e5e7eb',
      ease: "power2.inOut"
    });

    // Animate the icon rotation
    gsap.to(iconRef.current, {
      duration: 0.4,
      rotation: theme === 'light' ? 180 : 0,
      scale: 0.8,
      ease: "back.out(1.7)",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        gsap.set(iconRef.current, { scale: 1 });
      }
    });

    // Animate page transition
    gsap.to("body", {
      duration: 0.3,
      backgroundColor: theme === 'light' ? '#0f172a' : '#ffffff',
      ease: "power2.inOut"
    });

    toggleTheme();
  };

  return (
    <button
      ref={toggleRef}
      onClick={handleToggle}
      className={`relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
      } ${className}`}
      aria-label="Toggle dark mode"
    >
      <div
        ref={iconRef}
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
          theme === 'dark' ? 'text-yellow-400' : 'text-gray-600'
        }`}
      >
        {theme === 'dark' ? (
          <Moon size={14} />
        ) : (
          <Sun size={14} />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
