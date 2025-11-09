import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { apiHelpers, API_ENDPOINTS } from '../../api/config';

const RequestAccess = () => {
  const [form, setForm] = useState({ name: '', email: '', organization: '', message: '' });
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  const validate = () => {
    if (!form.name.trim() || form.name.length < 2) return 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address';
    return '';
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
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
      await apiHelpers.post(API_ENDPOINTS.AUTH.REQUEST_ACCESS, form);
      setStatus({ loading: false, message: 'Request submitted. Administrator will contact you.', error: '' });
      setForm({ name: '', email: '', organization: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message || 'Failed to submit request' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Request access</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Submit your details to request account access</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Full Name" type="text" value={form.name} onChange={handleChange('name')} required fullWidth placeholder="Enter your name" disabled={status.loading} />
            <Input label="Email Address" type="email" value={form.email} onChange={handleChange('email')} required fullWidth placeholder="Enter your email" disabled={status.loading} />
            <Input label="Organization (optional)" type="text" value={form.organization} onChange={handleChange('organization')} fullWidth placeholder="School or district" disabled={status.loading} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" rows={4} value={form.message} onChange={handleChange('message')} placeholder="Tell us why you need access" disabled={status.loading} />
            </div>

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
              {status.loading ? 'Submitting...' : 'Submit request'}
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

export default RequestAccess;