import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { apiHelpers, API_ENDPOINTS } from '../../api/config';

const BillingManagement = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    billType: '',
    studentId: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [newBill, setNewBill] = useState({
    billType: 'exam',
    studentId: '',
    examId: '',
    certificateId: '',
    feeStructureId: '',
    quantity: 1,
    dueDate: '',
    description: '',
  });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'CASH',
    transactionId: '',
    remarks: '',
  });
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
    fetchStatistics();
    if (hasPermission('manage_billing')) {
      fetchStudents();
      fetchExams();
      fetchFeeStructures();
    }
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm, filters]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status && { status: filters.status }),
        ...(filters.billType && { billType: filters.billType }),
        ...(filters.studentId && { studentId: filters.studentId }),
      };

      const response = await apiHelpers.get('/bills', params);

      setBills(response.bills || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.pagination?.pages || 1,
        totalItems: response.pagination?.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching bills:', error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await apiHelpers.get('/bills/statistics');
      setStatistics(response || {});
    } catch (error) {
      console.error('Error fetching billing statistics:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await apiHelpers.get('/students');
      setStudents(response.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await apiHelpers.get('/exams');
      setExams(response.exams || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchFeeStructures = async () => {
    try {
      const response = await apiHelpers.get('/fee-structures');
      setFeeStructures(response.feeStructures || []);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
    }
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      const endpoint = newBill.billType === 'exam' ? '/bills/exam' : '/bills/certificate';
      await apiHelpers.post(endpoint, newBill);

      setShowCreateModal(false);
      fetchBills();
    } catch (error) {
      console.error('Error creating bill:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    try {
      setPaymentLoading(true);
      await apiHelpers.post(`/bills/${selectedBill.id}/${selectedBill.billType}/payment`, paymentData);

      setShowPaymentModal(false);
      fetchBills();
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentClick = (bill) => {
    setSelectedBill(bill);
    setPaymentData({
      amount: bill.balance,
      method: 'CASH',
      transactionId: '',
      remarks: '',
    });
    setShowPaymentModal(true);
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PARTIALLY_PAID: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      FAILED: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const columns = [
    {
      key: 'billNo',
      title: 'Bill No.',
      render: (value) => <span className="font-mono text-sm font-medium">{value}</span>
    },
    {
      key: 'student',
      title: 'Student',
      render: (value) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{value.name}</p>
          <p className="text-sm text-gray-500">{value.rollNo}</p>
        </div>
      )
    },
    {
      key: 'description',
      title: 'Description'
    },
    {
      key: 'totalAmount',
      title: 'Amount',
      render: (value, bill) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{value.toLocaleString()} {bill.currency}</p>
          {bill.balance < value && <p className="text-xs text-red-600">Balance: {bill.balance.toLocaleString()}</p>}
        </div>
      )
    },
    {
      key: 'dueDate',
      title: 'Due Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, bill) => (
        <div className="flex items-center space-x-2">
          <Button size="xs" variant="ghost" onClick={() => navigate(`/billing/${bill.billType}/${bill.id}`)} title="View Bill">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </Button>
          {bill.status !== 'COMPLETED' && hasPermission('manage_payments') && (
            <Button size="xs" variant="primary" onClick={() => handlePaymentClick(bill)}>Pay</Button>
          )}
        </div>
      )
    }
  ];

  return (
    <Layout>
      <Layout.PageHeader
        title="Billing Management"
        subtitle="Manage invoices, track payments, and view financial reports"
        action={
          hasPermission('manage_billing') && (
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create Bill
            </Button>
          )
        }
      />

      {/* Statistics Cards */}
      <Layout.Grid cols={4} gap={6} className="mb-8">
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-gray-500">Total Billed</p>
            <p className="text-2xl font-semibold text-gray-900">{statistics.totalAmount?.toLocaleString() || 0} NPR</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-gray-500">Total Paid</p>
            <p className="text-2xl font-semibold text-green-600">{statistics.totalPaid?.toLocaleString() || 0} NPR</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-gray-500">Outstanding</p>
            <p className="text-2xl font-semibold text-red-600">{(statistics.totalAmount - statistics.totalPaid)?.toLocaleString() || 0} NPR</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm font-medium text-gray-500">Total Bills</p>
            <p className="text-2xl font-semibold text-gray-900">{statistics.totalBills || 0}</p>
          </div>
        </Card>
      </Layout.Grid>

      <Card>
        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select
              value={filters.billType}
              onChange={(e) => setFilters(prev => ({ ...prev, billType: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Types</option>
              <option value="exam">Exam Bill</option>
              <option value="certificate">Certificate Bill</option>
            </select>
            <select
              value={filters.studentId}
              onChange={(e) => setFilters(prev => ({ ...prev, studentId: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Students</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>
        </div>

        <Table
          data={bills}
          columns={columns}
          loading={loading}
          pagination={
            <Table.Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
              onPageSizeChange={(size) => setPagination(prev => ({ ...prev, itemsPerPage: size, currentPage: 1 }))}
            />
          }
        />
      </Card>

      {/* Create Bill Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Bill"
        size="lg"
        loading={createLoading}
      >
        <form onSubmit={handleCreateBill} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Bill Type</label>
              <select
                value={newBill.billType}
                onChange={(e) => setNewBill(prev => ({ ...prev, billType: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                required
              >
                <option value="exam">Exam Bill</option>
                <option value="certificate">Certificate Bill</option>
              </select>
            </div>
            <div>
              <label>Student</label>
              <select
                value={newBill.studentId}
                onChange={(e) => setNewBill(prev => ({ ...prev, studentId: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                required
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>
            {newBill.billType === 'exam' ? (
              <div>
                <label>Exam</label>
                <select
                  value={newBill.examId}
                  onChange={(e) => setNewBill(prev => ({ ...prev, examId: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                >
                  <option value="">Select Exam</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label>Certificate Type (or ID)</label>
                <Input
                  value={newBill.certificateId}
                  onChange={(e) => setNewBill(prev => ({ ...prev, certificateId: e.target.value }))}
                  placeholder="Certificate ID (optional)"
                />
              </div>
            )}
            <div>
              <label>Fee Structure</label>
              <select
                value={newBill.feeStructureId}
                onChange={(e) => setNewBill(prev => ({ ...prev, feeStructureId: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                required
              >
                <option value="">Select Fee</option>
                {feeStructures
                  .filter(fs => (newBill.billType === 'exam' ? fs.type === 'EXAM_FEE' : fs.type === 'CERTIFICATE_FEE'))
                  .map(fs => (
                    <option key={fs.id} value={fs.id}>{fs.name} - {fs.amount} NPR</option>
                  ))}
              </select>
            </div>
            {newBill.billType === 'certificate' && (
              <Input
                label="Quantity"
                type="number"
                value={newBill.quantity}
                onChange={(e) => setNewBill(prev => ({ ...prev, quantity: e.target.value }))}
                min="1"
                required
              />
            )}
            <Input
              label="Due Date"
              type="date"
              value={newBill.dueDate}
              onChange={(e) => setNewBill(prev => ({ ...prev, dueDate: e.target.value }))}
            />
            <div className="col-span-2">
              <Input
                label="Description"
                value={newBill.description}
                onChange={(e) => setNewBill(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Bill description..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={createLoading}>Create Bill</Button>
          </div>
        </form>
      </Modal>

      {/* Process Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={`Process Payment for ${selectedBill?.billNo}`}
        loading={paymentLoading}
      >
        <form onSubmit={handleProcessPayment} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Amount"
              type="number"
              value={paymentData.amount}
              onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
              max={selectedBill?.balance}
              required
            />
            <div>
              <label>Payment Method</label>
              <select
                value={paymentData.method}
                onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                required
              >
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="ONLINE_PAYMENT">Online Payment</option>
                <option value="CARD">Card</option>
                <option value="MOBILE_WALLET">Mobile Wallet</option>
              </select>
            </div>
          </div>
          <Input
            label="Transaction ID (optional)"
            value={paymentData.transactionId}
            onChange={(e) => setPaymentData(prev => ({ ...prev, transactionId: e.target.value }))}
          />
          <Input
            label="Remarks (optional)"
            value={paymentData.remarks}
            onChange={(e) => setPaymentData(prev => ({ ...prev, remarks: e.target.value }))}
          />
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={paymentLoading}>Process Payment</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default BillingManagement;
