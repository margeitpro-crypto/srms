import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiUser, 
  FiMail, 
  FiCalendar,
  FiKey,
  FiActivity
} from 'react-icons/fi';
import { apiHelpers } from '../../api/config';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { hasAnyRole, getRoleDisplayName, hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiHelpers.get(`/users/${id}`);
      setUser(response.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await apiHelpers.delete(`/users/${id}`);
      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      super_admin: 'bg-red-100 text-red-800',
      district_admin: 'bg-purple-100 text-purple-800',
      school_admin: 'bg-blue-100 text-blue-800',
      teacher: 'bg-green-100 text-green-800',
      student: 'bg-yellow-100 text-yellow-800',
      parent: 'bg-orange-100 text-orange-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <Layout.Loading text="Loading user details..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Layout.Error
          title="Error Loading User"
          message={error}
          actionText="Go Back"
          onAction={() => navigate('/users')}
        />
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <Layout.Error
          title="User Not Found"
          message="The requested user could not be found."
          actionText="Go to Users"
          onAction={() => navigate('/users')}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.PageHeader
        title="User Details"
        subtitle={`View detailed information for ${user.name}`}
        actions={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/users')}
              icon={<FiArrowLeft />}
            >
              Back to Users
            </Button>
            {hasAnyRole(['super_admin', 'district_admin']) && (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/users/${id}/edit`)}
                  icon={<FiEdit2 />}
                >
                  Edit User
                </Button>
                {hasPermission('delete_users') && (
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                    icon={<FiTrash2 />}
                  >
                    Delete User
                  </Button>
                )}
              </>
            )}
          </div>
        }
      />

      <Layout.Content>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* User Profile Card */}
          <Card>
            <Card.Header>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-6">
                  <FiUser className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card.Header>
          </Card>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Information */}
            <Card>
              <Card.Header>
                <h4 className="text-lg font-medium text-gray-900">Account Information</h4>
              </Card.Header>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiKey className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">User Role</p>
                    <p className="font-medium">{getRoleDisplayName(user.role)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiActivity className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <Card.Header>
                <h4 className="text-lg font-medium text-gray-900">Activity Timeline</h4>
              </Card.Header>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Account Created</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatDateTime(user.updatedAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-5 h-5 text-gray-400 mr-3 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Role Permissions */}
          <Card>
            <Card.Header>
              <h4 className="text-lg font-medium text-gray-900">Role Permissions</h4>
              <p className="text-sm text-gray-500 mt-1">
                Current permissions for {getRoleDisplayName(user.role)} role
              </p>
            </Card.Header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getRolePermissions(user.role).map((permission, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700 capitalize">
                    {permission.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h4 className="text-lg font-medium text-gray-900">Quick Actions</h4>
            </Card.Header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/users/${id}/edit`)}
                icon={<FiEdit2 />}
                className="justify-center"
              >
                Edit User
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {/* TODO: Implement password reset */}}
                icon={<FiKey />}
                className="justify-center"
              >
                Reset Password
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {/* TODO: Implement activity log */}}
                icon={<FiActivity />}
                className="justify-center"
              >
                View Activity
              </Button>
              
              {hasPermission('delete_users') && (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  icon={<FiTrash2 />}
                  className="justify-center"
                >
                  Delete User
                </Button>
              )}
            </div>
          </Card>
        </div>
      </Layout.Content>

      {/* Delete Confirmation Modal */}
      <div className={`fixed inset-0 z-50 ${showDeleteModal ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50"></div>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete User</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone and will remove all user data.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={deleteLoading}
                >
                  Delete User
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper function to get role permissions
const getRolePermissions = (role) => {
  const permissions = {
    super_admin: [
      'view_all_schools', 'manage_schools', 'view_all_students', 'manage_students',
      'view_all_marks', 'manage_marks', 'view_reports', 'manage_users', 'system_settings'
    ],
    district_admin: [
      'view_all_schools', 'manage_schools', 'view_all_students', 'manage_students',
      'view_all_marks', 'manage_marks', 'view_reports', 'manage_users'
    ],
    school_admin: [
      'view_own_school', 'manage_own_students', 'view_own_marks', 'manage_own_marks',
      'view_own_reports', 'manage_teachers'
    ],
    teacher: [
      'view_assigned_classes', 'manage_assigned_marks', 'view_assigned_reports'
    ],
    student: [
      'view_own_marks', 'view_own_reports'
    ],
    parent: [
      'view_child_marks', 'view_child_reports'
    ]
  };
  
  return permissions[role] || [];
};

export default UserDetails;