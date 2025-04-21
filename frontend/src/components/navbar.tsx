import { Link, useLocation, useNavigate } from "react-router-dom";
import { getPermission } from "../services/requests/user.service";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const permission = getPermission();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);

  useEffect(() => {
    // Fermeture automatique des menus quand on change de page
    setMobileMenuOpen(false);
    setIsAdminOpen(false);
    setIsEventsOpen(false);
  }, [location]);

  if (!permission) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  const isActive = (path: string) => location.pathname === path;

  const MenuItem = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to}
      className={clsx(
        "text-white hover:text-gray-300 px-2 py-1",
        isActive(to) && "font-bold underline"
      )}
    >
      {label}
    </Link>
  );

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/Home" className="text-2xl font-semibold">
          UTT Integration
        </Link>

        {/* Hamburger */}
        <button
          className="lg:hidden focus:outline-none"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6 relative">
          <MenuItem to="/Home" label="Home" />
          <MenuItem to="/Parrainnage" label="Parrainnage" />
          <MenuItem to="/Challenges" label="Challenges" />
          {(permission === "Student" || permission === "Admin") && (
            <MenuItem to="/Permanences" label="Permanences" />
          )}

          {/* Events Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsEventsOpen((prev) => !prev)}
              className="hover:text-gray-300"
            >
              Events ▾
            </button>
            <AnimatePresence>
              {isEventsOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                  className="absolute top-full mt-2 bg-white text-black rounded shadow-md min-w-[180px] z-50"
                >
                  {(permission === "Student" || permission === "Admin") && (
                    <Link to="/Shotgun" className="block px-4 py-2 hover:bg-gray-100">
                      Shotgun
                    </Link>
                  )}
                  <Link to="/Wei" className="block px-4 py-2 hover:bg-gray-100">
                    WEI
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Admin Dropdown */}
          {permission === "Admin" && (
            <div className="relative">
              <button
                onClick={() => setIsAdminOpen((prev) => !prev)}
                className="hover:text-gray-300"
              >
                Admin ▾
              </button>
              <AnimatePresence>
                {isAdminOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="absolute top-full mt-2 bg-white text-black rounded shadow-md min-w-[200px] z-50"
                  >
                    {[
                      ["Users", "/admin/users"],
                      ["Roles", "/admin/roles"],
                      ["Teams", "/admin/teams"],
                      ["Factions", "/admin/factions"],
                      ["Shotgun", "/admin/shotgun"],
                      ["Permanences", "/admin/permanences"],
                      ["Challenge", "/admin/challenge"],
                      ["Export / Import", "/admin/export-import"],
                      ["Email", "/admin/email"],
                    ].map(([label, path]) => (
                      <Link
                        key={path}
                        to={path}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <MenuItem to="/Profil" label="Mon compte" />
          <button onClick={handleLogout} className="hover:text-gray-300">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="lg:hidden bg-blue-700 overflow-hidden"
          >
            <div className="flex flex-col space-y-2 p-4">
              <MenuItem to="/Home" label="Home" />
              <MenuItem to="/Parrainnage" label="Parrainnage" />
              <MenuItem to="/Challenges" label="Challenges" />
              {(permission === "Student" || permission === "Admin") && (
                <MenuItem to="/Permanences" label="Permanences" />
              )}
              <MenuItem to="/Shotgun" label="Shotgun" />
              <MenuItem to="/Wei" label="WEI" />
              {permission === "Admin" && (
                <>
                  <span className="mt-2 font-bold">Admin</span>
                  <MenuItem to="/admin/users" label="Users" />
                  <MenuItem to="/admin/roles" label="Roles" />
                  <MenuItem to="/admin/teams" label="Teams" />
                  <MenuItem to="/admin/factions" label="Factions" />
                  <MenuItem to="/admin/shotgun" label="Shotgun" />
                  <MenuItem to="/admin/permanences" label="Permanences" />
                  <MenuItem to="/admin/challenge" label="Challenge" />
                  <MenuItem to="/admin/export-import" label="Export / Import" />
                  <MenuItem to="/admin/email" label="Email" />
                </>
              )}
              <MenuItem to="/Profil" label="Mon compte" />
              <button onClick={handleLogout} className="text-left hover:text-gray-300">
                Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
