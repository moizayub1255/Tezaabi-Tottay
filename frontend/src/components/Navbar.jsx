import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  Menu,
  Search,
  ChevronDown,
  User,
  Bell,
  Settings,
  CreditCard,
} from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { setContentType } = useContentStore();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const navItems = [
    { name: "Home", path: "/", action: () => setContentType("movie") },
    { name: "Movies", path: "/", action: () => setContentType("movie") },
    { name: "TV Shows", path: "/", action: () => setContentType("tv") },
    { name: "New & Popular", path: "/popular" },
    { name: "My List", path: "/my-list" },
    { name: "History", path: "/history" },
    { name: "Subscription", path: "/subscription" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-black to-transparent transition-all duration-300">
      {/* Background blur effect when scrolled */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300" />

      <div className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/" className="relative z-10 text-2xl font-extrabold">
            <span className="text-red-600">TezabiTottay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => {
                  if (item.action) item.action();
                }}
                className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Search Icon */}
          <Link
            to="/search"
            className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 group"
          >
            <Search className="size-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-transform duration-200" />
          </Link>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-white/10 rounded-full transition-all duration-200 group hidden sm:block">
            <Bell className="size-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-transform duration-200" />
            <span className="absolute -top-1 -right-1 size-2.5 bg-red-600 rounded-full border-2 border-black" />
          </button>

          {/* Profile or Auth Buttons */}
          <div className="relative">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-red-600 text-white py-1 px-3 rounded"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                >
                  <div className="relative">
                    <img
                      src={user.image}
                      alt="Avatar"
                      className="h-8 w-8 rounded border-2 border-transparent group-hover:border-red-600 transition-all duration-300 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 rounded" />
                  </div>
                  <ChevronDown
                    className={`size-4 text-gray-300 group-hover:text-white transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-md rounded-lg border border-gray-800 shadow-xl py-2 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.image}
                          alt="Avatar"
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        <User className="size-4" />
                        Manage Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        <Settings className="size-4" />
                        Account Settings
                      </Link>
                      <Link
                        to="/subscription"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        <CreditCard className="size-4" />
                        Manage Subscription
                      </Link>
                    </div>

                    <div className="border-t border-gray-800 pt-2">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/10 text-red-500 hover:text-red-400 transition-colors duration-200"
                      >
                        <LogOut className="size-4" />
                        Sign Out of Tezaabi Tottay
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <Menu
              className={`size-6 text-gray-300 ${isMobileMenuOpen ? "text-red-600" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 animate-slideDown">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid gap-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => {
                    if (item.action) item.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-lg text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center gap-3 group"
                >
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-gray-800 mt-2 pt-4">
                {!user ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-lg text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-lg bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all duration-200"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-lg text-red-500 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="size-5" />
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Settings icon import */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

// Add missing icon component
// const Settings = ({ className }: { className?: string }) => (
// 	<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// 		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
// 		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// 	</svg>
// );

// const CreditCard = ({ className }: { className?: string }) => (
// 	<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// 		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
// 	</svg>
// );

export default Navbar;
