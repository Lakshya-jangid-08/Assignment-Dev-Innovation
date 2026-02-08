import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/notes', label: 'Notes' },
    { path: '/bookmarks', label: 'Bookmarks' },
  ];

  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Notes & Bookmarks
              </Link>
              
              {user && (
                <div className="hidden md:flex space-x-4">
                  {navItems.map((item) => (
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
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className={` ${isLogin ? 'text-blue-600 px-4 py-2 hover:text-blue-800' : 'bg-blue-600 hover:bg-blue-700 text-white  px-4 py-2 rounded-md'} `}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={` ${!isLogin ? 'text-blue-600 px-4 py-2 hover:text-blue-800' : 'bg-blue-600 hover:bg-blue-700 text-white  px-4 py-2 rounded-md'} `}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;