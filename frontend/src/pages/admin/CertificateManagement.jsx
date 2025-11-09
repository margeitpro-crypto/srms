import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { apiHelpers } from '../../api/config';

const CertificateManagement = () => {
  const { hasPermission } = useAuth();

  // Data and Loading State
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    studentId: '',
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Modal Visibility State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkGenerateModal, setShowBulkGenerateModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Form Data State
  const [newCertificate, setNewCertificate] = useState({
    studentId: '',
    examResultId: '', // Optional, can be linked later
    type: 'MARKSHEET',
    title: '',
    description: '',
    templateId: '',
    validUntil: '',
  });
  const [bulkGenerate, setBulkGenerate] = useState({
    examId: '',
    type: 'MARKSHEET',
    templateId: '',
    studentIds: [], // This will be populated based on the exam
    title: '',
    description: '',
  });

  // Verification State
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Dropdown/Select Data State
  const [students, setStudents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [exams, setExams] = useState([]);

  // Fetch certificates when page, search, or filters change
  useEffect(() => {
    fetchCertificates();
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm, filters]);

  // Fetch data needed for modals only when they are opened
  useEffect(() => {
    if (showCreateModal || showBulkGenerateModal || filters.studentId === '') {
      // Fetch students if the create modal is open or if the filter is cleared
      fetchStudents();
    }
    if (showCreateModal || showBulkGenerateModal) {
      fetchTemplates();
      fetchExams();
    }
  }, [showCreateModal, showBulkGenerateModal, filters.studentId]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.type && { type: filters.type }),
        ...(filters.status && { status: filters.status }),
        ...(filters.studentId && { studentId: filters.studentId }),
      };
      const response = await apiHelpers.get('/certificates', params);
      setCertificates(response.certificates || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.pagination?.pages || 1,
        totalItems: response.pagination?.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStudents = async () => {
    try {
      // Fetch a large list for dropdowns
      const response = await apiHelpers.get('/students?limit=1000');
      setStudents(response.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await apiHelpers.get('/certificate-templates');
      setTemplates(response.templates || []);
    } catch (error) {
      console.error('Error fetching certificate templates:', error);
    }
  };
  
  const fetchExams = async () => {
    try {
      const response = await apiHelpers.get('/exams?limit=1000');
      setExams(response.exams || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };
  
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleCreateCertificate = async (e) => {
    e.preventDefault();
    try {
      await apiHelpers.post('/certificates', newCertificate);
      setShowCreateModal(false);
      fetchCertificates(); // Refresh list
    } catch (error) {
      console.error('Error creating certificate:', error);
    }
  };

  const handleBulkGenerate = async (e) => {
    e.preventDefault();
    try {
      await apiHelpers.post('/certificates/bulk-generate', bulkGenerate);
      setShowBulkGenerateModal(false);
      fetchCertificates(); // Refresh list
    } catch (error) {
      console.error('Error bulk generating certificates:', error);
    }
  };

  const handleVerifyCertificate = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setVerificationResult(null); // Reset previous result
    try {
      const response = await apiHelpers.post('/certificates/verify', { verificationCode });
      setVerificationResult({ valid: true, ...response });
    } catch (error) {
      setVerificationResult({ valid: false, message: error.message || 'Verification failed.' });
    } finally {
      setVerifying(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      READY: 'bg-indigo-100 text-indigo-800',
      ISSUED: 'bg-green-100 text-green-800',
      DELIVERED: 'bg-teal-100 text-teal-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };
  
  const getCertificateTypeBadge = (type) => {
    const colors = {
      MARKSHEET: 'bg-blue-100 text-blue-800',
      TRANSCRIPT: 'bg-purple-100 text-purple-800',
      PASSING_CERTIFICATE: 'bg-green-100 text-green-800',
      MIGRATION_CERTIFICATE: 'bg-yellow-100 text-yellow-800',
      CHARACTER_CERTIFICATE: 'bg-indigo-100 text-indigo-800',
      COMPLETION_CERTIFICATE: 'bg-teal-100 text-teal-800',
      ACHIEVEMENT_CERTIFICATE: 'bg-pink-100 text-pink-800',
      PARTICIPATION_CERTIFICATE: 'bg-orange-100 text-orange-800',
      CUSTOM: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type.replace(/_/g, ' ')}
      </span>
    );
  };
  
  const columns = [
    {
      key: 'certificateNo',
      title: 'Certificate Details',
      render: (value, cert) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{cert.title}</p>
        </div>
      ),
    },
    {
      key: 'student',
      title: 'Student',
      render: (value) => value ? (
        <div>
          <p className="font-medium text-gray-900">{value.name}</p>
          <p className="text-sm text-gray-500">Roll: {value.rollNo}</p>
        </div>
      ) : 'N/A',
    },
    {
      key: 'type',
      title: 'Type',
      render: (value) => getCertificateTypeBadge(value),
    },
    {
      key: 'issueDate',
      title: 'Issue Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, cert) => (
        <div className="flex items-center space-x-2">
          <Button size="xs" variant="ghost" title="Download PDF">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </Button>
          <Button size="xs" variant="ghost" title="View Details">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </Button>
        </div>
      ),
    },
  ];

  const certificateTypes = Object.keys(getCertificateTypeBadge.colors).map(key => ({ value: key, label: key.replace(/_/g, ' ') }));

  return (
    <Layout>
      <Layout.PageHeader
        title="Certificate Management"
        subtitle="Generate, issue, and verify student certificates"
        breadcrumbs={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Certificates' },
        ]}
        action={
          <div className="flex items-center space-x-2">
            <Button variant="secondary" onClick={() => setShowVerifyModal(true)}>
              Verify Certificate
            </Button>
            {hasPermission('generate_certificates') && (
              <>
                <Button variant="secondary" onClick={() => setShowBulkGenerateModal(true)}>
                  Bulk Generate
                </Button>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                  Create Certificate
                </Button>
              </>
            )}
          </div>
        }
      />

      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search Cert No, Student..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} />
            <Input as="select" value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
              <option value="">All Types</option>
              {certificateTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
            </Input>
            <Input as="select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
              <option value="">All Statuses</option>
              {Object.keys(getStatusBadge.colors).map(status => <option key={status} value={status}>{status}</option>)}
            </Input>
            <Input as="select" value={filters.studentId} onChange={(e) => handleFilterChange('studentId', e.target.value)}>
              <option value="">All Students</option>
              {students.map(student => <option key={student.id} value={student.id}>{student.name} ({student.rollNo})</option>)}
            </Input>
          </div>
        </div>

        <Table
          data={certificates}
          columns={columns}
          loading={loading}
          pagination={
            <Table.Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
              onPageSizeChange={(size) => setPagination((prev) => ({ ...prev, itemsPerPage: size, currentPage: 1 }))}
            />
          }
          emptyMessage="No certificates found."
        />
      </Card>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Certificate">
        <form onSubmit={handleCreateCertificate} className="space-y-4">
            <Input as="select" label="Student" required value={newCertificate.studentId} onChange={e => setNewCertificate(prev => ({...prev, studentId: e.target.value}))}>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Input>
            <Input as="select" label="Certificate Type" required value={newCertificate.type} onChange={e => setNewCertificate(prev => ({...prev, type: e.target.value}))}>
                {certificateTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Input>
            <Input label="Certificate Title" required value={newCertificate.title} onChange={e => setNewCertificate(prev => ({...prev, title: e.target.value}))} />
            <Input label="Valid Until (Optional)" type="date" value={newCertificate.validUntil} onChange={e => setNewCertificate(prev => ({...prev, validUntil: e.target.value}))} />
            <Input as="textarea" label="Description" value={newCertificate.description} onChange={e => setNewCertificate(prev => ({...prev, description: e.target.value}))} />
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Create</Button>
            </div>
        </form>
      </Modal>

      <Modal isOpen={showBulkGenerateModal} onClose={() => setShowBulkGenerateModal(false)} title="Bulk Generate Certificates">
        <form onSubmit={handleBulkGenerate} className="space-y-4">
            <Input as="select" label="Exam" required value={bulkGenerate.examId} onChange={e => setBulkGenerate(prev => ({...prev, examId: e.target.value}))}>
                <option value="">Select Exam</option>
                {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </Input>
            <Input as="select" label="Certificate Type" required value={bulkGenerate.type} onChange={e => setBulkGenerate(prev => ({...prev, type: e.target.value}))}>
                {certificateTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Input>
            <Input as="select" label="Template" required value={bulkGenerate.templateId} onChange={e => setBulkGenerate(prev => ({...prev, templateId: e.target.value}))}>
                <option value="">Select Template</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Input>
            <Input label="Certificate Title" required value={bulkGenerate.title} onChange={e => setBulkGenerate(prev => ({...prev, title: e.target.value}))} placeholder="e.g., Final Examination Marksheet"/>
            <Input as="textarea" label="Description" value={bulkGenerate.description} onChange={e => setBulkGenerate(prev => ({...prev, description: e.target.value}))} />
            <p className="text-sm text-gray-600">This will generate certificates for all students who participated in the selected exam.</p>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowBulkGenerateModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Generate</Button>
            </div>
        </form>
      </Modal>

      <Modal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} title="Verify Certificate">
        <form onSubmit={handleVerifyCertificate} className="space-y-4">
          <Input
            label="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter certificate verification code"
            required
          />
          {verificationResult && (
            <div className={`p-4 rounded-lg border ${verificationResult.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-sm font-medium ${verificationResult.valid ? 'text-green-800' : 'text-red-800'}`}>
                {verificationResult.message || (verificationResult.valid ? 'Certificate is valid.' : 'Certificate is invalid or could not be found.')}
              </p>
              {verificationResult.valid && verificationResult.certificate && (
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <p><strong>Certificate No:</strong> {verificationResult.certificate.certificateNo}</p>
                    <p><strong>Student:</strong> {verificationResult.certificate.student.name}</p>
                    <p><strong>Issued On:</strong> {new Date(verificationResult.certificate.issueDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowVerifyModal(false)}>Close</Button>
            <Button type="submit" variant="primary" loading={verifying}>Verify</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default CertificateManagement;
