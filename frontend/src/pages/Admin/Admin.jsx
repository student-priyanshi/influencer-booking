import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

import BookingManager from "./BookingManager";
import Dashboard from "./Dashboard";
import EventManager from "./EventManager";
import InfluencerManager from "./InfluencerManager";
import PackageManager from "./PackageManager";
import QueryManager from "./QueryManager";

import {
  BookOpen,
  Calendar,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package as PackageIcon,
  Users,
} from "lucide-react";

const Admin = () => {
  const { user, logout, loading } = useApp();
  const location = useLocation();

  // WAIT until user data loads
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  // PROTECT ADMIN ROUTE
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Influencers", href: "/admin/influencers", icon: Users },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Packages", href: "/admin/packages", icon: PackageIcon },
    { name: "Bookings", href: "/admin/bookings", icon: BookOpen },
    { name: "Queries", href: "/admin/queries", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white shadow-lg fixed inset-y-0 left-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary-100 text-primary-600 border-r-4 border-primary-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500 mb-4">{user?.email}</p>

            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="ml-64 flex-1">
        <div className="p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="influencers" element={<InfluencerManager />} />
            <Route path="events" element={<EventManager />} />
            <Route path="packages" element={<PackageManager />} />
            <Route path="bookings" element={<BookingManager />} />
            <Route path="queries" element={<QueryManager />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
