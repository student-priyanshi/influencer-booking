import { motion } from "framer-motion";
import { Calendar, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useApp } from "../context/AppContext";

const Events = () => {
  const { events, categories, loading } = useApp();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // FILTER + SEARCH
  const filtered = events
    .filter((ev) => {
      const s = search.toLowerCase();
      return (
        ev.title.toLowerCase().includes(s) ||
        ev.location.toLowerCase().includes(s)
      );
    })
    .filter((ev) => !filterCategory || ev.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return new Date(a.date) - new Date(b.date);
    });

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="xl" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* HEADING */}
        <motion.h1
          className="text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Events & Experiences
        </motion.h1>

        {/* FILTER BAR */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-3 py-3 border rounded-lg"
            />
          </div>

          {/* Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-lg px-4 py-3"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-4 py-3"
          >
            <option value="date">Sort by Date</option>
            <option value="price-high">Price: High → Low</option>
            <option value="price-low">Price: Low → High</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* LIST GRID */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filtered.map((ev, index) => (
            <motion.div
              key={ev._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                src={ev.image}
                className="w-full h-48 object-cover"
                alt={ev.title}
              />

              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">{ev.title}</h3>

                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar size={18} className="mr-2" />
                  {new Date(ev.date).toLocaleDateString()}
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={18} className="mr-2" />
                  {ev.location}
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                  {ev.description}
                </p>

                {/* VIEW BUTTON */}
                <Link
                  to={`/booking/event/${ev._id}`}
                  className="block text-center bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={60} className="mx-auto text-gray-400" />
            <h2 className="text-xl font-semibold mt-4">No Events Found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
