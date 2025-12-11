import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { bookingService } from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';

const BookingForm = ({ type, item, onClose, onSuccess }) => {
  const { user } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    guests: 1,
    specialRequests: '',
    contactName: user?.name || '',
    contactEmail: user?.email || '',
    contactPhone: user?.phone || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        type,
        date: formData.date,
        guests: parseInt(formData.guents),
        specialRequests: formData.specialRequests,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        totalAmount: calculateTotal(),
        ...getItemReference()
      };

      await bookingService.create(bookingData);
      onSuccess('Booking request submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getItemReference = () => {
    switch (type) {
      case 'influencer':
        return { influencer: item.id };
      case 'event':
        return { event: item.id };
      case 'package':
        return { package: item.id };
      default:
        return {};
    }
  };

  const calculateTotal = () => {
    const basePrice = item.price || 0;
    return basePrice * formData.guests;
  };

  const getItemType = () => {
    switch (type) {
      case 'influencer':
        return 'Influencer';
      case 'event':
        return 'Event';
      case 'package':
        return 'Package';
      default:
        return 'Item';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <h3 className="text-xl font-semibold mb-4">
        Book {getItemType()}: {item.name}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email *
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests *
            </label>
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
              max="1000"
              required
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Any special requirements or notes for your event..."
            />
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Price Summary</h4>
          <div className="flex justify-between text-sm">
            <span>Base Price:</span>
            <span>${item.price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Guests:</span>
            <span>{formData.guests}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2 mt-2">
            <span>Total Amount:</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            Submit Booking
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookingForm;