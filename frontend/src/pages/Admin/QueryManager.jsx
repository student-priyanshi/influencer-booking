import { DollarSign, Eye, Filter, Mail, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import { queryService } from '../../services/api';

const QueryManager = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await queryService.getAll();
        if (isMounted) setQueries(data);
      } catch (err) {
        if (isMounted) setError(err?.response?.data?.message || 'Failed to load queries');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const filteredQueries = queries.filter(query => {
    const matchesSearch = 
      query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || query.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', label: 'New' },
      contacted: { color: 'bg-yellow-100 text-yellow-800', label: 'Contacted' },
      resolved: { color: 'bg-green-100 text-green-800', label: 'Resolved' }
    };
    
    const config = statusConfig[status] || statusConfig.new;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleViewDetails = (query) => {
    setSelectedQuery(query);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (queryId, newStatus) => {
    try {
      const updated = await queryService.updateStatus(queryId, newStatus);
      setQueries((prev) => prev.map((q) => (q._id === updated._id ? updated : q)));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }
    try {
      const subject = `Response to your ${selectedQuery.eventType} inquiry`;
      const body = replyMessage;
      window.location.href = `mailto:${selectedQuery.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setReplyMessage('');
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to open mail client.');
    }
  };

  const formatBudget = (budget) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(budget);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Query Management</h1>
          <p className="text-gray-600">Manage customer inquiries and responses</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
          </select>

          <div className="text-sm text-gray-500 flex items-center">
            <Filter size={16} className="mr-2" />
            {filteredQueries.length} queries found
          </div>
        </div>
      </div>

      {/* Queries Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading queries...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredQueries.length === 0 ? (
          <div className="text-center py-12">
            <Mail size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No queries found</h3>
            <p className="text-gray-500">No queries match your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Event Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Event Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Budget</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Guests</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Received</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQueries.map((query) => (
                  <tr key={query._id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {query.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {query.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{query.eventType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(query.eventDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-semibold text-gray-900">
                        <DollarSign size={16} className="mr-1" />
                        {formatBudget(query.budget)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{query.guests}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(query.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewDetails(query)}
                          className="text-blue-600 hover:text-blue-900 transition duration-200"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <select
                          value={query.status}
                          onChange={(e) => handleStatusUpdate(query._id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Query Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuery(null);
          setReplyMessage('');
        }}
        title="Query Details"
        size="lg"
      >
        {selectedQuery && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Name</dt>
                    <dd className="text-sm text-gray-900">{selectedQuery.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Email</dt>
                    <dd className="text-sm text-gray-900">{selectedQuery.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Phone</dt>
                    <dd className="text-sm text-gray-900">{selectedQuery.phone}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Event Information</h3>
                <dl className="mt-2 space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Event Type</dt>
                    <dd className="text-sm text-gray-900">{selectedQuery.eventType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Event Date</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(selectedQuery.eventDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Budget</dt>
                    <dd className="text-sm text-gray-900">{formatBudget(selectedQuery.budget)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Guests</dt>
                    <dd className="text-sm text-gray-900">{selectedQuery.guests}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Message</h3>
              <div className="mt-2 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedQuery.message}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Send Reply</h3>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Type your reply message here..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition duration-300"
              >
                Send Reply
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QueryManager;