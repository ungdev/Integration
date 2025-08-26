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
  children?: NavItem[];     // pour dropdown
}

export const Navbar = () => {
  const { pathname } = useLocation();
  const token = getToken();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!token) return null;
  const { userPermission, userRoles = [] } = decodeToken(token);
  const roles = [userPermission, ...userRoles.map(r => r.roleName)];

  const navItems: NavItem[] = [
  { label: "Home",        to: "/Home",                      icon: HomeIcon },
  { label: "Plannings",   to: "/Plannings" },
  { label: "Parrainage",  to: "/Parrainage" },
  { label: "Challenges",  to: "/Challenges" },
  { label: "Mes Actus",   to: "/News" },
  {
    label: "Permanences",
    to: "#",
    children: [
      { label: "Listes des permanences", to: "/PermanencesList", rolesAllowed: ["Admin", "Student"] },
      { label: "Mes permanences", to: "/MyPermanences", rolesAllowed: ["Admin", "Student"] },
      { label: "Faire l'appel", to: "/PermanencesAppeal", rolesAllowed: ["Admin", "Student"] },
    ],
  },
  {
    label: "Events",
    to: "#",
    children: [
      { label: "Shotgun", to: "/Shotgun", rolesAllowed: ["Admin", "Student"] },
      { label: "WEI",     to: "/Wei" },
      { label: "SDI",     to: "/SDI" },
      { label: "Repas",   to: "/Food" },
      { label: "Defis Commissions", to: "/Games", rolesAllowed: ["Admin", "Student"] },
    ],
  },
  { label: "Mon compte", to: "/Profil", icon: UsersIcon },
  {
    label: "Admin",
    to: "#",
    icon: CogIcon,
    children: [
      { label: "Users",         to: "/admin/users",        rolesAllowed: ["Admin"] },
      { label: "Roles",         to: "/admin/roles",        rolesAllowed: ["Admin"] },
      { label: "Teams",         to: "/admin/teams",        rolesAllowed: ["Admin", "Respo CE"] },
      { label: "Factions",      to: "/admin/factions",     rolesAllowed: ["Admin", "Respo CE"] },
      { label: "Events",        to: "/admin/events",       rolesAllowed: ["Admin"] },
      { label: "Permanences",   to: "/admin/permanences",  rolesAllowed: ["Admin"] },
      { label: "Challenge",     to: "/admin/challenge",    rolesAllowed: ["Admin", "Arbitre"] },
      { label: "Export / Import", to: "/admin/export-import", rolesAllowed: ["Admin"] },
      { label: "Email",         to: "/admin/email",        rolesAllowed: ["Admin"] },
      { label: "News",          to: "/admin/news",         rolesAllowed: ["Admin", "Communication"] },
      { label: "Tentes",         to: "/admin/tent",        rolesAllowed: ["Admin"] },
      { label: "Games",         to: "/admin/games",        rolesAllowed: ["Admin"] },
    ],
  },
  
];


  // helper d’autorisation
  const isAllowed = (item: NavItem): boolean => {
  // Si l'item a une restriction directe
  if (item.rolesAllowed) {
    return item.rolesAllowed.some(r => roles.includes(r));
  }

  // Si l'item a des enfants, on vérifie au moins un enfant
  if (item.children && item.children.length > 0) {
    return item.children.some(child => isAllowed(child));
  }

  // Sinon accessible par défaut
  return true;
};

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink to="/Home" className="text-2xl font-bold">
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
            isAllowed(item) ? (
              <li key={item.label} className="relative group">
                {item.children ? (
                  <Dropdown item={item} />
                ) : (
                  <MenuItem item={item} active={pathname === item.to} />
                )}
              </li>
            ) : null
          )}
          <li>
            <button
              onClick={handleLogout}
              className="text-sm hover:text-gray-200 transition"
            >
              Déconnexion
            </button>
          </li>
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
              isAllowed(item) ? (
                <Fragment key={item.label}>
                  {!item.children ? (
                    <MenuItem item={item} mobile />
                  ) : (
                    <Dropdown item={item} mobile />
                  )}
                </Fragment>
              ) : null
            )}
            <li className="p-4">
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm hover:text-gray-200"
              >
                Déconnexion
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
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
// Composant Dropdown (desktop & mobile)
const Dropdown = ({
  item,
  mobile = false,
}: {
  item: NavItem;
  mobile?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const trigger = mobile ? "p-4" : "py-2 cursor-pointer";

  // helper pour roles
  const token = getToken();
  const { userPermission, userRoles = [] } = token ? decodeToken(token) : {};
  const roles = [userPermission, ...(userRoles?.map((r: any) => r.roleName) || [])];

  const isAllowed = (child: NavItem) =>
    !child.rolesAllowed || child.rolesAllowed.some(r => roles.includes(r));

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
            className={`absolute bg-white text-black rounded shadow-md z-50 ${
              mobile ? "static mt-2" : "top-full left-0 mt-1"
            }`}
            role="menu"
          >
            {item.children!
              .filter(child => isAllowed(child))   // ✅ filtre selon les rôles
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
