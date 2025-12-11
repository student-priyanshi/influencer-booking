import { motion } from 'framer-motion';
import { Check, Clock, Package, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useApp } from '../context/AppContext';

const Packages = () => {
  const { packages, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const categories = [...new Set(packages.map(pkg => pkg.category))];

  const filteredPackages = packages
    .filter(pkg => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || pkg.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'duration':
          return a.duration.localeCompare(b.duration);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Event Packages
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          All-inclusive packages for your perfect event experience
        </motion.p>

        {/* Filters and Search */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </motion.div>

        {/* Packages Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-primary-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold group-hover:text-primary-600 transition duration-300">
                    {pkg.name}
                  </h3>
                  <div className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {pkg.category}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${pkg.price}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock size={18} className="mr-2" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {pkg.description}
                </p>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900">What's Included:</h4>
                  {pkg.inclusions?.map((inclusion, idx) => (
                    <div key={idx} className="flex items-center">
                      <Check size={18} className="text-green-500 mr-3" />
                      <span className="text-gray-600">{inclusion}</span>
                    </div>
                  ))}
                </div>

                {pkg.influencer && (
                  <div className="flex items-center mb-6 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={pkg.influencer.image} 
                      alt={pkg.influencer.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <div className="font-semibold">{pkg.influencer.name}</div>
                      <div className="text-sm text-gray-600">{pkg.influencer.expertise}</div>
                    </div>
                  </div>
                )}

                <Link 
                  to={`/booking/package/${pkg.id}`}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 inline-block text-center group-hover:shadow-lg"
                >
                  Book Package
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredPackages.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No packages found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Packages;