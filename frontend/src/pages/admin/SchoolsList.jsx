import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiEye,
  FiDownload,
  FiFilter,
  FiMapPin,
  FiUsers,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import { apiHelpers } from '../../api/config';

const SchoolsList = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { hasAnyRole, hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchools();
  }, [currentPage, searchTerm, districtFilter, statusFilter]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(districtFilter && { district: districtFilter }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await apiHelpers.get(`/schools?${params}`);
      setSchools(response.schools || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching schools:', error);
      setError('Failed to load schools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (school) => {
    setSelectedSchool(school);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedSchool) return;

    try {
      setDeleteLoading(true);
      await apiHelpers.delete(`/schools/${selectedSchool.id}`);
      setShowDeleteModal(false);
      setSelectedSchool(null);
      fetchSchools();
    } catch (error) {
      console.error('Error deleting school:', error);
      setError('Failed to delete school. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement CSV export functionality
    console.log('Export functionality to be implemented');
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSchoolTypeColor = (type) => {
    const colors = {
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-purple-100 text-purple-800',
      higher_secondary: 'bg-indigo-100 text-indigo-800',
      college: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'name',
      label: 'School Name',
      render: (value, item) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <FiMapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{item.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <Badge className={getSchoolTypeColor(value)}>
          {value?.replace('_', ' ').toUpperCase() || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'district',
      label: 'District',
      render: (value) => value || 'N/A',
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (value, item) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-900">
            <FiPhone className="w-4 h-4 mr-1" />
            {item.phone || 'N/A'}
          </div>
          <div className="flex items-center text-gray-500 mt-1">
            <FiMail className="w-4 h-4 mr-1" />
            {item.email || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      key: 'students_count',
      label: 'Students',
      render: (value) => (
        <div className="flex items-center">
          <FiUsers className="w-4 h-4 mr-1 text-gray-500" />
          <span className="font-medium">{value || 0}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge className={getStatusBadgeColor(value)}>
          {value?.toUpperCase() || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, item) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/schools/${item.id}`)}
            icon={<FiEye />}
            title="View Details"
          />
          {hasPermission('edit_schools') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/schools/${item.id}/edit`)}
              icon={<FiEdit2 />}
              title="Edit School"
            />
          )}
          {hasPermission('delete_schools') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(item)}
              icon={<FiTrash2 />}
              title="Delete School"
              className="text-red-600 hover:text-red-800"
            />
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout>
        <Layout.Loading text="Loading schools..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.PageHeader
        title="Schools Management"
        subtitle="Manage and monitor all schools in the system"
        actions={
          <div className="flex space-x-3">
            {hasPermission('export_schools') && (
              <Button
                variant="outline"
                onClick={handleExport}
                icon={<FiDownload />}
              >
                Export
              </Button>
            )}
            {hasPermission('create_schools') && (
              <Button
                variant="primary"
                onClick={() => navigate('/schools/add')}
                icon={<FiPlus />}
              >
                Add School
              </Button>
            )}
          </div>
        }
      />

      <Layout.Content>
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Schools
              </label>
              <Input
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                icon={<FiSearch />}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <Select
                value={districtFilter}
                onChange={(e) => {
                  setDistrictFilter(e.target.value);
                  setCurrentPage(1);
                }}
                icon={<FiMapPin />}
              >
                <option value="">All Districts</option>
                <option value="kathmandu">Kathmandu</option>
                <option value="lalitpur">Lalitpur</option>
                <option value="bhaktapur">Bhaktapur</option>
                <option value="pokhara">Pokhara</option>
                <option value="biratnagar">Biratnagar</option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                icon={<FiFilter />}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setDistrictFilter('');
                  setStatusFilter('');
                  setCurrentPage(1);
                }}
                icon={<FiFilter />}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Schools Table */}
        <Card>
          <Table
            columns={columns}
            data={schools}
            loading={loading}
            emptyMessage="No schools found. Try adjusting your filters."
          />
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'primary' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Layout.Content>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedSchool(null);
        }}
        title="Delete School"
      >
        <div className="space-y-4">
          <Alert type="warning">
            Are you sure you want to delete <strong>{selectedSchool?.name}</strong>? This action cannot be undone and will remove all associated data including students, teachers, and marks.
          </Alert>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedSchool(null);
              }}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleteLoading}
            >
              Delete School
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default SchoolsList;