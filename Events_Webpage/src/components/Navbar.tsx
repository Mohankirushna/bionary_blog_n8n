import { Search, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: 'list' | 'details';
}

export function Navbar({ searchQuery, onSearchChange, currentPage }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage and system preference on mount
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--primary)] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand */}
          <div className="flex-shrink-0">
            <h2 className="text-[var(--primary-foreground)]">Events</h2>
          </div>

          {/* Search - Only show on list page */}
          {currentPage === 'list' && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search events..."
                  className="w-full px-6 py-3 rounded-full bg-[rgba(0,0,0,0.15)] text-[var(--primary-foreground)] placeholder:text-[var(--primary-foreground)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--primary-foreground)]/60" />
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[rgba(0,0,0,0.15)] hover:bg-[rgba(0,0,0,0.25)] transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-[var(--primary-foreground)]" />
            ) : (
              <Moon className="w-5 h-5 text-[var(--primary-foreground)]" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        {currentPage === 'list' && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search events..."
                className="w-full px-6 py-3 rounded-full bg-[rgba(0,0,0,0.15)] text-[var(--primary-foreground)] placeholder:text-[var(--primary-foreground)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--primary-foreground)]/60" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}