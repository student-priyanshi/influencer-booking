import { LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from "../../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useApp();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Influencers', href: '/influencers' },
    { name: 'Events', href: '/events' },
    { name: 'Packages', href: '/packages' },
    ...(user?.role === 'admin' ? [{ name: 'Admin', href: '/admin' }] : []),
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            InfluenceBook
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 font-medium ${
                  location.pathname === item.href
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-700 hover:text-primary-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <User size={18} />
                  <span>{user.name}</span>
                </div>
                <button onClick={handleLogout}>
                  <LogOut />
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-primary-600 text-white px-6 py-2 rounded-md">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 text-gray-700"
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-600">
                  Logged in as {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
