// src/components/Navbar.tsx
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import { HomeIcon, CogIcon, UsersIcon, Bars4Icon } from "@heroicons/react/24/outline";
import { XMarkIcon, } from "@heroicons/react/24/solid";

import { motion, AnimatePresence } from "framer-motion";
import { getToken, decodeToken } from "../services/requests/auth.service";

interface NavItem {
  label: string;
  to: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  rolesAllowed?: string[]; // ["Admin", "Respo CE", ...]
  public?: boolean;
  showWhen?: "always" | "auth" | "guest";
  kind?: "link" | "action";
  onClick?: () => void;
  children?: NavItem[];     // pour dropdown
}

export const Navbar = () => {
  const { pathname } = useLocation();
  const token = getToken();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = Boolean(token);
  const { userPermission, userRoles = [] } = token ? decodeToken(token) : { userPermission: undefined, userRoles: [] };
  const roles = [userPermission, ...userRoles.map(r => r.roleName)].filter(Boolean) as string[];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navItems: NavItem[] = [
    { label: "Home", to: "/home", icon: HomeIcon },
    { label: "Plannings", to: "/plannings" },
    { label: "Parrainage", to: "/parrainage" },
    { label: "Challenges", to: "/challenges" },
    { label: "Mes Actus", to: "/news" },
    {
      label: "Permanences",
      to: "#",
      children: [
        { label: "Listes des permanences", to: "/permanenceslist", rolesAllowed: ["Admin", "Student"] },
        { label: "Mes permanences", to: "/mypermanences", rolesAllowed: ["Admin", "Student"] },
        { label: "Faire l'appel", to: "/permanencesappeal", rolesAllowed: ["Admin", "Student"] },
      ],
    },
    {
      label: "Events",
      to: "#",
      children: [
        { label: "Shotgun", to: "/shotgun", rolesAllowed: ["Admin", "Student"] },
        { label: "WEI", to: "/wei" },
        { label: "SDI", to: "/sdi" },
        { label: "Repas", to: "/food" },
        { label: "Defis Commissions", to: "/games", rolesAllowed: ["Admin", "Student"] },
      ],
    },
    { label: "Mon compte", to: "/profil", icon: UsersIcon },
    {
      label: "Admin",
      to: "#",
      icon: CogIcon,
      children: [
        { label: "Bus", to: "/admin/bus", rolesAllowed: ["Admin"] },
        { label: "Challenge", to: "/admin/challenge", rolesAllowed: ["Admin", "Arbitre"] },
        { label: "Email", to: "/admin/email", rolesAllowed: ["Admin"] },
        { label: "Events", to: "/admin/events", rolesAllowed: ["Admin"] },
        { label: "Export / Import", to: "/admin/export-import", rolesAllowed: ["Admin"] },
        { label: "Factions", to: "/admin/factions", rolesAllowed: ["Admin", "Respo CE"] },
        { label: "Games", to: "/admin/games", rolesAllowed: ["Admin"] },
        { label: "News", to: "/admin/news", rolesAllowed: ["Admin", "Communication"] },
        { label: "Permanences", to: "/admin/permanences", rolesAllowed: ["Admin", "Respo CE"] },
        { label: "Roles", to: "/admin/roles", rolesAllowed: ["Admin"] },
        { label: "Shotgun", to: "/admin/shotgun", rolesAllowed: ["Admin", "Respo CE"] },
        { label: "Teams", to: "/admin/teams", rolesAllowed: ["Admin", "Respo CE"] },
        { label: "Tentes", to: "/admin/tent", rolesAllowed: ["Admin"] },
        { label: "Users", to: "/admin/users", rolesAllowed: ["Admin"] },
      ],
    },
    {
      label: "Déconnexion",
      to: "/",
      kind: "action",
      showWhen: "auth",
      onClick: handleLogout,
    },
    {
      label: "Se connecter",
      to: "/",
      public: true,
      showWhen: "guest",
    },

  ];


  const canShowItem = (item: NavItem): boolean => {
    if (item.showWhen === "auth") return isAuthenticated;
    if (item.showWhen === "guest") return !isAuthenticated;

    if (!isAuthenticated) {
      if (item.public) return true;

      if (item.children && item.children.length > 0) {
        return item.children.some(child => canShowItem(child));
      }

      return false;
    }

    if (item.rolesAllowed) {
      return item.rolesAllowed.some(r => roles.includes(r));
    }

    if (item.children && item.children.length > 0) {
      return item.children.some(child => canShowItem(child));
    }

    return true;
  };

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink to="/home" className="text-2xl font-bold">
          UTT Integration
        </NavLink>

        {/* Hamburger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars4Icon className="w-6 h-6" />
          )}
        </button>

        {/* Menu desktop */}
        <ul className="hidden lg:flex items-center space-x-6">
          {navItems.map(item =>
            canShowItem(item) ? (
              <li key={item.label} className="relative group">
                {item.children ? (
                  <Dropdown item={item} canShowItem={canShowItem} />
                ) : item.kind === "action" ? (
                  <NavActionItem item={item} />
                ) : (
                  <MenuItem item={item} active={pathname === item.to} />
                )}
              </li>
            ) : null
          )}
        </ul>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="lg:hidden bg-blue-700 overflow-hidden"
          >
            {navItems.map(item =>
              canShowItem(item) ? (
                <Fragment key={item.label}>
                  {!item.children ? (
                    item.kind === "action" ? (
                      <NavActionItem item={item} mobile />
                    ) : (
                      <MenuItem item={item} mobile />
                    )
                  ) : (
                    <Dropdown item={item} mobile canShowItem={canShowItem} />
                  )}
                </Fragment>
              ) : null
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavActionItem = ({
  item,
  mobile = false,
}: {
  item: NavItem;
  mobile?: boolean;
}) => {
  const base = mobile ? "block py-2 px-4 text-left w-full" : "inline-flex items-center py-2";

  return (
    <button
      type="button"
      onClick={item.onClick}
      className={`${base} hover:text-yellow-200 transition`}
    >
      {item.icon && (
        <item.icon className="w-5 h-5 mr-1 inline-block" />
      )}
      {item.label}
    </button>
  );
};

// Composant MenuItem
const MenuItem = ({
  item,
  active = false,
  mobile = false,
}: {
  item: NavItem;
  active?: boolean;
  mobile?: boolean;
}) => {
  const base = mobile ? "block py-2 px-4" : "inline-flex items-center py-2";
  const activeClass = active
    ? "text-yellow-300 font-semibold border-b-2 border-yellow-300"
    : "hover:text-yellow-200";
  return (
    <NavLink
      to={item.to}
      className={`${base} ${activeClass} transition`}
    >
      {item.icon && (
        <item.icon className="w-5 h-5 mr-1 inline-block" />
      )}
      {item.label}
    </NavLink>
  );
};

// Composant Dropdown (desktop & mobile)
const Dropdown = ({
  item,
  mobile = false,
  canShowItem,
}: {
  item: NavItem;
  mobile?: boolean;
  canShowItem: (item: NavItem) => boolean;
}) => {
  const [open, setOpen] = useState(false);
  const trigger = mobile ? "p-4" : "py-2 cursor-pointer";

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className={`${trigger} flex items-center justify-between`}
        aria-expanded={open}
        aria-controls={`submenu-${item.label}`}
      >
        {item.icon && <item.icon className="w-5 h-5 mr-1" />}
        {item.label} <span className="ml-1">▾</span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={`submenu-${item.label}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute bg-white text-black rounded shadow-md z-50 ${mobile ? "static mt-2" : "top-full left-0 mt-1"
              }`}
            role="menu"
          >
            {item.children!
              .filter(child => canShowItem(child))
              .map(child => (
                <li key={child.to}>
                  <NavLink
                    to={child.to}
                    className="block px-4 py-2 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {child.label}
                  </NavLink>
                </li>
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
