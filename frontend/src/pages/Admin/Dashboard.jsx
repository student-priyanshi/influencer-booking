// src/pages/admin/Dashboard.jsx
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  DollarSign,
  MessageSquare,
  Package,
  TrendingUp,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Dashboard = () => {
  const { influencers, events, packages, bookings, queries, user } = useApp();

  // Calculate stats
  const stats = [
    { 
      title: 'Total Influencers', 
      value: influencers.length, 
      icon: Users, 
      bg: 'bg-blue-100', 
      text: 'text-blue-600', 
      change: '+12%',
      link: '/admin/influencers'
    },
    { 
      title: 'Active Events', 
      value: events.length, 
      icon: Calendar, 
      bg: 'bg-green-100', 
      text: 'text-green-600', 
      change: '+8%',
      link: '/admin/events'
    },
    { 
      title: 'Packages', 
      value: packages.length, 
      icon: Package, 
      bg: 'bg-purple-100', 
      text: 'text-purple-600', 
      change: '+15%',
      link: '/admin/packages'
    },
    { 
      title: 'Total Bookings', 
      value: bookings.length, 
      icon: BookOpen, 
      bg: 'bg-orange-100', 
      text: 'text-orange-600', 
      change: '+23%',
      link: '/admin/bookings'
    },
    { 
      title: 'Pending Queries', 
      value: queries.filter(q => q.status === 'new').length, 
      icon: MessageSquare, 
      bg: 'bg-red-100', 
      text: 'text-red-600', 
      change: '-5%',
      link: '/admin/queries'
    },
    { 
      title: 'Revenue', 
      value: `$${bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0).toLocaleString()}`,
      icon: DollarSign, 
      bg: 'bg-emerald-100', 
      text: 'text-emerald-600', 
      change: '+18%',
      link: '/admin/bookings'
    },
  ];

  // Recent bookings
  const recentBookings = bookings.slice(0, 5);

  // Recent queries
  const recentQueries = queries.filter(q => q.status === 'new').slice(0, 5);

  // Upcoming events
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .slice(0, 5);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
      new: { color: 'bg-blue-100 text-blue-800', label: 'New' },
      contacted: { color: 'bg-purple-100 text-purple-800', label: 'Contacted' },
      resolved: { color: 'bg-gray-100 text-gray-800', label: 'Resolved' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getBookingType = (booking) => {
    if (booking.influencer) return 'Influencer';
    if (booking.event) return 'Event';
    if (booking.package) return 'Package';
    return 'Unknown';
  };

  const getBookingName = (booking) => {
    if (booking.influencer) return booking.influencer.name;
    if (booking.event) return booking.event.title;
    if (booking.package) return booking.package.name;
    return 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <motion.h1 
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Admin Dashboard
        </motion.h1>
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Welcome back, {user?.name}. Here's what's happening with your platform.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link to={stat.link} className="block">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h2>
                    <p className="text-sm text-green-600 flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon className={stat.text} size={24} />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <Link 
              to="/admin/bookings" 
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-gray-500">No recent bookings</p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <BookOpen size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{getBookingName(booking)}</h4>
                      <p className="text-sm text-gray-500">{getBookingType(booking)} • {new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(booking.status)}
                    <p className="text-sm font-semibold text-gray-900 mt-1">${booking.totalAmount}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Queries & Upcoming Events */}
        <div className="space-y-6">
          {/* Recent Queries */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-sm border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">New Queries</h2>
              <Link 
                to="/admin/queries" 
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentQueries.length === 0 ? (
                <div className="text-center py-4">
                  <MessageSquare className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-500">No new queries</p>
                </div>
              ) : (
                recentQueries.map((query) => (
                  <div key={query._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition duration-200">
                    <div>
                      <h4 className="font-medium text-gray-900">{query.name}</h4>
                      <p className="text-sm text-gray-500">{query.eventType} • {new Date(query.eventDate).toLocaleDateString()}</p>
                    </div>
                    {getStatusBadge(query.status)}
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-sm border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
              <Link 
                to="/admin/events" 
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-4">
                  <Calendar className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-500">No upcoming events</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition duration-200">
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()} • {event.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">${event.price}</span>
                      <p className="text-xs text-gray-500">{event.booked || 0}/{event.capacity} booked</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-sm border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/influencers/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition duration-300 group"
          >
            <Users className="mx-auto text-gray-400 group-hover:text-purple-600 mb-2" size={24} />
            <p className="font-medium text-gray-700 group-hover:text-purple-600">Add Influencer</p>
          </Link>
          
          <Link
            to="/admin/events/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition duration-300 group"
          >
            <Calendar className="mx-auto text-gray-400 group-hover:text-purple-600 mb-2" size={24} />
            <p className="font-medium text-gray-700 group-hover:text-purple-600">Create Event</p>
          </Link>
          
          <Link
            to="/admin/packages/new"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition duration-300 group"
          >
            <Package className="mx-auto text-gray-400 group-hover:text-purple-600 mb-2" size={24} />
            <p className="font-medium text-gray-700 group-hover:text-purple-600">Add Package</p>
          </Link>
          
          <Link
            to="/admin/queries"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition duration-300 group"
          >
            <MessageSquare className="mx-auto text-gray-400 group-hover:text-purple-600 mb-2" size={24} />
            <p className="font-medium text-gray-700 group-hover:text-purple-600">Manage Queries</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;