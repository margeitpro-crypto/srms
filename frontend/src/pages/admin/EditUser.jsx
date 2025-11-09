import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';
import { FiArrowLeft, FiSave, FiUser, FiRefreshCw } from 'react-icons/fi';
import { apiHelpers } from '../../api/config';

const EditUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const { hasAnyRole, getRoleDisplayName } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: '', label: 'Select Role' },
    { value: 'super_admin', label: 'Super Administrator', disabled: !hasAnyRole(['super_admin']) },
    { value: 'district_admin', label: 'District Administrator', disabled: !hasAnyRole(['super_admin']) },
    { value: 'school_admin', label: 'School Administrator' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'student', label: 'Student' },
    { value: 'parent', label: 'Parent' },
  ];

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await apiHelpers.get(`/users/${id}`);
      const userData = response.user;
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || '',
      });
      
      setOriginalData({
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || '',
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      setAlert({
        type: 'error',
        message: 'Failed to load user data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.role !== originalData.role
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges()) {
      setAlert({
        type: 'info',
        message: 'No changes to save.'
      });
      return;
    }

    try {
      setSaving(true);
      setAlert(null);

      const updateData = {};
      if (formData.name !== originalData.name) updateData.name = formData.name.trim();
      if (formData.email !== originalData.email) updateData.email = formData.email.trim().toLowerCase();
      if (formData.role !== originalData.role) updateData.role = formData.role;

      await apiHelpers.put(`/users/${id}`, updateData);

      setAlert({
        type: 'success',
        message: 'User updated successfully!'
      });

      // Update original data after successful save
      setOriginalData({
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Failed to update user. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...originalData });
    setErrors({});
    setAlert(null);
  };

  if (loading) {
    return (
      <Layout>
        <Layout.Loading text="Loading user data..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.PageHeader
        title="Edit User"
        subtitle={`Edit user account details for ${originalData.name}`}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/users')}
            icon={<FiArrowLeft />}
          >
            Back to Users
          </Button>
        }
      />

      <Layout.Content>
        <div className="max-w-2xl mx-auto">
          <Card>
            <Card.Header>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <FiUser className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">User Information</h3>
                  <p className="text-sm text-gray-500">
                    Update user account details and role
                  </p>
                </div>
              </div>
            </Card.Header>

            <form onSubmit={handleSubmit} className="space-y-6">
              {alert && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  placeholder="Enter full name"
                  required
                />

                <Input
                  label="Email Address *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <Select
                label="User Role *"
                name="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                error={errors.role}
                required
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </option>
                ))}
              </Select>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Current Role Permissions</h4>
                <p className="text-sm text-gray-600">
                  {formData.role ? getRoleDisplayName(formData.role) : 'No role selected'}
                </p>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  icon={<FiRefreshCw />}
                  disabled={!hasChanges() || saving}
                >
                  Reset Changes
                </Button>
                
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/users')}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={<FiSave />}
                    loading={saving}
                    disabled={!hasChanges()}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* User Statistics */}
          <Card className="mt-6">
            <Card.Header>
              <h4 className="text-sm font-medium text-gray-900">Account Information</h4>
            </Card.Header>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">User ID:</span>
                <span className="font-mono">{id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Role:</span>
                <span>{getRoleDisplayName(formData.role)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Status:</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </Card>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default EditUser;