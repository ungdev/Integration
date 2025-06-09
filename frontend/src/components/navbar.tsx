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
        "relative px-3 py-2 text-sm text-white hover:text-gray-200 transition-all duration-150",
        isActive(to) &&
          "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-[2px] after:bg-white after:rounded"
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
        <Link to="/Home" className="text-xl font-semibold whitespace-nowrap text-white">
          UTT <span className="font-normal">Integration</span>
        </Link>

        {/* Hamburger */}
        <button
          className="lg:hidden focus:outline-none"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-x-4 relative">
          <MenuItem to="/Home" label="Home" />
          <MenuItem to="/Parrainnage" label="Parrainnage" />
          <MenuItem to="/Challenges" label="Challenges" />
          <MenuItem to="/News" label="Mes Actus" />
          {(permission === "Student" || permission === "Admin") && (
            <MenuItem to="/Permanences" label="Permanences" />
          )}

          {/* Events Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsEventsOpen((prev) => !prev)}
              className="px-3 py-2 text-sm hover:text-gray-200"
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
                  className="absolute top-full mt-2 bg-white text-black rounded shadow-md min-w-[160px] z-50"
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
                className="px-3 py-2 text-sm hover:text-gray-200"
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
                      ["News", "/admin/news"],
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
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-sm hover:text-gray-200 transition-all duration-150"
          >
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
              <MenuItem to="/News" label="Mes Actus" />
              {(permission === "Student" || permission === "Admin") && (
                <MenuItem to="/Permanences" label="Permanences" />
              )}
              <MenuItem to="/Shotgun" label="Shotgun" />
              <MenuItem to="/Wei" label="WEI" />
              {permission === "Admin" && (
                <>
                  <span className="mt-2 font-semibold text-white">Admin</span>
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
                    ["News", "/admin/news"],
                  ].map(([label, path]) => (
                    <MenuItem key={path} to={path} label={label} />
                  ))}
                </>
              )}
              <MenuItem to="/Profil" label="Mon compte" />
              <button onClick={handleLogout} className="text-left text-sm text-white hover:text-gray-200">
                Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
