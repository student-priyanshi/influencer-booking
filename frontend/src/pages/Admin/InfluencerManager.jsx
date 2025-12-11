import { Edit, Plus, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Modal from "../../components/ui/Modal";
import { useApp } from "../../context/AppContext";

const InfluencerManager = () => {
  const { influencers, addInfluencer, updateInfluencer, deleteInfluencer } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'

  const filteredInfluencers = influencers.filter((influencer) =>
    (influencer.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (influencer.expertise || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    expertise: "",
    category: "",
    image: "",
    price: "",
    rating: "",
    availability: true,
    featured: false,
    socialMedia: {
      instagram: "",
      youtube: "",
      tiktok: "",
      twitter: "",
    },
  });

  const openCreateModal = () => {
    setEditingInfluencer(null);
    setFormData({
      name: "",
      bio: "",
      expertise: "",
      category: "",
      image: "",
      price: "",
      rating: "",
      availability: true,
      featured: false,
      socialMedia: {
        instagram: "",
        youtube: "",
        tiktok: "",
        twitter: "",
      },
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const influencerData = {
        ...formData,
        price: parseFloat(formData.price || 0),
        rating: parseFloat(formData.rating || 0),
      };

      if (editingInfluencer) {
        await updateInfluencer(editingInfluencer._id, influencerData);
      } else {
        await addInfluencer(influencerData);
      }

      setIsModalOpen(false);
      setEditingInfluencer(null);
      resetForm();
    } catch (error) {
      console.error("Error saving influencer:", error);
      alert(error?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (influencer) => {
    setEditingInfluencer(influencer);
    setFormData({
      name: influencer.name || "",
      bio: influencer.bio || "",
      expertise: influencer.expertise || "",
      category: influencer.category || "",
      image: influencer.image || "",
      price: influencer.price?.toString() || "",
      rating: influencer.rating?.toString() || "",
      availability: influencer.availability ?? true,
      featured: influencer.featured ?? false,
      socialMedia: {
        instagram: influencer.socialMedia?.instagram || "",
        youtube: influencer.socialMedia?.youtube || "",
        tiktok: influencer.socialMedia?.tiktok || "",
        twitter: influencer.socialMedia?.twitter || "",
      },
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this influencer?")) {
      try {
        await deleteInfluencer(id);
      } catch (error) {
        console.error("Error deleting influencer:", error);
        alert("Delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      bio: "",
      expertise: "",
      category: "",
      image: "",
      price: "",
      rating: "",
      availability: true,
      featured: false,
      socialMedia: {
        instagram: "",
        youtube: "",
        tiktok: "",
        twitter: "",
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Influencer Management</h1>
          <p className="text-gray-600">Manage influencers and profiles</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 ${viewMode === "table" ? "bg-primary-600 text-white" : "bg-white text-gray-700"}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`px-4 py-2 ${viewMode === "card" ? "bg-primary-600 text-white" : "bg-white text-gray-700"}`}
            >
              Cards
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus size={16} />
            Add Influencer
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
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
      </div>

      {/* Content */}
      <div>
        {filteredInfluencers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <Users size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No influencers found</h3>
            <p className="text-gray-500">Add your first influencer to get started</p>
          </div>
        ) : viewMode === "table" ? (
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Influencer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Expertise</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInfluencers.map((influencer) => (
                  <tr key={influencer._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img src={influencer.image} alt={influencer.name} className="w-10 h-10 rounded-full object-cover mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{influencer.name}</div>
                          <div className="text-xs text-gray-500">{influencer._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{influencer.expertise}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {influencer.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">${influencer.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center"><span className="text-yellow-400">★</span><span className="ml-2">{influencer.rating}</span></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleEdit(influencer)} className="text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(influencer._id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Card view for admin
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map((influencer) => (
              <div key={influencer._id} className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
                <img src={influencer.image} alt={influencer.name} className="w-full h-44 object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{influencer.name}</h3>
                      <p className="text-sm text-gray-600">{influencer.expertise}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">${influencer.price}</div>
                      <div className="text-yellow-400">★ {influencer.rating}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleEdit(influencer)} className="text-blue-600"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(influencer._id)} className="text-red-600"><Trash2 size={16} /></button>
                    </div>

                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${influencer.availability ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {influencer.availability ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInfluencer(null);
          resetForm();
        }}
        title={editingInfluencer ? "Edit Influencer" : "Add New Influencer"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input required className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expertise *</label>
              <input required className="input-field" value={formData.expertise} onChange={(e) => setFormData({ ...formData, expertise: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input required className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <input required type="url" className="input-field" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input required type="number" min="0" step="0.01" className="input-field" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
              <input required type="number" min="0" max="5" step="0.1" className="input-field" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio *</label>
            <textarea required rows="4" className="input-field" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input type="url" className="input-field" value={formData.socialMedia.instagram} onChange={(e) => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, instagram: e.target.value } })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
              <input type="url" className="input-field" value={formData.socialMedia.youtube} onChange={(e) => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, youtube: e.target.value } })} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              {loading && <LoadingSpinner size="sm" />} {editingInfluencer ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InfluencerManager;
