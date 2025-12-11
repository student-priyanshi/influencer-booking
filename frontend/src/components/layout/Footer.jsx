import { Facebook, Instagram, Mail, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-primary-400 mb-4">InfluenceBook</h3>
            <p className="text-gray-300">
              Connecting brands with top influencers for unforgettable events and experiences.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/influencers" className="text-gray-300 hover:text-white transition">Influencers</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-white transition">Events</Link></li>
              <li><Link to="/packages" className="text-gray-300 hover:text-white transition">Packages</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Event Categories</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Birthday Parties</span></li>
              <li><span className="text-gray-300">Engagements</span></li>
              <li><span className="text-gray-300">Weddings</span></li>
              <li><span className="text-gray-300">Corporate Events</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Mail size={20} />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-300">Email: info@influencebook.com</p>
              <p className="text-gray-300">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">
            &copy; 2024 InfluenceBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;