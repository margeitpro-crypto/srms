import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import { 
  FiEdit2, 
  FiTrash2, 
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiUser,
  FiCalendar,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiLoader
} from 'react-icons/fi';
import { apiHelpers } from '../../api/config';

const SchoolDetails = () => {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const { hasAnyRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchool();
  }, [id]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiHelpers.get(`/schools/${id}`);
      setSchool(response.school);
      
    } catch (error) {
      console.error('Error fetching school:', error);
      setError('Failed to load school details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);
      
      await apiHelpers.delete(`/schools/${id}`);
      
      // Redirect to schools list after successful deletion
      navigate('/schools');
      
    } catch (error) {
      console.error('Error deleting school:', error);
      setDeleteError(error.message || 'Failed to delete school. Please try again.');
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'green', icon: <FiCheckCircle /> },
      inactive: { color: 'gray', icon: <FiXCircle /> },
      pending: { color: 'yellow', icon: <FiClock /> },
      suspended: { color: 'red', icon: <FiXCircle /> }
    };
    
    const config = statusConfig[status] || { color: 'gray', icon: <FiClock /> };
    
    return (
      <Badge color={config.color}>
        {config.icon}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    );
  };

  const getSchoolTypeLabel = (type) => {
    const types = {
      primary: 'Primary School',
      secondary: 'Secondary School',
      higher_secondary: 'Higher Secondary School',
      college: 'College'
    };
    
    return types[type] || type;
  };

  if (loading) {
    return (
      <Layout>
        <Layout.Loading text="Loading school details..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Layout.PageHeader
          title="School Details"
          actions={
            <Button
              variant="outline"
              onClick={() => navigate('/schools')}
              icon={<FiArrowLeft />}
            >
              Back to Schools
            </Button>
          }
        />
        <Layout.Content>
          <Alert type="error">
            {error}
          </Alert>
        </Layout.Content>
      </Layout>
    );
  }

  if (!school) {
    return (
      <Layout>
        <Layout.PageHeader
          title="School Not Found"
          actions={
            <Button
              variant="outline"
              onClick={() => navigate('/schools')}
              icon={<FiArrowLeft />}
            >
              Back to Schools
            </Button>
          }
        />
        <Layout.Content>
          <Alert type="error">
            School not found or you don't have permission to view it.
          </Alert>
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.PageHeader
        title={school.name}
        subtitle={school.code}
        actions={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/schools')}
              icon={<FiArrowLeft />}
            >
              Back to Schools
            </Button>
            {hasAnyRole(['super_admin', 'district_admin']) && (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/schools/${id}/edit`)}
                  icon={<FiEdit2 />}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setDeleteModalOpen(true)}
                  icon={<FiTrash2 />}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        }
      />

      <Layout.Content>
        {/* School Overview */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">School Overview</h3>
          </Card.Header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="mt-1">{getStatusBadge(school.status)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="mt-1 text-gray-900">{getSchoolTypeLabel(school.type)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">District</p>
              <p className="mt-1 text-gray-900 capitalize">{school.district}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Established Year</p>
              <p className="mt-1 text-gray-900">{school.established_year || 'N/A'}</p>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          </Card.Header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="mt-1 text-gray-900 flex items-start">
                <FiMapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                {school.address || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="mt-1 text-gray-900 flex items-center">
                <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                {school.phone || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-gray-900 flex items-center">
                <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                {school.email || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Website</p>
              <p className="mt-1 text-gray-900 flex items-center">
                <FiGlobe className="w-4 h-4 mr-2 text-gray-400" />
                {school.website ? (
                  <a 
                    href={school.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {school.website}
                  </a>
                ) : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        {/* Principal Information */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Principal Information</h3>
          </Card.Header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Principal Name</p>
              <p className="mt-1 text-gray-900 flex items-center">
                <FiUser className="w-4 h-4 mr-2 text-gray-400" />
                {school.principal_name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Principal Phone</p>
              <p className="mt-1 text-gray-900 flex items-center">
                <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                {school.principal_phone || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Principal Email</p>
              <p className="mt-1 text-gray-900 flex items-center">
                <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                {school.principal_email || 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">School Statistics</h3>
          </Card.Header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FiUsers className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {school.total_students || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FiUser className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Total Teachers</p>
                  <p className="text-2xl font-bold text-green-900">
                    {school.total_teachers || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FiCalendar className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">Established</p>
                  <p className="text-lg font-bold text-purple-900">
                    {school.established_year || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FiClock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-600">Last Updated</p>
                  <p className="text-sm text-orange-900">
                    {school.updated_at ? new Date(school.updated_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Facilities */}
        {school.facilities && (
          <Card className="mb-6">
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Facilities</h3>
            </Card.Header>
            <div className="prose max-w-none">
              <p className="text-gray-600 whitespace-pre-wrap">{school.facilities}</p>
            </div>
          </Card>
        )}

        {/* Description */}
        {school.description && (
          <Card className="mb-6">
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
            </Card.Header>
            <div className="prose max-w-none">
              <p className="text-gray-600 whitespace-pre-wrap">{school.description}</p>
            </div>
          </Card>
        )}
      </Layout.Content>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete School"
        size="md"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <FiTrash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                Are you sure you want to delete this school?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone. All data associated with this school will be permanently removed.
              </p>
            </div>
          </div>
          
          {deleteError && (
            <Alert type="error" className="mb-4">
              {deleteError}
            </Alert>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-medium text-gray-700">School to be deleted:</p>
            <p className="text-sm text-gray-900 mt-1">{school.name}</p>
            <p className="text-sm text-gray-600">{school.code}</p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              icon={deleting ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
              loading={deleting}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete School'}
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default SchoolDetails;