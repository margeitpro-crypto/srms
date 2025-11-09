import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import billingService from '../../services/billing.service';

const BillList = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'OVERDUE', label: 'Overdue' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchBills();
  }, [pagination.page, searchTerm, statusFilter]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        status: statusFilter
      };
      
      const response = await billingService.getAllBills(filters);
      
      setBills(response.bills);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to fetch bills');
      console.error('Error fetching bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleDelete = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billingService.deleteBill(billId);
        fetchBills();
      } catch (err) {
        setError('Failed to delete bill');
        console.error('Error deleting bill:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const columns = [
    { key: 'billNo', title: 'Bill No' },
    { 
      key: 'student', 
      title: 'Student',
      render: (_, bill) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{bill.student.name}</div>
          <div className="text-sm text-gray-500">Roll: {bill.student.rollNo}</div>
        </div>
      )
    },
    { 
      key: 'amount', 
      title: 'Amount',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'dueDate', 
      title: 'Due Date',
      render: (value) => formatDate(value)
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'PAID' ? 'bg-green-100 text-green-800' :
          value === 'OVERDUE' ? 'bg-red-100 text-red-800' :
          value === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, bill) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => window.location.href = `/billing/bills/${bill.id}`}
          >
            View
          </Button>
          {bill.status === 'PENDING' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => window.location.href = `/billing/bills/${bill.id}/pay`}
            >
              Pay
            </Button>
          )}
          {user.role !== 'student' && user.role !== 'parent' && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(bill.id)}
            >
              Delete
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <div className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
            <Button type="submit">Search</Button>
          </form>

          <Table
            data={bills}
            columns={columns}
            loading={loading}
            emptyMessage="No bills found"
          />

          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing {Math.min(bills.length, pagination.limit)} of {pagination.total} bills
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BillList;