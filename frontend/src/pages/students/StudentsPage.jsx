import React from 'react';
import Layout from '../../components/layout/Layout';
import StudentManagement from '../../components/students/StudentManagement';

const StudentsPage = () => {
  return (
    <Layout>
      <Layout.PageHeader
        title="Students Management"
        subtitle="Manage student information, enrollment, and academic records"
      />
      <Layout.Content>
        <StudentManagement />
      </Layout.Content>
    </Layout>
  );
};

export default StudentsPage;