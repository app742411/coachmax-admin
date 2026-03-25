import React, { useCallback, useEffect, useRef, useState, ReactNode } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  ChevronDownIcon,
  HorizontaLDots,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  Newspaper,
  Image,
  ShoppingBag,
  Package,
  CreditCard,
  MessageSquare,
  Settings,
  Dumbbell
} from "lucide-react";

interface SubItem {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
}

interface NavItem {
  name: string;
  icon: ReactNode;
  path?: string;
  subItems?: SubItem[];
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/",
  },
  {
    name: "Players Management",
    icon: <Users size={20} />,
    subItems: [
      { name: "Players list", path: "/players" },
      // { name: "New Players Enquiry", path: "/pending-players" },
    ],
  },
  {
    name: "Events & Training",
    icon: <Calendar size={20} />,
    subItems: [
      { name: "Events", path: "/events" },
      { name: "Add Event", path: "/add-event" },
      { name: "Training Sessions", path: "/training-sessions" },
    ],
  },
  {
    name: "Training Tracker",
    icon: <Dumbbell size={20} />,
    subItems: [
      { name: "Attendance", path: "/attendance" },
      { name: "Performance", path: "/performance" },
    ],
  },
  {
    name: "League Management",
    icon: <Trophy size={20} />,
    subItems: [
      { name: "Matches", path: "/matches" },
      { name: "Schedule", path: "/schedule" },
    ],
  },
  {
    name: "Content Management",
    icon: <Newspaper size={20} />,
    subItems: [
      { name: "News & Updates", path: "/news" },
      { name: "Add News", path: "/add-news" },
      { name: "Blogs", path: "/blogs" },
      { name: "Add Blog", path: "/add-blog" },
      { name: "Sponsors", path: "/sponsors" },
    ],
  },
  {
    name: "Media",
    icon: <Image size={20} />,
    subItems: [
      { name: "View Gallery", path: "/gallery" },
      { name: "Add Gallery", path: "/add-gallery" },
    ],
  },
  {
    name: "Store",
    icon: <ShoppingBag size={20} />,
    subItems: [
      { name: "Products List", path: "/products" },
      { name: "Add Products", path: "/add-product" },
    ],
  },
  {
    name: "Orders",
    icon: <Package size={20} />,
    subItems: [
      { name: "Orders List", path: "/orders" },
    ],
  },
  {
    name: "Payments",
    icon: <CreditCard size={20} />,
    subItems: [
      { name: "Transactions", path: "/transactions" },
    ],
  },
  {
    name: "Communication",
    icon: <MessageSquare size={20} />,
    subItems: [
      { name: "Messages", path: "/messages" },
      { name: "Chat History", path: "/chat-history" },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    name: "Settings",
    icon: <Settings size={20} />,
    subItems: [
      { name: "Profile", path: "/profile" },
      { name: "My Account", path: "/account" },
      { name: "Change Password", path: "/change-password" },
      { name: "Language", path: "/language" },
      { name: "Notifications", path: "/notifications" },
    ],
  },
];

interface OpenSubmenu {
  type: string;
  index: number;
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string | undefined): boolean => !!path && location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;

    const checkItems = (items: NavItem[], menuType: string) => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType, index });
              submenuMatched = true;
            }
          });
        }
      });
    };

    checkItems(navItems, "main");
    checkItems(othersItems, "others");

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location.pathname, isActive]);

  useEffect(() => {
    if (!openSubmenu) return;
    const key = `${openSubmenu.type}-${openSubmenu.index}`;
    const el = subMenuRefs.current[key];
    setSubMenuHeight((prevHeights) => ({
      ...prevHeights,
      [key]: el ? el.scrollHeight : 0,
    }));
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: string) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={`${menuType}-${index}`} className="relative">
          {nav.subItems ? (
            <>
              <button
                type="button"
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
              >
                <span
                  className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
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
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                      }`}
                  />
                )}
              </button>

              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`] || 0}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
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
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                                  } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                                  } menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
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
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
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
      <div
        className={`pt-8 pb-2 flex justify-center ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/cm-logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/cm-logo2.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/cm-logo2.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
