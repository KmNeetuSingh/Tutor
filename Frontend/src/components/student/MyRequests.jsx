import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTrash, FaFilter, FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { api } from '../../api/config';
import { Card, CardHeader, CardBody } from '../common/Card';
import Button from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import Badge from '../common/Badge';

const MyRequests = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterAndSortRequests();
  }, [requests, searchTerm, selectedStatus, sortConfig]);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests/my');
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
      setLoading(false);
    }
  };

  const filterAndSortRequests = () => {
    let filtered = [...requests];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.tutor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }

    // Sort requests
    filtered.sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortConfig.key === 'budget') {
        const budgetA = parseFloat(a.budget);
        const budgetB = parseFloat(b.budget);
        return sortConfig.direction === 'asc' ? budgetA - budgetB : budgetB - budgetA;
      }
      return 0;
    });

    setFilteredRequests(filtered);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const handleView = (requestId) => {
    navigate(`/requests/${requestId}`);
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await api.delete(`/requests/${requestId}`);
        toast.success('Request deleted successfully');
        fetchRequests(); // Refresh the list
      } catch (error) {
        console.error('Error deleting request:', error);
        toast.error('Failed to delete request');
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: 'warning', text: 'Pending' },
      accepted: { variant: 'success', text: 'Accepted' },
      rejected: { variant: 'danger', text: 'Rejected' },
      scheduled: { variant: 'info', text: 'Scheduled' },
      completed: { variant: 'primary', text: 'Completed' }
    };
    return variants[status] || variants.pending;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: theme.accent }}></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: theme.text }}>My Requests</h1>
          <div className="flex space-x-4">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          {showFilters && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: theme.inputBg,
                      color: theme.text,
                      border: `1px solid ${theme.border}`
                    }}
                  />
                  <FaSearch className="absolute left-3 top-3" style={{ color: theme.textSecondary }} />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: theme.inputBg,
                    color: theme.text,
                    border: `1px solid ${theme.border}`
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center space-x-4">
            <span className="text-sm" style={{ color: theme.textSecondary }}>Sort by:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('date')}
              className="flex items-center"
            >
              Date {getSortIcon('date')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort('budget')}
              className="flex items-center"
            >
              Budget {getSortIcon('budget')}
            </Button>
          </div>

          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: theme.textSecondary }}>No requests found</p>
              </div>
            ) : (
              filteredRequests.map(request => (
                <div
                  key={request._id}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.border}`
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium" style={{ color: theme.text }}>
                        {request.subject}
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: theme.textSecondary }}>
                        {request.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <Badge variant={getStatusBadge(request.status).variant}>
                          {getStatusBadge(request.status).text}
                        </Badge>
                        <span className="text-sm" style={{ color: theme.textSecondary }}>
                          Tutor: {request.tutor.name}
                        </span>
                        <span className="text-sm" style={{ color: theme.textSecondary }}>
                          Budget: ${request.budget}
                        </span>
                        <span className="text-sm" style={{ color: theme.textSecondary }}>
                          Date: {new Date(request.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleView(request._id)}
                      >
                        <FaEye className="mr-1" />
                        View
                      </Button>
                      {request.status === 'pending' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(request._id)}
                        >
                          <FaTrash className="mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default MyRequests; 