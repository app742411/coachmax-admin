import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router"; // Use react-router v7
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState<boolean>(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen((prev) => !prev);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-20 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">

        {/* LEFT HEADER */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">

          {/* Sidebar Toggle Button */}
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              /* CROSS ICON */
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6.22 7.28a1 1 0 0 1 1.06-1.06l4.72 4.72 4.72-4.72a1 1 0 1 1 1.41 1.41L13.41 12l4.72 4.72a1 1 0 0 1-1.41 1.41L12 13.41l-4.72 4.72a1 1 0 0 1-1.41-1.41L12 13.41l-4.72 4.72a1 1 0 0 1-1.41-1.41L10.59 12 6.22 7.28Z"
                />
              </svg>
            ) : (
              /* HAMBURGER ICON */
              <svg width="16" height="12" fill="none" viewBox="0 0 16 12">
                <path
                  fill="currentColor"
                  d="M0.58 1c0-.41.34-.75.75-.75H14.67c.41 0 .75.34.75.75s-.34.75-.75.75H1.33A.75.75 0 0 1 0.58 1Zm0 10c0-.41.34-.75.75-.75H14.67c.41 0 .75.34.75.75s-.34.75-.75.75H1.33A.75.75 0 0 1 0.58 11ZM1.33 5.25c-.41 0-.75.34-.75.75s.34.75.75.75H8c.41 0 .75-.34.75-.75s-.34-.75-.75-.75H1.33Z"
                />
              </svg>
            )}
          </button>

          {/* Logo (Mobile Only) */}
          <Link to="/" className="lg:hidden flex items-center">
            <img
              className="h-10 w-auto dark:hidden"
              src="./images/logo/cm-logo.png"
              alt="Logo"
            />
            <img
              className="h-10 w-auto hidden dark:block"
              src="./images/logo/cm-logo1.png"
              alt="Logo"
            />
          </Link>

          {/* 3-Dot More Menu (Mobile) */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M6 10.5A1.5 1.5 0 1 1 6 13.5 1.5 1.5 0 0 1 6 10.5Zm12 0A1.5 1.5 0 1 1 18 13.5 1.5 1.5 0 0 1 18 10.5Zm-6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
              />
            </svg>
          </button>

          {/* Search Bar (Desktop Only) */}
          <div className="hidden lg:block">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="20" height="20" className="fill-gray-500 dark:fill-gray-400">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04 9.37a6.33 6.33 0 1 1 12.66 0 6.33 6.33 0 0 1-12.66 0Zm6.33-7.83A7.83 7.83 0 1 0 17.2 9.37a7.83 7.83 0 0 0-7.83-7.83Zm4.98 12.38 2.82 2.82a1 1 0 1 0 1.41-1.41l-2.82-2.82A7.83 7.83 0 0 0 14.35 13.92Z"
                    />
                  </svg>
                </span>

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm shadow-theme-xs placeholder:text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 xl:w-[430px]"
                />

                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-2 py-1 text-xs rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03]">
                  ⌘ K
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT HEADER (User + Theme + Notifications) */}
        <div
          className={`${isApplicationMenuOpen ? "flex" : "hidden"
            } items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0`}
        >
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>

          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
