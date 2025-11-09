import React, { Suspense, lazy } from 'react';
import Layout from '../components/layout/Layout';

const lazyLoad = (importFunc) => {
  const LazyComponent = lazy(importFunc);
  return (props) => (
    <Suspense fallback={<Layout.Loading />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Auth Pages
export const Login = lazyLoad(() => import('../pages/auth/Login'));
export const ForgotPassword = lazyLoad(() => import('../pages/auth/ForgotPassword'));
export const ResetPassword = lazyLoad(() => import('../pages/auth/ResetPassword'));
export const RequestAccess = lazyLoad(() => import('../pages/auth/RequestAccess'));

// Dashboard
export const Dashboard = lazyLoad(() => import('../pages/dashboard/Dashboard'));

// Admin Pages
export const StudentsList = lazyLoad(() => import('../pages/admin/StudentsList'));
export const ExamManagement = lazyLoad(() => import('../pages/admin/ExamManagement'));
export const CertificateManagement = lazyLoad(() => import('../pages/admin/CertificateManagement'));
export const BillingManagement = lazyLoad(() => import('../pages/admin/BillingManagement'));
export const UsersList = lazyLoad(() => import('../pages/admin/UsersList'));
export const Reports = lazyLoad(() => import('../pages/reports/Reports'));
export const Profile = lazyLoad(() => import('../pages/profile/Profile'));
export const Settings = lazyLoad(() => import('../pages/settings/Settings'));
export const AddUser = lazyLoad(() => import('../pages/admin/AddUser'));
export const EditUser = lazyLoad(() => import('../pages/admin/EditUser'));
export const UserDetails = lazyLoad(() => import('../pages/admin/UserDetails'));
export const SchoolsList = lazyLoad(() => import('../pages/admin/SchoolsList'));
export const AddSchool = lazyLoad(() => import('../pages/admin/AddSchool'));
export const EditSchool = lazyLoad(() => import('../pages/admin/EditSchool'));
export const SchoolDetails = lazyLoad(() => import('../pages/admin/SchoolDetails'));

// Teacher Pages
export const MarksEntry = lazyLoad(() => import('../pages/teacher/MarksEntry'));
export const ExamsPage = lazyLoad(() => import('../pages/exams/ExamsPage'));
export const MarksPage = lazyLoad(() => import('../pages/marks/MarksPage'));
export const StudentsPage = lazyLoad(() => import('../pages/students/StudentsPage'));
export const CertificatesPage = lazyLoad(() => import('../pages/certificates/CertificatesPage'));
export const BillingPage = lazyLoad(() => import('../pages/billing/BillingPage'));

// School Pages
export const MySchool = lazyLoad(() => import('../components/schools/MySchool'));

// Student Pages
export const MyMarks = lazyLoad(() => import('../pages/student/MyMarks'));

// Parent Pages
export const ChildMarks = lazyLoad(() => import('../pages/parent/ChildMarks'));
