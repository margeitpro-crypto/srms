import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { apiHelpers, API_ENDPOINTS } from '../../api/config';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  useEffect(() => {
    if (!token) {
      setStatus({ loading: false, message: '', error: 'Invalid or missing reset token' });
    }
  }, [token]);

  const validate = () => {
    if (!password || password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirm) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setStatus({ loading: false, message: '', error: v });
      return;
    }
    setStatus({ loading: true, message: '', error: '' });
    try {
      await apiHelpers.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword: password });
      setStatus({ loading: false, message: 'Password reset successful. Redirecting to login...', error: '' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message || 'Failed to reset password' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Set a new password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Enter and confirm your new password</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={status.error}
              required
              fullWidth
              placeholder="Enter new password"
              disabled={status.loading}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={''}
              required
              fullWidth
              placeholder="Confirm new password"
              disabled={status.loading}
            />

            {status.message && (
              <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                <p className="text-sm text-green-700">{status.message}</p>
              </div>
            )}

            {status.error && !status.message && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-700">{status.error}</p>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth loading={status.loading} disabled={status.loading}>
              {status.loading ? 'Saving...' : 'Reset password'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;