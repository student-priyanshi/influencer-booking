import { motion } from "framer-motion";
import { Search, Star, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useApp } from "../context/AppContext";

const Influencers = () => {
  const { influencers, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // categories from influencers (unique)
  const categories = useMemo(
    () => [...new Set(influencers.map((inf) => inf.category).filter(Boolean))],
    [influencers]
  );

  const filteredInfluencers = useMemo(() => {
    return influencers
      .filter((influencer) => {
        const matchesSearch =
          influencer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          influencer.expertise?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || influencer.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-high":
            return b.price - a.price;
          case "price-low":
            return a.price - b.price;
          case "rating":
            return b.rating - a.rating;
          case "name":
          default:
            return (a.name || "").localeCompare(b.name || "");
        }
      });
  }, [influencers, searchTerm, filterCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Our Influencers
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          Discover talented influencers ready to make your event unforgettable
        </motion.p>

        {/* Filters */}
        <motion.div
          className="bg-white rounded-2xl p-4 shadow-sm mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search influencers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid influencer-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {filteredInfluencers.map((influencer, idx) => (
            <motion.div
              key={influencer._id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={influencer.image}
                  alt={influencer.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 influencer-img"
                />
                <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ${influencer.price}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{influencer.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{influencer.expertise}</p>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{influencer.bio}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="text-yellow-400" size={18} />
                    <span className="ml-2 text-gray-700 font-medium">{influencer.rating?.toFixed(1) ?? "0.0"}</span>
                  </div>

                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {influencer.category}
                  </span>
                </div>

                <Link
                  to={`/booking/influencer/${influencer._id}`}
                  className="block w-full text-center bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredInfluencers.length === 0 && (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No influencers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Influencers;
