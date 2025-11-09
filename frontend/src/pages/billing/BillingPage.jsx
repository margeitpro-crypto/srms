import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import BillingDashboard from '../../components/billing/BillingDashboard';
import BillList from '../../components/billing/BillList';
import BillForm from '../../components/billing/BillForm';
import PaymentHistory from '../../components/billing/PaymentHistory';

const BillingPage = () => {
  const location = useLocation();
  
  // If we're at the root billing path, show the dashboard
  if (location.pathname === '/billing') {
    return (
      <Layout>
        <Layout.PageHeader
          title="Billing"
          subtitle="Manage bills and payments"
          actions={
            <button
              onClick={() => window.location.href = '/billing/bills/new'}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ind-indigo-500"
            >
              Create Bill
            </button>
          }
        />
        <Layout.Content>
          <BillingDashboard />
        </Layout.Content>
      </Layout>
    );
  }
  
  // Otherwise, handle nested routes
  return (
    <Layout>
      <Routes>
        <Route index element={<Navigate to="/billing" replace />} />
        <Route path="bills" element={
          <Layout.Content>
            <Layout.PageHeader
              title="Bills"
              subtitle="Manage student bills"
              actions={
                <button
                  onClick={() => window.location.href = '/billing/bills/new'}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Bill
                </button>
              }
            />
            <BillList />
          </Layout.Content>
        } />
        <Route path="bills/new" element={
          <Layout.Content>
            <Layout.PageHeader
              title="Create Bill"
              subtitle="Generate a new bill for a student"
            />
            <BillForm />
          </Layout.Content>
        } />
        <Route path="bills/:id" element={
          <Layout.Content>
            <Layout.PageHeader
              title="Bill Details"
              subtitle="View bill information"
            />
            <BillForm />
          </Layout.Content>
        } />
        <Route path="bills/:id/edit" element={
          <Layout.Content>
            <Layout.PageHeader
              title="Edit Bill"
              subtitle="Update bill information"
            />
            <BillForm />
          </Layout.Content>
        } />
        <Route path="payments" element={
          <Layout.Content>
            <Layout.PageHeader
              title="Payment History"
              subtitle="View payment records"
            />
            <PaymentHistory />
          </Layout.Content>
        } />
      </Routes>
    </Layout>
  );
};

export default BillingPage;