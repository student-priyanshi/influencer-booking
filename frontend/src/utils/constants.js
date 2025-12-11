export const EVENT_CATEGORIES = [
  { id: 1, name: 'Birthday Party', description: 'Celebrate special birthdays', icon: '🎂' },
  { id: 2, name: 'Engagement', description: 'Memorable engagement events', icon: '💍' },
  { id: 3, name: 'Wedding', description: 'Beautiful wedding celebrations', icon: '👰' },
  { id: 4, name: 'Corporate Event', description: 'Professional corporate gatherings', icon: '💼' },
  { id: 5, name: 'Product Launch', description: 'Exciting product releases', icon: '🚀' },
  { id: 6, name: 'Charity Event', description: 'Meaningful charity functions', icon: '🤝' },
  { id: 7, name: 'Music Concert', description: 'Live music performances', icon: '🎵' },
  { id: 8, name: 'Sports Event', description: 'Athletic competitions', icon: '⚽' }
];

export const INFLUENCER_CATEGORIES = [
  'Lifestyle',
  'Technology',
  'Fashion',
  'Beauty',
  'Fitness',
  'Travel',
  'Food',
  'Gaming',
  'Business',
  'Entertainment'
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const QUERY_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  RESOLVED: 'resolved'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me'
  },
  INFLUENCERS: '/api/influencers',
  EVENTS: '/api/events',
  PACKAGES: '/api/packages',
  BOOKINGS: '/api/bookings',
  QUERIES: '/api/queries'
};