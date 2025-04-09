import { Link, useNavigate, useLocation } from "react-router-dom";
import { getPermission } from "src/services/requests/user.service";
import { useState, useEffect } from "react";
import clsx from "clsx"; // optionnel mais pratique

export const Navbar = () => {
  const permission = getPermission();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  useEffect(() => {
    // Ouvre le menu admin automatiquement si on est sur une route admin
    if (location.pathname.startsWith("/admin")) {
      setIsAdminMenuOpen(true);
    } else {
      setIsAdminMenuOpen(false);
    }
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

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-white text-2xl font-semibold">
          <Link to="/Home">UTT Integration</Link>
        </div>

        <div className="flex space-x-6 items-center relative">
          <Link
            to="/Home"
            className={clsx("text-white hover:text-gray-300", {
              "font-bold underline": isActive("/Home"),
            })}
          >
            Home
          </Link>

          <Link
                to="/Parrainnage"
                className={clsx("text-white hover:text-gray-300", {
                  "font-bold underline": isActive("/Parrainnage"),
                })}
              >
                Parrainnage
          </Link>

          <Link
                to="/Challenges"
                className={clsx("text-white hover:text-gray-300", {
                  "font-bold underline": isActive("/Challenges"),
                })}
              >
                Challenges
          </Link>

          {(permission === "Student" || permission === "Admin") && (
            <>
              <Link
                to="/Shotgun"
                className={clsx("text-white hover:text-gray-300", {
                  "font-bold underline": isActive("/Shotgun"),
                })}
              >
                Shotgun
              </Link>
              <Link
                to="/Permanences"
                className={clsx("text-white hover:text-gray-300", {
                  "font-bold underline": isActive("/Permanences"),
                })}
              >
                Permanences
              </Link>
            </>
          )}

          {permission === "Admin" && (
            <div className="relative">
              <button
                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                className="text-white hover:text-gray-300 focus:outline-none"
              >
                Admin Dashboard ▾
              </button>
              {isAdminMenuOpen && (
                <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md py-2 z-50 min-w-[180px]">
                  <Link
                    to="/admin/users"
                    className={clsx("block px-4 py-2 text-gray-800 hover:bg-gray-100", {
                      "font-semibold bg-gray-100": isActive("/admin/users"),
                    })}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/teams"
                    className={clsx("block px-4 py-2 text-gray-800 hover:bg-gray-100", {
                      "font-semibold bg-gray-100": isActive("/admin/teams"),
                    })}
                  >
                    Teams
                  </Link>
                  <Link
                    to="/admin/factions"
                    className={clsx("block px-4 py-2 text-gray-800 hover:bg-gray-100", {
                      "font-semibold bg-gray-100": isActive("/admin/factions"),
                    })}
                  >
                    Faction
                  </Link>
                  <Link
                    to="/admin/shotgun"
                    className={clsx("block px-4 py-2 text-gray-800 hover:bg-gray-100", {
                      "font-semibold bg-gray-100": isActive("/admin/shotgun"),
                    })}
                  >
                    Shotgun
                  </Link>
                  <Link
                    to="/admin/permanences"
                    className={clsx("block px-4 py-2 text-gray-800 hover:bg-gray-100", {
                      "font-semibold bg-gray-100": isActive("/admin/permanences"),
                    })}
                  >
                    Permanences
                  </Link>
                  <Link
                    to="/admin/challenge"
                    className={clsx("block px-4 py-2 text-gray-800 hover:bg-gray-100", {
                      "font-semibold bg-gray-100": isActive("/admin/challenge"),
                    })}
                  >
                    Challenge
                  </Link>
                  <Link
                    to="/admin/export"
                    className={clsx("block px-4 py-2 text-gray-800 hover:bg-gray-100", {
                      "font-semibold bg-gray-100": isActive("/admin/export"),
                    })}
                  >
                    Export
                  </Link>
                  <Link
                    to="/admin/email"
                    className={clsx("block px-4 py-2 text-gray-800 hover:bg-gray-100", {
                      "font-semibold bg-gray-100": isActive("/admin/email"),
                    })}
                  >
                    Email
                  </Link>
                </div>
              )}
            </div>
          )}
          <Link
                to="/Profil"
                className={clsx("text-white hover:text-gray-300", {
                  "font-bold underline": isActive("/Profil"),
                })}
              >
                Mon compte
          </Link>
          <Link
            onClick={handleLogout}
            className="text-white hover:text-gray-300 cursor-pointer"
            to={""}
          >
            Déconnexion
          </Link>
        </div>
      </div>
    </nav>
  );
};
