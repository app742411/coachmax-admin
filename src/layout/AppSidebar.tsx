import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDownIcon, HorizontaLDots } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import apiClient from "../api/apiClient";
import { Trophy, Shield, Calendar, ClipboardList, Copy } from "lucide-react";
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; isEvent?: boolean }[];
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
  const subMenuRefs = useRef<Record<string, HTMLUListElement | null>>({});

  const [programsSubItems, setProgramsSubItems] = useState<{ name: string; path: string; isEvent?: boolean }[]>([
    { name: "Academy", path: "/program/academy" },
    { name: "Schools", path: "/program/schools" },
    { name: "Holiday Camps", path: "/program/holiday-camps" },
    { name: "1on1 Sessions", path: "/program/1on1-sessions" },
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/user/getCategories', { params: { isEvent: "all" } });
        if (response.data && Array.isArray(response.data)) {
          const formattedCategories = response.data.map((cat: any) => ({
            name: cat.name.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()),
            path: `/program/${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
            isEvent: !!cat.isEvent,
          }));
          setProgramsSubItems(formattedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch programs categories:", error);
      }
    };
    fetchCategories();
  }, []);

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
          subItems: [
            { name: "Player List", path: "/my-players" },
            { name: "Temporary Players", path: "/temporary-players-list" },
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
        // {
        //   name: "Events",
        //   icon: <CalendarIcon />,
        //   subItems: [
        //     { name: "Event List", path: "/events" },
        //   ],
        // },
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
  ];

  const adminMenuSections: MenuSection[] = [
    {
      title: "Main",
      key: "main",
      items: [
        { name: "Dashboard", icon: <GridIcon />, path: "/" },
        {
          name: "Players Management",
          icon: <UserIcon />,
          subItems: [
            { name: "Players", path: "/players" },
            { name: "Add Temporary Players", path: "/add-temporary-players" },
            { name: "Temporary Players", path: "/temporary-players-list" },
            { name: "Verification Request", path: "/new-registration-request" }
          ]
        },
        {
          name: "Programs",
          icon: <CalendarIcon />,
          subItems: programsSubItems
        },
        {
          name: "Classes",
          icon: <CalendarIcon />,
          path: "/classes"
        },
      ],
    },
    {
      title: "OPERATIONS",
      key: "operations",
      items: [
        {
          name: "Events",
          icon: <CalendarIcon />,
          subItems: [
            { name: "All Events", path: "/events" },
            { name: "Add Event", path: "/add-event" },
            // { name: "Training Sessions", path: "/training-sessions" },
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
          name: "Fixtures",
          icon: <Calendar size={18} />,
          path: "/fixtures"
        },

        {
          name: "Finance",
          icon: <GridIcon />,
          subItems: [
            // { name: "Overview", path: "/finance" },
            { name: "Bank Details", path: "/bank-details" },
            { name: "Invoices", path: "/invoices" },
            { name: "Transactions", path: "/transactions" }
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
          subItems: [
            { name: "Product List", path: "/products" },
            { name: "Add Product", path: "/add-product" },
            { name: "Orders", path: "/orders" }
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
        // {
        //   name: "Gallery",
        //   icon: <GridIcon />,
        //   subItems: [
        //     { name: "View Gallery", path: "/gallery" },
        //     { name: "Add Gallery", path: "/add-gallery" },
        //   ],
        // },
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
              <span className={`menu-item-text ${isExpanded || isHovered || isMobileOpen ? "block" : "hidden"}`}>
                {nav.name}
              </span>
              <ChevronDownIcon
                className={`ml-auto w-4 h-4 transition-transform duration-200 ${isExpanded || isHovered || isMobileOpen ? "block" : "hidden"} ${openSubmenu?.sectionKey === sectionKey &&
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
                <span className={`menu-item-text ${isExpanded || isHovered || isMobileOpen ? "block" : "hidden"}`}>
                  {nav.name}
                </span>
              </Link>
            )
          )}
          {nav.subItems && (
            <div
              className={`overflow-hidden transition-all duration-300 ${isExpanded || isHovered || isMobileOpen ? "block" : "hidden"}`}
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
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item flex items-center justify-between gap-2 ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      <span className="truncate">{subItem.name}</span>
                      {subItem.isEvent && (
                        <span className="px-1 py-px text-[7px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-none shrink-0 select-none">
                          Holiday
                        </span>
                      )}
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
