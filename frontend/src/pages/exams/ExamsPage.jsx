import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ExamList from '../../components/exams/ExamList';
import ExamForm from '../../components/exams/ExamForm';
import ExamDetail from '../../components/exams/ExamDetail';
import ExamResults from '../../components/exams/ExamResults';

const ExamsPage = () => {
  const location = useLocation();
  
  // If we're at the root exams path, show the list
  if (location.pathname === '/exams') {
    return (
      <Layout>
        <Layout.PageHeader
          title="Exams Management"
          subtitle="Create, manage, and publish exams"
          actions={
            <button
              onClick={() => window.location.href = '/exams/new'}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Exam
            </button>
          }
        />
        <Layout.Content>
          <ExamList />
        </Layout.Content>
      </Layout>
    );
  }
  
  // Otherwise, handle nested routes
  return (
    <Layout>
      <Routes>
        <Route index element={<Navigate to="/exams" replace />} />
        <Route path="new" element={
          <Layout.Content>
            <Layout.PageHeader
              title="Create Exam"
              subtitle="Create a new exam with subjects and schedule"
            />
            <ExamForm />
          </Layout.Content>
        } />
        <Route path=":id" element={
          <Layout.Content>
            <ExamDetail />
          </Layout.Content>
        } />
        <Route path=":id/edit" element={
          <Layout.Content>
            <Layout.PageHeader
              title="Edit Exam"
              subtitle="Update exam details and subjects"
            />
            <ExamForm />
          </Layout.Content>
        } />
        <Route path=":id/results" element={
          <Layout.Content>
            <ExamResults />
          </Layout.Content>
        } />
      </Routes>
    </Layout>
  );
};

export default ExamsPage;