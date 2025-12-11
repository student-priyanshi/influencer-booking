import { Calendar, DollarSign, Eye, Filter, Search, User } from 'lucide-react';
import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';

const BookingManager = () => {
  const { bookings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.influencer?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.event?.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.package?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesType = !typeFilter || booking.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      influencer: { color: 'bg-purple-100 text-purple-800', label: 'Influencer' },
      event: { color: 'bg-indigo-100 text-indigo-800', label: 'Event' },
      package: { color: 'bg-pink-100 text-pink-800', label: 'Package' }
    };
    
    const config = typeConfig[type] || typeConfig.influencer;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    // Simulate API call to update booking status
    console.log(`Updating booking ${bookingId} to ${newStatus}`);
    alert(`Booking status updated to ${newStatus}`);
  };

  const getBookingItem = (booking) => {
    switch (booking.type) {
      case 'influencer':
        return booking.influencer;
      case 'event':
        return booking.event;
      case 'package':
        return booking.package;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Manage and track all bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="influencer">Influencer</option>
            <option value="event">Event</option>
            <option value="package">Package</option>
          </select>

          <div className="text-sm text-gray-500 flex items-center">
            <Filter size={16} className="mr-2" />
            {filteredBookings.length} bookings found
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
            <p className="text-gray-500">No bookings match your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Booking ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const item = getBookingItem(booking);
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{booking.id.toString().slice(-6)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.user?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item?.name || item?.title || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getTypeBadge(booking.type)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm font-semibold text-gray-900">
                          <DollarSign size={16} className="mr-1" />
                          {booking.totalAmount}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="text-blue-600 hover:text-blue-900 transition duration-200"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirm</option>
                            <option value="cancelled">Cancel</option>
                            <option value="completed">Complete</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Booking Information</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Booking ID</dt>
                    <dd className="text-sm text-gray-900">#{selectedBooking.id.toString().slice(-6)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Type</dt>
                    <dd className="text-sm text-gray-900">{getTypeBadge(selectedBooking.type)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Status</dt>
                    <dd className="text-sm text-gray-900">{getStatusBadge(selectedBooking.status)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Event Date</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(selectedBooking.date).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Name</dt>
                    <dd className="text-sm text-gray-900">{selectedBooking.user?.name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Email</dt>
                    <dd className="text-sm text-gray-900">{selectedBooking.user?.email || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Phone</dt>
                    <dd className="text-sm text-gray-900">{selectedBooking.contactPhone || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Booking Details</h3>
              <div className="mt-2 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {getBookingItem(selectedBooking)?.name || getBookingItem(selectedBooking)?.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedBooking.type.charAt(0).toUpperCase() + selectedBooking.type.slice(1)} Booking
                    </p>
                    {selectedBooking.specialRequests && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Special Requests:</strong> {selectedBooking.specialRequests}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${selectedBooking.totalAmount}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedBooking.guests} guests
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingManager;