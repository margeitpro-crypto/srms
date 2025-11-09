import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import certificateService from '../../services/certificate.service';

const CertificateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    try {
      const certificateData = await certificateService.getCertificateById(id);
      setCertificate(certificateData);
    } catch (err) {
      setError('Failed to fetch certificate details');
      console.error('Error fetching certificate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await certificateService.downloadCertificate(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificate.certificateNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Refresh the certificate to update download count
      fetchCertificate();
    } catch (err) {
      setError('Failed to download certificate');
      console.error('Error downloading certificate:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await certificateService.deleteCertificate(id);
        navigate('/certificates');
      } catch (err) {
        setError('Failed to delete certificate');
        console.error('Error deleting certificate:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  if (!certificate) {
    return (
      <Alert variant="warning">
        Certificate not found
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Certificate Details</h1>
              <p className="text-gray-600 mt-1">View and manage certificate information</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/certificates')}
              >
                Back to List
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/certificates/${id}/edit`)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Certificate No</label>
                  <p className="mt-1 text-sm text-gray-900">{certificate.certificateNo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="mt-1 text-sm text-gray-900">{certificate.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {certificate.type.replace(/_/g, ' ')}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      certificate.status === 'ISSUED' || certificate.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      certificate.status === 'READY' ? 'bg-blue-100 text-blue-800' :
                      certificate.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                      certificate.status === 'PENDING' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {certificate.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(certificate.issueDate)}</p>
                </div>
                {certificate.validUntil && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(certificate.validUntil)}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{certificate.verificationCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Downloads</label>
                  <p className="mt-1 text-sm text-gray-900">{certificate.downloadCount}</p>
                </div>
              </div>
              
              {certificate.description && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{certificate.description}</p>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{certificate.student.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Roll No</label>
                  <p className="mt-1 text-sm text-gray-900">{certificate.student.rollNo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Class/Section</label>
                  <p className="mt-1 text-sm text-gray-900">{certificate.student.class} / {certificate.student.section}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-4">
                {(certificate.status === 'READY' || certificate.status === 'ISSUED' || certificate.status === 'DELIVERED') && (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleDownload}
                  >
                    Download Certificate
                  </Button>
                )}
                
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => window.location.href = `/certificates/${id}/verify`}
                >
                  Verify Certificate
                </Button>
                
                {user.role !== 'student' && user.role !== 'parent' && (
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={handleDelete}
                  >
                    Delete Certificate
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(certificate.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(certificate.updatedAt)}</p>
                </div>
                {certificate.lastDownloaded && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Downloaded</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDateTime(certificate.lastDownloaded)}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetail;