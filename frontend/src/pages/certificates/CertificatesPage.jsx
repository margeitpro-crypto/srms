import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import CertificateList from '../../components/certificates/CertificateList';
import CertificateForm from '../../components/certificates/CertificateForm';
import CertificateDetail from '../../components/certificates/CertificateDetail';
import CertificateVerification from '../../components/certificates/CertificateVerification';

const CertificatesPage = () => {
  const location = useLocation();
  
  // If we're at the root certificates path, show the list
  if (location.pathname === '/certificates') {
    return (
      <Layout>
        <Layout.PageHeader
          title="Certificates"
          subtitle="Manage and view student certificates"
          actions={
            <button
              onClick={() => window.location.href = '/certificates/new'}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Certificate
            </button>
          }
        />
        <Layout.Content>
          <CertificateList />
        </Layout.Content>
      </Layout>
    );
  }
  
  // Otherwise, handle nested routes
  return (
    <Layout>
      <Routes>
        <Route index element={<Navigate to="/certificates" replace />} />
        <Route path="new" element={
          <Layout.Content>
            <Layout.PageHeader
              title="Create Certificate"
              subtitle="Generate a new certificate for a student"
            />
            <CertificateForm />
          </Layout.Content>
        } />
        <Route path=":id" element={
          <Layout.Content>
            <CertificateDetail />
          </Layout.Content>
        } />
        <Route path=":id/edit" element={
          <Layout.Content>
            <Layout.PageHeader
              title="Edit Certificate"
              subtitle="Update certificate information"
            />
            <CertificateForm />
          </Layout.Content>
        } />
        <Route path="verify" element={
          <Layout.Content>
            <CertificateVerification />
          </Layout.Content>
        } />
      </Routes>
    </Layout>
  );
};

export default CertificatesPage;