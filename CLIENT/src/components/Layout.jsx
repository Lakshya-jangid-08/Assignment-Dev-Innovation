import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { IoMenu } from "react-icons/io5";
import { GiCrossedSabres } from "react-icons/gi";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-lg md:text-xl font-bold text-blue-600">
              Notes & Bookmarks
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <div className="hidden md:flex space-x-4">
                {[{ path: '/notes', label: 'Notes' }, { path: '/bookmarks', label: 'Bookmarks' }].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm md:text-base text-gray-700">{user.name}</span>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-x-2">
                  <Link
                    to="/login"
                    className={` ${location.pathname === '/login' ? 'text-blue-600 px-4 py-2 hover:text-blue-800' : 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md'} text-sm`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={` ${location.pathname === '/signup' ? 'text-blue-600 px-4 py-2 hover:text-blue-800' : 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md'} text-sm`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            {user && 
            (
              <div className='flex gap-2 items-center'>
              <span className="md:hidden  text-sm md:text-base text-gray-700">{user.name}</span>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden flex flex-col space-y-1.5 focus:outline-none text-xl"
                >
                {!menuOpen ? <IoMenu/> : <GiCrossedSabres/>}
                </button>
                </div>
            )}
          </div>

          {/* Mobile Menu */}
          {user && menuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-4 py-3 space-y-2">
                <Link
                  to="/notes"
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/notes'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Notes
                </Link>
                <Link
                  to="/bookmarks"
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/bookmarks'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Bookmarks
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-3 sm:px-4 py-4 md:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;