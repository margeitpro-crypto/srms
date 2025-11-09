import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';
import billingService from '../../services/billing.service';

const BillForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bill, setBill] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    dueDate: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBill();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchBill = async () => {
    try {
      const billData = await billingService.getBillById(id);
      setBill(billData);
      setFormData({
        studentId: billData.studentId,
        amount: billData.amount,
        dueDate: billData.dueDate.split('T')[0], // Format date for input
        description: billData.description || ''
      });
    } catch (err) {
      setError('Failed to fetch bill');
      console.error('Error fetching bill:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (id) {
        // Update existing bill
        await billingService.updateBill(id, formData);
        setSuccess('Bill updated successfully');
      } else {
        // Create new bill
        await billingService.createBill(formData);
        setSuccess('Bill created successfully');
        // Reset form
        setFormData({
          studentId: '',
          amount: '',
          dueDate: '',
          description: ''
        });
      }
      
      // Redirect to bills list after a short delay
      setTimeout(() => {
        navigate('/billing');
      }, 1500);
    } catch (err) {
      setError('Failed to save bill: ' + (err.response?.data?.message || err.message));
      console.error('Error saving bill:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {id ? 'Edit Bill' : 'Create Bill'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Student ID"
                name="studentId"
                type="number"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/billing')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : (id ? 'Update Bill' : 'Create Bill')}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default BillForm;