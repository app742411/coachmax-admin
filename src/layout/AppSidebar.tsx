import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, HorizontaLDots } from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

type MenuSection = {
  title: string;
  key: string;
  items: NavItem[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    sectionKey: string;
    index: number;
  } | null>(null);

  const userStr = localStorage.getItem("user");
  let userRole = "";
  try {
    if (userStr) {
      const user = JSON.parse(userStr);
      userRole = user.role;
    }
  } catch (e) {
    console.error("Error parsing user data", e);
  }

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // SVG Icons built inline to match the screenshot branding and ensure compatibility
  const GridIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const ShieldIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const CompetitionsIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );

  const AttendanceIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
    </svg>
  );



  const ChatIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const HelpIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const coachMenuSections: MenuSection[] = [
    {
      title: "Main",
      key: "main",
      items: [
        {
          name: "Dashboard",
          icon: <GridIcon />,
          path: "/",
        },
        {
          name: "My Players",
          icon: <UserIcon />,
          path: "/my-players",
        },
        {
          name: "Programs",
          icon: <CalendarIcon />,
          path: "/programs",
        },
      ],
    },
    {
      title: "Team Management",
      key: "team_management",
      items: [
        {
          name: "My Teams",
          icon: <ShieldIcon />,
          path: "/my-teams",
        },
        {
          name: "Attendance",
          icon: <AttendanceIcon />,
          path: "/attendance",
        },
        {
          name: "Performance",
          icon: <GridIcon />,
          path: "/performance",
        },
        {
          name: "Competitions",
          icon: <CompetitionsIcon />,
          path: "/competitions",
        },
      ],
    },
    {
      title: "Training",
      key: "training",
      items: [
        {
          name: "Sessions",
          icon: <CalendarIcon />,
          path: "/sessions",
        },
        {
          name: "Schedule",
          icon: <CalendarIcon />,
          path: "/schedule",
        },
        {
          name: "Exercises",
          icon: <GridIcon />,
          path: "/exercises",
        },
      ],
    },
    {
      title: "Communication",
      key: "communication",
      items: [
        {
          name: "Messages",
          icon: <ChatIcon />,
          path: "/messages",
        },
        {
          name: "Announcements",
          icon: <ChatIcon />,
          path: "/announcements",
        },
      ],
    },
    {
      title: "Reports",
      key: "reports",
      items: [
        {
          name: "Player Reports",
          icon: <UserIcon />,
          path: "/player-reports",
        },
        {
          name: "Attendance Reports",
          icon: <AttendanceIcon />,
          path: "/attendance-reports",
        },
        {
          name: "Performance Reports",
          icon: <GridIcon />,
          path: "/performance-reports",
        },
      ],
    },
    {
      title: "Settings",
      key: "settings",
      items: [
        {
          name: "Profile Settings",
          icon: <SettingsIcon />,
          path: "/profile-settings",
        },
        {
          name: "Availability",
          icon: <CalendarIcon />,
          path: "/availability",
        },
        {
          name: "Help & Support",
          icon: <HelpIcon />,
          path: "/help-support",
        },
      ],
    },
  ];

  const adminMenuSections: MenuSection[] = [
    {
      title: "Main",
      key: "main",
      items: [
        { name: "Dashboard", icon: <GridIcon />, path: "/" },
        { name: "Players", icon: <UserIcon />, path: "/players" },
        { 
          name: "Programs", 
          icon: <CalendarIcon />, 
          subItems: [
            { name: "Academy", path: "/academy" },
            { name: "Schools", path: "/schools" },
            { name: "Holiday Camps", path: "/holiday-camps" },
            { name: "1on1 Sessions", path: "/1on1-sessions" },
          ]
        },
      ],
    },
    {
      title: "Teams & Competitions",
      key: "teams_competitions",
      items: [
        { 
          name: "Attendance & Performance", 
          icon: <AttendanceIcon />, 
          subItems: [
            { name: "Overview", path: "/attendance-performance" }
          ]
        },
        { 
          name: "Events", 
          icon: <CalendarIcon />, 
          subItems: [
            { name: "All Events", path: "/events" }
          ]
        },
        { 
          name: "Store", 
          icon: <GridIcon />, 
          subItems: [
            { name: "Products", path: "/products" }
          ]
        },
        { 
          name: "Finance", 
          icon: <GridIcon />, 
          subItems: [
            { name: "Overview", path: "/finance" }
          ]
        },
        { 
          name: "Communication", 
          icon: <ChatIcon />, 
          subItems: [
            { name: "Messages", path: "/communication" }
          ]
        },
      ],
    },
    {
      title: "Management",
      key: "management",
      items: [
        { name: "Coaching Management", icon: <UserIcon />, path: "/coaching-management" },
      ],
    },
    {
      title: "Settings",
      key: "settings",
      items: [
        { name: "Settings", icon: <SettingsIcon />, path: "/profile-settings" },
      ],
    },
  ];

  const menuSections = ["SUPER_ADMIN", "ADMIN"].includes(userRole) ? adminMenuSections : coachMenuSections;

  useEffect(() => {
    let submenuMatched = false;
    menuSections.forEach((section) => {
      section.items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                sectionKey: section.key,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.sectionKey}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (sectionKey: string, index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.sectionKey === sectionKey &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { sectionKey, index };
    });
  };

  const renderMenuItems = (items: NavItem[], sectionKey: string) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(sectionKey, index)}
              className={`menu-item group ${openSubmenu?.sectionKey === sectionKey && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size ${openSubmenu?.sectionKey === sectionKey && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-4 h-4 transition-transform duration-200 ${openSubmenu?.sectionKey === sectionKey &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-white"
                    : "text-slate-400"
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${sectionKey}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.sectionKey === sectionKey && openSubmenu?.index === index
                    ? `${subMenuHeight[`${sectionKey}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-1 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-[#031549] text-gray-300 h-screen transition-all duration-300 ease-in-out z-50 border-r border-[#082269] 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-6 flex justify-center w-full">
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <img src="/images/logo/cm-logo2.png" alt="CoachMax" className="h-12 object-contain" />
          ) : (
            <span className="text-white font-bold text-xl">C</span>
          )}
        </Link>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar pb-6">
        <nav className="mb-6">
          <div className="flex flex-col gap-6">
            {menuSections.map((section) => (
              <div key={section.key}>
                <h2
                  className={`mb-3 text-[10px] tracking-wider uppercase font-semibold text-slate-400/70 flex leading-[20px] ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    section.title
                  ) : (
                    <HorizontaLDots className="size-6" />
                  )}
                </h2>
                {renderMenuItems(section.items, section.key)}
              </div>
            ))}
          </div>
        </nav>

        {/* Help & Support fixed at the bottom when sidebar is expanded */}
        {(isExpanded || isHovered || isMobileOpen) && (
          <div className="mt-auto pt-6 border-t border-[#082269]">
            <Link
              to="/help"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-theme-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <HelpIcon />
              <span>Help & Support</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
