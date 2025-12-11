import { Check, Edit, Package, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';

const PackageManager = () => {
  const { packages, influencers, addPackage, updatePackage, deletePackage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inclusions, setInclusions] = useState(['']);

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    influencer: '',
    available: 'true'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        inclusions: inclusions.filter(inc => inc.trim() !== ''),
        available: formData.available === 'true'
      };

      if (editingPackage) {
        await updatePackage(editingPackage._id, packageData);
      } else {
        await addPackage(packageData);
      }

      setIsModalOpen(false);
      setEditingPackage(null);
      resetForm();
    } catch (error) {
      console.error('Error saving package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration,
      category: pkg.category,
      influencer: pkg.influencer?._id || '',
      available: pkg.available.toString()
    });
    setInclusions(pkg.inclusions || ['']);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id);
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      influencer: '',
      available: 'true'
    });
    setInclusions(['']);
    setEditingPackage(null);
  };

  const addInclusion = () => setInclusions([...inclusions, '']);
  const updateInclusion = (index, value) => {
    const newInclusions = [...inclusions];
    newInclusions[index] = value;
    setInclusions(newInclusions);
  };
  const removeInclusion = (index) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
          <p className="text-gray-600">Manage event packages and offerings</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 flex items-center gap-2"
        >
          <Plus size={20} /> Add Package
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
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
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No packages found</h3>
            <p className="text-gray-500">Add your first package to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Package</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Inclusions</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{pkg.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{pkg.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {pkg.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{pkg.duration}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${pkg.price}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {pkg.inclusions?.slice(0, 2).map((inc, idx) => (
                          <div key={idx} className="flex items-center">
                            <Check size={14} className="mr-1 text-green-500" />
                            <span className="line-clamp-1">{inc}</span>
                          </div>
                        ))}
                        {pkg.inclusions?.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{pkg.inclusions.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pkg.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {pkg.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleEdit(pkg)} className="text-blue-600 hover:text-blue-900 transition duration-200">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(pkg._id)} className="text-red-600 hover:text-red-900 transition duration-200">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingPackage ? 'Edit Package' : 'Add New Package'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Package Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="input-field" />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required className="input-field">
                <option value="">Select Category</option>
                <option value="Birthday Party">Birthday Party</option>
                <option value="Engagement">Engagement</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Product Launch">Product Launch</option>
                <option value="Charity Event">Charity Event</option>
                <option value="Music Concert">Music Concert</option>
                <option value="Sports Event">Sports Event</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
              <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required placeholder="e.g., 4 hours, Full day, Weekend" className="input-field" />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required min="0" step="0.01" className="input-field" />
            </div>

            {/* Influencer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Influencer *</label>
              <select value={formData.influencer} onChange={(e) => setFormData({ ...formData, influencer: e.target.value })} required className="input-field">
                <option value="">Select Influencer</option>
                {influencers.map(influencer => (
                  <option key={influencer._id} value={influencer._id}>{influencer.name} - {influencer.expertise}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select value={formData.available} onChange={(e) => setFormData({ ...formData, available: e.target.value })} required className="input-field">
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows="3" className="input-field" />
          </div>

          {/* Inclusions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Inclusions *</label>
              <button type="button" onClick={addInclusion} className="text-primary-600 hover:text-primary-700 text-sm font-medium">+ Add Inclusion</button>
            </div>
            <div className="space-y-2">
              {inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="text" value={inclusion} onChange={(e) => updateInclusion(index, e.target.value)} placeholder="Enter inclusion item" className="flex-1 input-field" />
                  {inclusions.length > 1 && (
                    <button type="button" onClick={() => removeInclusion(index)} className="text-red-600 hover:text-red-700 p-2">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {loading && <LoadingSpinner size="sm" />}
              {editingPackage ? 'Update' : 'Create'} Package
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PackageManager;
