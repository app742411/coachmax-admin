import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ChevronDownIcon, HorizontaLDots } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import {
  Activity, CalendarDays, ClipboardList, Copy, CreditCard, LayoutDashboard,
  MessageCircle, Newspaper, Settings2, Shield, ShoppingBag, Tag, Trophy, UserRound,
  Users, UsersRound,
} from "lucide-react";
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
  const { isExpanded, isMobileOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

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

  const navIcon = (Icon: typeof LayoutDashboard) => <Icon size={19} strokeWidth={1.8} />;

  const coachMenuSections: MenuSection[] = useMemo(() => [
    {
      title: "Main",
      key: "main",
      items: [
        {
          name: "Dashboard",
          icon: navIcon(LayoutDashboard),
          path: "/",
        },
        {
          name: "My Players",
          icon: navIcon(Users),
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
          icon: navIcon(Activity),
          path: "/schedule",
        },
        {
          name: "Programs",
          icon: navIcon(CalendarDays),
          subItems: programsSubItems,
        },
        {
          name: "Communication",
          icon: navIcon(MessageCircle),
          subItems: [
            { name: "Direct & Group Chat", path: "/messages" },
            { name: "Class Broadcast Announcements", path: "/announcements" },
          ],
        },
        {
          name: "News",
          icon: navIcon(Newspaper),
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
          icon: navIcon(UserRound),
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
        { name: "Dashboard", icon: navIcon(LayoutDashboard), path: "/" },
        {
          name: "Players Management",
          icon: navIcon(Users),
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
          icon: navIcon(CalendarDays),
          subItems: programsSubItems
        },
        {
          name: "Classes",
          icon: navIcon(CalendarDays),
          path: "/programs-2",
        },
        // {
        //   name: "Classes",
        //   icon: navIcon(CalendarDays),
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
          icon: navIcon(CalendarDays),
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
          name: "Leagues",
          icon: navIcon(Trophy),
          path: "/leagues"
        },
        {
          name: "Teams Management",
          icon: navIcon(Shield),
          path: "/teams"
        },
        {
          name: "Communication",
          icon: navIcon(MessageCircle),
          subItems: [
            { name: "Direct & Group Chat", path: "/communication" },
            { name: "Class Broadcast Announcements", path: "/announcements" },
          ],
        },
        {
          name: "Finance",
          icon: navIcon(CreditCard),
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
          icon: navIcon(ShoppingBag),
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
          icon: navIcon(Newspaper),
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
        { name: "Coaching Management", icon: navIcon(UsersRound), path: "/coaching-management" },
        { name: "Coach Manage", icon: navIcon(UserRound), path: "/coaches" },
        { name: "Sponsors", icon: navIcon(Tag), path: "/sponsors" },
        { name: "Audit Logs", icon: navIcon(ClipboardList), path: "/audit-logs" },
        { name: "Clone Term", icon: navIcon(Copy), path: "/clone-term" },
      ],
    },
    {
      title: "Settings",
      key: "settings",
      items: [
        { name: "Settings", icon: navIcon(Settings2), path: "/profile" }
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
        const isCollapsedMode = !isExpanded && !isMobileOpen;

        return (
          <li key={nav.name} className="group/nav relative">
            {nav.subItems ? (
              <button
                onClick={() => {
                  if (!isCollapsedMode) {
                    handleSubmenuToggle(sectionKey, index);
                    return;
                  }

                  const isAlreadyOpen = openSubmenu?.sectionKey === sectionKey && openSubmenu.index === index;
                  if (isAlreadyOpen) {
                    setOpenSubmenu(null);
                    return;
                  }

                  setOpenSubmenu({ sectionKey, index });
                  const firstDestination = nav.subItems?.find((item) => item.path)?.path;
                  if (firstDestination) navigate(firstDestination);
                }}
                className={`menu-item group ${openSubmenu?.sectionKey === sectionKey && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
                  } cursor-pointer ${isCollapsedMode
                    ? "lg:justify-center"
                    : "lg:justify-start"
                  } relative`}
                aria-label={isCollapsedMode ? nav.name : undefined}
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
                    <span className="ml-auto mr-1.5 inline-flex items-center justify-center min-w-[22px] h-[21px] px-1.5 rounded-full text-[10px] font-bold tabular-nums bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-300/20">
                      {nav.badgeCount! > 99 ? "99+" : nav.badgeCount}
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
                  aria-label={isCollapsedMode ? nav.name : undefined}
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
                  {isCollapsedMode && (
                    <span className="pointer-events-none absolute left-full top-1/2 z-[60] hidden -translate-y-1/2 whitespace-nowrap rounded-r-md border border-white/10 bg-[#061b51] px-3 py-2 text-xs font-semibold text-white shadow-xl group-hover/nav:block">
                      {nav.name}
                    </span>
                  )}
                  {!isCollapsedMode && hasBadge && (
                    <span className="ml-auto inline-flex items-center justify-center min-w-[22px] h-[21px] px-1.5 rounded-full text-[10px] font-bold tabular-nums bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-300/20">
                      {nav.badgeCount! > 99 ? "99+" : nav.badgeCount}
                    </span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (
              <div
                className={`${isCollapsedMode
                  ? openSubmenu?.sectionKey === sectionKey && openSubmenu?.index === index
                    ? "absolute left-full top-0 z-[60] block w-56 rounded-r-lg border border-white/10 bg-[#061b51] p-2 shadow-xl group-hover/nav:block"
                    : "absolute left-full top-0 z-[60] hidden w-56 rounded-r-lg border border-white/10 bg-[#061b51] p-2 shadow-xl group-hover/nav:block"
                  : "block overflow-hidden transition-all duration-300"
                  }`}
                style={{
                  height: isCollapsedMode
                    ? undefined
                    : openSubmenu?.sectionKey === sectionKey && openSubmenu?.index === index
                      ? `${subMenuHeight[`${sectionKey}-${index}`]}px`
                      : "0px",
                }}
              >
                {isCollapsedMode && (
                  <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {nav.name}
                  </div>
                )}
                <ul
                  ref={(el) => {
                    subMenuRefs.current[`${sectionKey}-${index}`] = el;
                  }}
                  className={isCollapsedMode ? "space-y-1" : "pt-1 space-y-1 ml-9 pb-1"}
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
                              <span className="px-1 py-px text-[7px] font-black uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded select-none">
                                Holiday
                              </span>
                            )}
                            {subBadge && (
                              <span className="inline-flex items-center justify-center min-w-[22px] h-[21px] px-1.5 rounded-full text-[10px] font-bold tabular-nums bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-300/20">
                                {subItem.badgeCount! > 99 ? "99+" : subItem.badgeCount}
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
          : "w-[80px] xl:w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div className="py-5 flex justify-center w-full">
        <Link to="/">
          <span className={isExpanded || isMobileOpen ? "block" : "hidden"}>
            <img src="/images/logo/newlogo.png" alt="CoachMax" className="h-12 object-contain" />
          </span>
          <span className={!isExpanded && !isMobileOpen ? "block" : "hidden"}>
            <span className="text-white font-bold text-xl">C</span>
          </span>
        </Link>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar pb-6">
        <nav className="mb-6">
          <div className="flex flex-col gap-3">
            {menuSections.map((section) => (
              <div key={section.key}>
                <h2
                  className={`mb-1.5 px-3 text-[9px] tracking-[0.16em] uppercase font-bold text-slate-500 flex leading-[20px] ${!isExpanded
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}
                >
                  <span className={isExpanded || isMobileOpen ? "block" : "hidden"}>
                    {section.title}
                  </span>
                  <span className={!isExpanded && !isMobileOpen ? "block" : "hidden"}>
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
