import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Modal from "../../components/ui/Modal";
import { useApp } from "../../context/AppContext";

const EventManager = () => {
  const { events, categories, addEvent, updateEvent, deleteEvent, loading } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    date: "",
    time: "",
    location: "",
    image: "",
    capacity: "",
  });

  // Open add modal
  const openAddModal = () => {
    setEditEvent(null);
    setFormData({
      title: "",
      category: "",
      description: "",
      price: "",
      date: "",
      time: "",
      location: "",
      image: "",
      capacity: "",
    });
    setModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (ev) => {
    setEditEvent(ev);
    setFormData({
      title: ev.title,
      category: ev.category,
      description: ev.description,
      price: ev.price,
      date: ev.date?.split("T")[0] || "",
      time: ev.time || "",
      location: ev.location,
      image: ev.image,
      capacity: ev.capacity,
    });
    setModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (editEvent) {
      await updateEvent(editEvent._id, formData);
    } else {
      await addEvent(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Event Manager</h1>
        <button
          onClick={openAddModal}
          className="bg-purple-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Event
        </button>
      </div>

      {/* Event Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm overflow-x-auto">
        {loading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <table className="w-full table-auto border-collapse text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Location</th>
                <th className="p-3">Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-3">{ev.title}</td>
                  <td className="p-3">{ev.category}</td>
                  <td className="p-3">{ev.date ? new Date(ev.date).toLocaleDateString() : "—"}</td>
                  <td className="p-3">{ev.location}</td>
                  <td className="p-3">₹{ev.price}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(ev)}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-lg flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(ev._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal with buttons like Influencer Form */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          title={editEvent ? "Edit Event" : "Add Event"}
          onClose={() => setModalOpen(false)}
        >
          <div className="grid grid-cols-1 gap-4 mt-4">
            <input
              className="border p-3 rounded-lg"
              placeholder="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <select
              className="border p-3 rounded-lg"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <input
              className="border p-3 rounded-lg"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <input
              type="date"
              className="border p-3 rounded-lg"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <input
              type="time"
              className="border p-3 rounded-lg"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
            <input
              type="number"
              className="border p-3 rounded-lg"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <input
              className="border p-3 rounded-lg"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            <input
              type="number"
              className="border p-3 rounded-lg"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
            <textarea
              className="border p-3 rounded-lg"
              placeholder="Description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            {/* Footer buttons like Influencer Form */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                {editEvent ? "Update Event" : "Create Event"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventManager;
