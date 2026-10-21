import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDownIcon, HorizontaLDots } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { Trophy, Shield, ClipboardList, Copy } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { useSidebarBadges } from "../hooks/useSidebarBadges";

type NavSubItem = {
  name: string;
  path: string;
  isEvent?: boolean;
  badgeCount?: number;
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  badgeCount?: number;
  subItems?: NavSubItem[];
};

type MenuSection = {
  title: string;
  key: string;
  items: NavItem[];
};

const DEFAULT_PROGRAM_SUBITEMS: NavSubItem[] = [
  { name: "Academy", path: "/program/academy" },
  { name: "Schools", path: "/program/schools" },
  { name: "Holiday Camps", path: "/program/holiday-camps" },
  { name: "1on1 Sessions", path: "/program/1on1-sessions" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    sectionKey: string;
    index: number;
  } | null>(null);

  const userStr = localStorage.getItem("user");
  let userRole = "";
  if (userStr) {
    try {
      userRole = JSON.parse(userStr)?.role || "";
    } catch { }
  }

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLUListElement | null>>({});

  const { categories } = useCategories({ isEvent: "all" });
  const { badges, markPathAsSeen } = useSidebarBadges();

  const programsSubItems = useMemo(() => {
    const baseItems: NavSubItem[] =
      categories && categories.length > 0
        ? categories.map((cat: any) => ({
          name: cat.name.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()),
          path: `/program/${cat.name.toLowerCase().replace(/\s+/g, "-")}`,
          isEvent: !!cat.isEvent,
        }))
        : DEFAULT_PROGRAM_SUBITEMS;

    return baseItems.map((item) => {
      // Unallocated players badge attached to Academy
      if (item.path.toLowerCase().includes("academy")) {
        return {
          ...item,
          badgeCount: badges.unallocatedPlayers || 0,
        };
      }
      return item;
    });
  }, [categories, badges.unallocatedPlayers]);

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

  const coachMenuSections: MenuSection[] = useMemo(() => [
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
          badgeCount: badges.temporaryPlayers || 0,
          subItems: [
            { name: "Player List", path: "/my-players" },
            {
              name: "Temporary Players",
              path: "/temporary-players-list",
              badgeCount: badges.temporaryPlayers || 0
            },
            { name: "Add Temporary Players", path: "/add-temporary-players" },
            { name: "My Notes", path: "/coach-notes" }
          ],
        },
        {
          name: "Classes",
          icon: <CalendarIcon />,
          path: "/schedule",
        },
        {
          name: "Programs",
          icon: <CalendarIcon />,
          subItems: programsSubItems,
        },
        {
          name: "Communication",
          icon: <ChatIcon />,
          subItems: [
            { name: "Direct & Group Chat", path: "/messages" },
            { name: "Class Broadcast Announcements", path: "/announcements" },
          ],
        },
        {
          name: "News",
          icon: <GridIcon />,
          path: "/news",
        },
      ],
    },
    {
      title: "Settings",
      key: "settings",
      items: [
        {
          name: "My Profile",
          icon: <UserIcon />,
          path: "/profile",
        },
      ],
    },
  ], [badges.temporaryPlayers, programsSubItems]);

  const adminMenuSections: MenuSection[] = useMemo(() => [
    {
      title: "Main",
      key: "main",
      items: [
        { name: "Dashboard", icon: <GridIcon />, path: "/" },
        {
          name: "Players Management",
          icon: <UserIcon />,
          badgeCount: badges.playersManagementTotal || 0,
          subItems: [
            { name: "Players", path: "/players" },
            { name: "Add Temporary Players", path: "/add-temporary-players" },
            {
              name: "Temporary Players",
              path: "/temporary-players-list",
              badgeCount: badges.temporaryPlayers || 0
            },
            {
              name: "Verification Request",
              path: "/new-registration-request",
              badgeCount: badges.verificationRequests || 0
            }
          ]
        },
        {
          name: "Programs",
          icon: <CalendarIcon />,
          badgeCount: badges.unallocatedPlayers || 0,
          subItems: programsSubItems
        },
        {
          name: "Classes",
          icon: <CalendarIcon />,
          path: "/programs-2",
          badgeCount: badges.unallocatedPlayers || 0,
        },
        // {
        //   name: "Classes",
        //   icon: <CalendarIcon />,
        //   path: "/classes"
        // },
      ],
    },
    {
      title: "OPERATIONS",
      key: "operations",
      items: [
        {
          name: "Events",
          icon: <CalendarIcon />,
          badgeCount: badges.eventRegistrations || 0,
          subItems: [
            {
              name: "All Events",
              path: "/events",
              badgeCount: badges.eventRegistrations || 0
            },
            { name: "Add Event", path: "/add-event" },
          ],
        },
        {
          name: "Communication",
          icon: <ChatIcon />,
          subItems: [
            { name: "Direct & Group Chat", path: "/communication" },
            { name: "Class Broadcast Announcements", path: "/announcements" },
          ],
        },
        {
          name: "Leagues",
          icon: <Trophy size={18} />,
          path: "/leagues"
        },
        {
          name: "Teams Management",
          icon: <Shield size={18} />,
          path: "/teams"
        },
        {
          name: "Finance",
          icon: <GridIcon />,
          badgeCount: badges.financeTotal || 0,
          subItems: [
            { name: "Bank Details", path: "/bank-details" },
            {
              name: "Invoices",
              path: "/invoices",
              badgeCount: badges.unpaidInvoices || 0
            },
            {
              name: "Transactions",
              path: "/transactions",
              badgeCount: badges.pendingPayments || 0
            },
            { name: "Term Earnings", path: "/term-earnings" }
          ]
        },
      ],
    },
    {
      title: "COMMERCE",
      key: "commerce",
      items: [
        {
          name: "Store",
          icon: <GridIcon />,
          badgeCount: badges.orders || 0,
          subItems: [
            { name: "Product List", path: "/products" },
            { name: "Add Product", path: "/add-product" },
            {
              name: "Orders",
              path: "/orders",
              badgeCount: badges.orders || 0
            }
          ]
        },
      ],
    },
    {
      title: "Content & Media",
      key: "media",
      items: [
        {
          name: "News",
          icon: <GridIcon />,
          subItems: [
            { name: "All News", path: "/news" },
            { name: "Add News", path: "/add-content" },
          ],
        },
      ],
    },
    {
      title: "Management",
      key: "management",
      items: [
        { name: "Coaching Management", icon: <UserIcon />, path: "/coaching-management" },
        { name: "Coach Manage", icon: <UserIcon />, path: "/coaches" },
        { name: "Sponsors", icon: <GridIcon />, path: "/sponsors" },
        { name: "Audit Logs", icon: <ClipboardList size={18} />, path: "/audit-logs" },
        { name: "Clone Term", icon: <Copy size={18} />, path: "/clone-term" },
      ],
    },
    {
      title: "Settings",
      key: "settings",
      items: [
        { name: "Settings", icon: <SettingsIcon />, path: "/profile" }
      ],
    },
  ], [badges, programsSubItems]);

  const menuSections = ["SUPER_ADMIN", "ADMIN"].includes(userRole) ? adminMenuSections : coachMenuSections;

  useEffect(() => {
    let matchedSectionKey: string | null = null;
    let matchedIndex: number | null = null;

    menuSections.forEach((section) => {
      section.items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (location.pathname === subItem.path) {
              matchedSectionKey = section.key;
              matchedIndex = index;
            }
          });
        }
      });
    });

    setOpenSubmenu((prev) => {
      if (matchedSectionKey !== null && matchedIndex !== null) {
        if (prev && prev.sectionKey === matchedSectionKey && prev.index === matchedIndex) {
          return prev;
        }
        return { sectionKey: matchedSectionKey, index: matchedIndex };
      }
      return null;
    });
  }, [location.pathname, menuSections]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.sectionKey}-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];
      if (el) {
        const height = el.scrollHeight || 0;
        setSubMenuHeight((prev) => {
          if (prev[key] === height) return prev;
          return { ...prev, [key]: height };
        });
      }
    }
  }, [openSubmenu, programsSubItems]);

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
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => {
        const hasBadge = (nav.badgeCount || 0) > 0;
        const isCollapsedMode = !isExpanded && !isHovered && !isMobileOpen;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(sectionKey, index)}
                className={`menu-item group ${openSubmenu?.sectionKey === sectionKey && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
                  } cursor-pointer ${isCollapsedMode
                    ? "lg:justify-center"
                    : "lg:justify-start"
                  } relative`}
              >
                <span
                  className={`menu-item-icon-size relative ${openSubmenu?.sectionKey === sectionKey && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                  {isCollapsedMode && hasBadge && (
                    <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#031549]">
                      {nav.badgeCount! > 99 ? "99+" : nav.badgeCount}
                    </span>
                  )}
                </span>
                <span className={`menu-item-text ${!isCollapsedMode ? "block" : "hidden"}`}>
                  {nav.name}
                </span>

                {!isCollapsedMode && hasBadge && (
                  <span className="ml-auto mr-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm ring-1 ring-rose-400/30 animate-pulse">
                    ({nav.badgeCount! > 99 ? "99+" : nav.badgeCount})
                  </span>
                )}

                <ChevronDownIcon
                  className={`${hasBadge ? "" : "ml-auto"} w-4 h-4 transition-transform duration-200 ${!isCollapsedMode ? "block" : "hidden"} ${openSubmenu?.sectionKey === sectionKey &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-white"
                    : "text-slate-400"
                    }`}
                />
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                    } ${isCollapsedMode ? "lg:justify-center" : "lg:justify-start"} relative`}
                >
                  <span
                    className={`menu-item-icon-size relative ${isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                    {isCollapsedMode && hasBadge && (
                      <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#031549]">
                        {nav.badgeCount! > 99 ? "99+" : nav.badgeCount}
                      </span>
                    )}
                  </span>
                  <span className={`menu-item-text ${!isCollapsedMode ? "block" : "hidden"}`}>
                    {nav.name}
                  </span>
                  {!isCollapsedMode && hasBadge && (
                    <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm ring-1 ring-rose-400/30">
                      ({nav.badgeCount! > 99 ? "99+" : nav.badgeCount})
                    </span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (
              <div
                className={`overflow-hidden transition-all duration-300 ${!isCollapsedMode ? "block" : "hidden"}`}
                style={{
                  height:
                    openSubmenu?.sectionKey === sectionKey && openSubmenu?.index === index
                      ? `${subMenuHeight[`${sectionKey}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul
                  ref={(el) => {
                    subMenuRefs.current[`${sectionKey}-${index}`] = el;
                  }}
                  className="pt-1 space-y-1 ml-9 pb-1"
                >
                  {nav.subItems.map((subItem) => {
                    const subBadge = (subItem.badgeCount || 0) > 0;
                    return (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`menu-dropdown-item flex items-center justify-between gap-2 ${isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                            }`}
                        >
                          <span className="truncate">{subItem.name}</span>
                          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                            {subItem.isEvent && (
                              <span className="px-1 py-px text-[7px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-none select-none">
                                Holiday
                              </span>
                            )}
                            {subBadge && (
                              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-sm ring-1 ring-rose-500/30">
                                ({subItem.badgeCount! > 99 ? "99+" : subItem.badgeCount})
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 2xl:px-5 left-0 bg-[#031549] text-gray-300 h-screen transition-all duration-300 ease-in-out z-50 border-r border-[#082269] 
        ${isExpanded || isMobileOpen
          ? "w-[240px] 2xl:w-[290px]"
          : isHovered
            ? "w-[240px] 2xl:w-[290px]"
            : "w-[80px] xl:w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-6 flex justify-center w-full">
        <Link to="/">
          <span className={isExpanded || isHovered || isMobileOpen ? "block" : "hidden"}>
            <img src="/images/logo/newlogo.png" alt="CoachMax" className="h-12 object-contain" />
          </span>
          <span className={!isExpanded && !isHovered && !isMobileOpen ? "block" : "hidden"}>
            <span className="text-white font-bold text-xl">C</span>
          </span>
        </Link>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar pb-6">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {menuSections.map((section) => (
              <div key={section.key}>
                <h2
                  className={`mb-1.5 text-[10px] tracking-wider uppercase font-semibold text-slate-400/70 flex leading-[20px] ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}
                >
                  <span className={isExpanded || isHovered || isMobileOpen ? "block" : "hidden"}>
                    {section.title}
                  </span>
                  <span className={!isExpanded && !isHovered && !isMobileOpen ? "block" : "hidden"}>
                    <HorizontaLDots className="size-6" />
                  </span>
                </h2>
                {renderMenuItems(section.items, section.key)}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
