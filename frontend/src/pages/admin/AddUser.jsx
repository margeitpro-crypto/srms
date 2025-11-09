import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';
import { FiArrowLeft, FiSave, FiUser } from 'react-icons/fi';
import { apiHelpers } from '../../api/config';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const { hasAnyRole } = useAuth();
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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    try {
      setLoading(true);
      setAlert(null);

      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      };

      await apiHelpers.post('/users', userData);

      setAlert({
        type: 'success',
        message: 'User created successfully! Redirecting to users list...'
      });

      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Failed to create user. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Layout.PageHeader
        title="Add New User"
        subtitle="Create a new user account with specific role and permissions"
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
                    Fill in the details to create a new user account
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Password *"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  placeholder="Enter password (min. 6 characters)"
                  required
                />

                <Input
                  label="Confirm Password *"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  placeholder="Confirm password"
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

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/users')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<FiSave />}
                  loading={loading}
                >
                  Create User
                </Button>
              </div>
            </form>
          </Card>

          {/* Password Requirements */}
          <Card className="mt-6">
            <Card.Header>
              <h4 className="text-sm font-medium text-gray-900">Password Requirements</h4>
            </Card.Header>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Minimum 6 characters</p>
              <p>• Should include both letters and numbers</p>
              <p>• Use special characters for better security</p>
              <p>• Avoid common passwords</p>
            </div>
          </Card>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default AddUser;