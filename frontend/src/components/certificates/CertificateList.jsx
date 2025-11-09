import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import certificateService from '../../services/certificate.service';

const CertificateList = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const certificateTypes = [
    { value: '', label: 'All Types' },
    { value: 'MARKSHEET', label: 'Marksheet' },
    { value: 'TRANSCRIPT', label: 'Transcript' },
    { value: 'PASSING_CERTIFICATE', label: 'Passing Certificate' },
    { value: 'MIGRATION_CERTIFICATE', label: 'Migration Certificate' },
    { value: 'CHARACTER_CERTIFICATE', label: 'Character Certificate' },
    { value: 'COMPLETION_CERTIFICATE', label: 'Completion Certificate' },
    { value: 'ACHIEVEMENT_CERTIFICATE', label: 'Achievement Certificate' },
    { value: 'PARTICIPATION_CERTIFICATE', label: 'Participation Certificate' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'READY', label: 'Ready' },
    { value: 'ISSUED', label: 'Issued' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchCertificates();
  }, [pagination.page, searchTerm, typeFilter, statusFilter]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        type: typeFilter,
        status: statusFilter
      };
      
      const response = await certificateService.getAllCertificates(filters);
      
      setCertificates(response.certificates);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to fetch certificates');
      console.error('Error fetching certificates:', err);
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

  const handleDownload = async (certificateId) => {
    try {
      const blob = await certificateService.downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Refresh the list to update download count
      fetchCertificates();
    } catch (err) {
      setError('Failed to download certificate');
      console.error('Error downloading certificate:', err);
    }
  };

  const handleDelete = async (certificateId) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await certificateService.deleteCertificate(certificateId);
        fetchCertificates();
      } catch (err) {
        setError('Failed to delete certificate');
        console.error('Error deleting certificate:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    { key: 'certificateNo', title: 'Certificate No' },
    { key: 'title', title: 'Title' },
    { 
      key: 'type', 
      title: 'Type',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value.replace(/_/g, ' ')}
        </span>
      )
    },
    { 
      key: 'student', 
      title: 'Student',
      render: (_, certificate) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{certificate.student.name}</div>
          <div className="text-sm text-gray-500">Roll: {certificate.student.rollNo}</div>
        </div>
      )
    },
    { 
      key: 'issueDate', 
      title: 'Issue Date',
      render: (value) => formatDate(value)
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'ISSUED' || value === 'DELIVERED' ? 'bg-green-100 text-green-800' :
          value === 'READY' ? 'bg-blue-100 text-blue-800' :
          value === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
          value === 'PENDING' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'downloads', 
      title: 'Downloads',
      render: (_, certificate) => certificate.downloadCount
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, certificate) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => window.location.href = `/certificates/${certificate.id}`}
          >
            View
          </Button>
          {(certificate.status === 'READY' || certificate.status === 'ISSUED' || certificate.status === 'DELIVERED') && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleDownload(certificate.id)}
            >
              Download
            </Button>
          )}
          {user.role !== 'student' && user.role !== 'parent' && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(certificate.id)}
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
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={certificateTypes}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
            <Button type="submit">Search</Button>
          </form>

          <Table
            data={certificates}
            columns={columns}
            loading={loading}
            emptyMessage="No certificates found"
          />

          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing {Math.min(certificates.length, pagination.limit)} of {pagination.total} certificates
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

export default CertificateList;