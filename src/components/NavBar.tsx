import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Translator" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
];

export function NavBar() {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <nav aria-label="Site navigation" className="flex items-center gap-2">
      <div className="flex items-center gap-1 border-r border-amber-500/10 pr-2 dark:border-amber-300/10">
        {NAV_LINKS.map(({ to, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={[
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-amber-500/15 text-text-title shadow-[0_0_10px_rgba(217,119,6,0.1)] dark:bg-amber-300/15 dark:shadow-[0_0_10px_rgba(255,183,0,0.15)]"
                  : "text-text-muted hover:bg-amber-500/10 hover:text-text-title dark:hover:bg-amber-300/8",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="rounded-lg p-2 text-text-muted hover:bg-amber-500/10 hover:text-text-title dark:hover:bg-amber-300/8 transition-all duration-200"
      >
        {theme === "dark" ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-3.636l-.707.707M6.343 17.657l-.707-.707m12.728 0l-.707.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </nav>
  );
}
