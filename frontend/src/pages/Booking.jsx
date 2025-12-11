import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Check, Clock, MapPin, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookingForm from '../components/forms/BookingForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useApp } from '../context/AppContext';
import { eventService, influencerService, packageService } from '../services/api';

const Booking = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    loadItem();
  }, [type, id]);

  const loadItem = async () => {
    try {
      let data;
      switch (type) {
        case 'influencer':
          data = await influencerService.getById(id);
          break;
        case 'event':
          data = await eventService.getById(id);
          break;
        case 'package':
          data = await packageService.getById(id);
          break;
        default:
          throw new Error('Invalid booking type');
      }
      setItem(data);
    } catch (error) {
      console.error('Error loading item:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = (message) => {
    alert(message);
    setShowBookingForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Item not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-8 transition duration-300"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Item Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={item.image} 
                alt={item.name || item.title}
                className="w-full h-96 object-cover"
              />
              
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">
                  {item.name || item.title}
                </h1>

                {item.rating && (
                  <div className="flex items-center mb-4">
                    <Star className="text-yellow-400" size={20} fill="currentColor" />
                    <span className="ml-2 text-gray-700 font-semibold">{item.rating}</span>
                  </div>
                )}

                {item.expertise && (
                  <p className="text-xl text-gray-600 mb-4">{item.expertise}</p>
                )}

                {item.bio && (
                  <p className="text-gray-600 mb-6">{item.bio}</p>
                )}

                {item.description && (
                  <p className="text-gray-600 mb-6">{item.description}</p>
                )}

                {/* Event Specific Details */}
                {type === 'event' && (
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={20} className="mr-3" />
                      <span>{new Date(item.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={20} className="mr-3" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock size={20} className="mr-3" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                )}

                {/* Package Specific Details */}
                {type === 'package' && item.inclusions && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Package Includes:</h3>
                    <div className="space-y-2">
                      {item.inclusions.map((inclusion, index) => (
                        <div key={index} className="flex items-center">
                          <Check size={18} className="text-green-500 mr-3" />
                          <span className="text-gray-600">{inclusion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="text-3xl font-bold text-primary-600 mb-6">
                  ${item.price}
                  {type === 'event' && <span className="text-lg text-gray-500"> per ticket</span>}
                  {type === 'package' && <span className="text-lg text-gray-500"> package</span>}
                  {type === 'influencer' && <span className="text-lg text-gray-500"> per event</span>}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login', { state: { from: location } });
                      return;
                    }
                    setShowBookingForm(true);
                  }}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 text-lg"
                >
                  {user ? 'Book Now' : 'Login to Book'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Booking Form Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-8 lg:h-fit"
          >
            {showBookingForm ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <BookingForm
                  type={type}
                  item={item}
                  onClose={() => setShowBookingForm(false)}
                  onSuccess={handleBookingSuccess}
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Why Book With Us?</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded-lg mr-4">
                      <Check size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Secure Booking</h3>
                      <p className="text-gray-600 text-sm">Your booking is safe and secure with our platform</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded-lg mr-4">
                      <Check size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">24/7 Support</h3>
                      <p className="text-gray-600 text-sm">Our team is here to help you anytime</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded-lg mr-4">
                      <Check size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Best Prices</h3>
                      <p className="text-gray-600 text-sm">Competitive pricing with no hidden fees</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded-lg mr-4">
                      <Check size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Quality Guarantee</h3>
                      <p className="text-gray-600 text-sm">We ensure top-quality influencers and experiences</p>
                    </div>
                  </div>
                </div>

                {!user && (
                  <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 text-sm">
                      Please login to book this {type}. You'll need an account to proceed with the booking.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Booking;