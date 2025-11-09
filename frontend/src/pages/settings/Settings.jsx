import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Toggle from '../../components/ui/Toggle';
import { 
  FiUser, 
  FiLock, 
  FiBell, 
  FiGlobe, 
  FiShield, 
  FiSave, 
  FiKey,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

const Settings = () => {
  const { user, updateUserSettings } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileSettings, setProfileSettings] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    language: 'en',
    timezone: 'UTC'
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: user?.twoFactorEnabled || false,
    loginNotifications: user?.loginNotifications || true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user?.emailNotifications || true,
    smsNotifications: user?.smsNotifications || false,
    pushNotifications: user?.pushNotifications || true,
    marksUpdates: user?.marksUpdates || true,
    attendanceAlerts: user?.attendanceAlerts || true,
    systemUpdates: user?.systemUpdates || true,
    reportReminders: user?.reportReminders || true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: user?.profileVisibility || 'all',
    showEmail: user?.showEmail || false,
    showPhone: user?.showPhone || false,
    dataSharing: user?.dataSharing || false,
    analyticsTracking: user?.analyticsTracking || true
  });

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: <FiUser /> },
    { id: 'security', label: 'Security', icon: <FiShield /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'privacy', label: 'Privacy', icon: <FiGlobe /> }
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNotificationChange = (name, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = async (settingsType) => {
    try {
      setLoading(true);
      let settingsToSave = {};
      
      switch (settingsType) {
        case 'profile':
          settingsToSave = profileSettings;
          break;
        case 'security':
          if (securitySettings.newPassword !== securitySettings.confirmPassword) {
            alert('New passwords do not match');
            return;
          }
          settingsToSave = securitySettings;
          break;
        case 'notifications':
          settingsToSave = notificationSettings;
          break;
        case 'privacy':
          settingsToSave = privacySettings;
          break;
        default:
          return;
      }
      
      await updateUserSettings(settingsType, settingsToSave);
      alert(`${settingsType.charAt(0).toUpperCase() + settingsType.slice(1)} settings saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileSettings = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
        <p className="text-sm text-gray-500">Update your basic profile information</p>
      </Card.Header>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <Input
              name="firstName"
              value={profileSettings.firstName}
              onChange={handleProfileChange}
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <Input
              name="lastName"
              value={profileSettings.lastName}
              onChange={handleProfileChange}
              placeholder="Enter your last name"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <Input
            name="email"
            type="email"
            value={profileSettings.email}
            onChange={handleProfileChange}
            placeholder="Enter your email address"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <Select
            name="language"
            value={profileSettings.language}
            onChange={handleProfileChange}
          >
            <option value="en">English</option>
            <option value="ne">नेपाली</option>
            <option value="hi">हिन्दी</option>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <Select
            name="timezone"
            value={profileSettings.timezone}
            onChange={handleProfileChange}
          >
            <option value="UTC">UTC</option>
            <option value="Asia/Kathmandu">Asia/Kathmandu</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
          </Select>
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={() => handleSaveSettings('profile')}
            loading={loading}
            icon={<FiSave />}
          >
            Save Profile Settings
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          <p className="text-sm text-gray-500">Update your account password</p>
        </Card.Header>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Input
                name="currentPassword"
                type={showPassword ? 'text' : 'password'}
                value={securitySettings.currentPassword}
                onChange={handleSecurityChange}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Input
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={securitySettings.newPassword}
                onChange={handleSecurityChange}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={securitySettings.confirmPassword}
                onChange={handleSecurityChange}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => handleSaveSettings('security')}
              loading={loading}
              icon={<FiSave />}
            >
              Update Password
            </Button>
          </div>
        </div>
      </Card>
      
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
        </Card.Header>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Enable 2FA</h4>
            <p className="text-sm text-gray-500">Require a verification code when logging in</p>
          </div>
          <Toggle
            checked={securitySettings.twoFactorEnabled}
            onChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
          />
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            variant="primary"
            onClick={() => handleSaveSettings('security')}
            loading={loading}
            icon={<FiSave />}
          >
            Save Security Settings
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="text-sm text-gray-500">Choose how you want to be notified</p>
      </Card.Header>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Notification Methods</h4>
          
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Email Notifications</h5>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Toggle
              checked={notificationSettings.emailNotifications}
              onChange={(checked) => handleNotificationChange('emailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">SMS Notifications</h5>
              <p className="text-sm text-gray-500">Receive notifications via SMS</p>
            </div>
            <Toggle
              checked={notificationSettings.smsNotifications}
              onChange={(checked) => handleNotificationChange('smsNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Push Notifications</h5>
              <p className="text-sm text-gray-500">Receive browser push notifications</p>
            </div>
            <Toggle
              checked={notificationSettings.pushNotifications}
              onChange={(checked) => handleNotificationChange('pushNotifications', checked)}
            />
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Notification Types</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">Marks Updates</h5>
                <p className="text-sm text-gray-500">Get notified when marks are updated</p>
              </div>
              <Toggle
                checked={notificationSettings.marksUpdates}
                onChange={(checked) => handleNotificationChange('marksUpdates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">Attendance Alerts</h5>
                <p className="text-sm text-gray-500">Get notified about attendance issues</p>
              </div>
              <Toggle
                checked={notificationSettings.attendanceAlerts}
                onChange={(checked) => handleNotificationChange('attendanceAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">System Updates</h5>
                <p className="text-sm text-gray-500">Get notified about system updates</p>
              </div>
              <Toggle
                checked={notificationSettings.systemUpdates}
                onChange={(checked) => handleNotificationChange('systemUpdates', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">Report Reminders</h5>
                <p className="text-sm text-gray-500">Get reminded about report generation</p>
              </div>
              <Toggle
                checked={notificationSettings.reportReminders}
                onChange={(checked) => handleNotificationChange('reportReminders', checked)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={() => handleSaveSettings('notifications')}
            loading={loading}
            icon={<FiSave />}
          >
            Save Notification Settings
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderPrivacySettings = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
        <p className="text-sm text-gray-500">Control your privacy and data sharing preferences</p>
      </Card.Header>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Profile Visibility</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who can see your profile?
            </label>
            <Select
              name="profileVisibility"
              value={privacySettings.profileVisibility}
              onChange={handlePrivacyChange}
            >
              <option value="all">Everyone</option>
              <option value="school">Only people from your school</option>
              <option value="none">Only you</option>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Show Email Address</h5>
              <p className="text-sm text-gray-500">Make your email address visible to others</p>
            </div>
            <Toggle
              checked={privacySettings.showEmail}
              onChange={(checked) => setPrivacySettings(prev => ({ ...prev, showEmail: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Show Phone Number</h5>
              <p className="text-sm text-gray-500">Make your phone number visible to others</p>
            </div>
            <Toggle
              checked={privacySettings.showPhone}
              onChange={(checked) => setPrivacySettings(prev => ({ ...prev, showPhone: checked }))}
            />
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Data & Analytics</h4>
          
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Data Sharing</h5>
              <p className="text-sm text-gray-500">Allow sharing of anonymized data for improvements</p>
            </div>
            <Toggle
              checked={privacySettings.dataSharing}
              onChange={(checked) => setPrivacySettings(prev => ({ ...prev, dataSharing: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <h5 className="text-sm font-medium text-gray-900">Analytics Tracking</h5>
              <p className="text-sm text-gray-500">Allow usage analytics for better service</p>
            </div>
            <Toggle
              checked={privacySettings.analyticsTracking}
              onChange={(checked) => setPrivacySettings(prev => ({ ...prev, analyticsTracking: checked }))}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={() => handleSaveSettings('privacy')}
            loading={loading}
            icon={<FiSave />}
          >
            Save Privacy Settings
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <Layout>
      <Layout.PageHeader
        title="Settings"
        subtitle="Manage your account preferences and settings"
      />

      <Layout.Content>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Card className="sticky top-6">
              <div className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && renderProfileSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'privacy' && renderPrivacySettings()}
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default Settings;