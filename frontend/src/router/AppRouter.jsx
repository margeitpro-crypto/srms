import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import PerformanceMonitor from '../components/PerformanceMonitor';
import * as Pages from './lazy';
import StudentProfile from '../components/students/StudentProfile';
import StudentForm from '../components/students/StudentForm';

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();
  const tokenPresent =
    typeof window !== 'undefined' && localStorage.getItem('authToken');

  // While auth is initializing, optimistically render un-gated pages (e.g., Dashboard)
  if (isLoading) {
    if (roles.length === 0 && tokenPresent) {
      return children;
    }
    return <Layout.Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !hasAnyRole(roles)) {
    return (
      <Layout.Error
        title="Access Denied"
        message="You don't have permission to access this page."
        actionText="Go to Dashboard"
        onAction={() => (window.location.href = '/dashboard')}
      />
    );
  }

  return children;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Layout.Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Mock Components for demonstration
const ComingSoon = ({ title = 'Coming Soon' }) => (
  <Layout>
    <Layout.PageHeader
      title={title}
      subtitle="This feature is under development"
    />
    <Layout.Content>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Under Construction
        </h3>
        <p className="text-gray-500">
          This page is being developed. Check back soon!
        </p>
      </div>
    </Layout.Content>
  </Layout>
);

const AppRouter = () => {
  return (
    <AuthProvider>
      <PerformanceMonitor />
      <Suspense fallback={<Layout.Loading />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Pages.Login />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <Pages.ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <Pages.ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/request-access"
            element={
              <PublicRoute>
                <Pages.RequestAccess />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Pages.Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Role-specific Dashboards */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['super_admin', 'district_admin']}>
                <Pages.Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/dashboard"
            element={
              <ProtectedRoute roles={['school_admin']}>
                <Pages.Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute roles={['teacher']}>
                <Pages.Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={['student']}>
                <Pages.Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute roles={['parent']}>
                <Pages.Dashboard />
              </ProtectedRoute>
            }
          />

          {/* User Management Routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={['super_admin', 'district_admin']}>
                <Pages.UsersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/add"
            element={
              <ProtectedRoute roles={['super_admin', 'district_admin']}>
                <Pages.AddUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute roles={['super_admin', 'district_admin']}>
                <Pages.UserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <ProtectedRoute roles={['super_admin', 'district_admin']}>
                <Pages.EditUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/teachers"
            element={
              <ProtectedRoute
                roles={['super_admin', 'district_admin', 'school_admin']}
              >
                <ComingSoon title="Teachers Management" />
              </ProtectedRoute>
            }
          />

          {/* School Management Routes */}
          <Route
            path="/schools"
            element={
              <ProtectedRoute roles={['super_admin', 'district_admin']}>
                <Pages.SchoolsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/add"
            element={
              <ProtectedRoute roles={['super_admin', 'district_admin']}>
                <Pages.AddSchool />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/:id"
            element={
              <ProtectedRoute
                roles={['super_admin', 'district_admin', 'school_admin']}
              >
                <Pages.SchoolDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/:id/edit"
            element={
              <ProtectedRoute roles={['super_admin', 'district_admin']}>
                <Pages.EditSchool />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/my-school"
            element={
              <ProtectedRoute roles={['school_admin']}>
                <Pages.MySchool />
              </ProtectedRoute>
            }
          />

          {/* Student Management Routes */}
          <Route
            path="/students"
            element={
              <ProtectedRoute
                roles={['super_admin', 'district_admin', 'school_admin']}
              >
                <Pages.StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/add"
            element={
              <ProtectedRoute
                roles={['super_admin', 'district_admin', 'school_admin']}
              >
                <StudentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/import"
            element={
              <ProtectedRoute
                roles={['super_admin', 'district_admin', 'school_admin']}
              >
                <ComingSoon title="Bulk Import Students" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                ]}
              >
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id/edit"
            element={
              <ProtectedRoute
                roles={['super_admin', 'district_admin', 'school_admin']}
              >
                <StudentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/my-classes"
            element={
              <ProtectedRoute roles={['teacher']}>
                <ComingSoon title="My Classes" />
              </ProtectedRoute>
            }
          />

          {/* Subject Management Routes */}
          <Route
            path="/subjects"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                ]}
              >
                <ComingSoon title="Subjects Management" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects/add"
            element={
              <ProtectedRoute
                roles={['super_admin', 'district_admin', 'school_admin']}
              >
                <ComingSoon title="Add Subject" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects/:id"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                ]}
              >
                <ComingSoon title="Subject Details" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects/:id/edit"
            element={
              <ProtectedRoute
                roles={['super_admin', 'district_admin', 'school_admin']}
              >
                <ComingSoon title="Edit Subject" />
              </ProtectedRoute>
            }
          />

          {/* Marks Management Routes */}
          <Route
            path="/marks"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                ]}
              >
                <ComingSoon title="Marks Management" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marks/entry"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                ]}
              >
                <Pages.MarksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marks/import"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                ]}
              >
                <ComingSoon title="Bulk Import Marks" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marks/my-marks"
            element={
              <ProtectedRoute roles={['student']}>
                <Pages.MyMarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marks/child-marks"
            element={
              <ProtectedRoute roles={['parent']}>
                <Pages.ChildMarks />
              </ProtectedRoute>
            }
          />

          {/* Reports & Analytics Routes */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Pages.Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/students"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                ]}
              >
                <ComingSoon title="Student Reports" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/classes"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                ]}
              >
                <ComingSoon title="Class Reports" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/school-analytics"
            element={
              <ProtectedRoute
                roles={['super_admin', 'district_admin', 'school_admin']}
              >
                <ComingSoon title="School Analytics" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/subjects"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                ]}
              >
                <ComingSoon title="Subject Analysis" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/certificates"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                ]}
              >
                <ComingSoon title="Certificates" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/my-report"
            element={
              <ProtectedRoute roles={['student']}>
                <ComingSoon title="My Report Card" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/child-report"
            element={
              <ProtectedRoute roles={['parent']}>
                <ComingSoon title="Child's Report" />
              </ProtectedRoute>
            }
          />

          {/* Settings Routes */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Pages.Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Pages.Profile />
              </ProtectedRoute>
            }
          />

          {/* Exam Management Routes */}
          <Route
            path="/exams"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                  'student',
                  'parent',
                ]}
              >
                <Pages.ExamsPage />
              </ProtectedRoute>
            }
          />

          {/* Marks Management Routes */}
          <Route
            path="/marks"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                  'student',
                  'parent',
                ]}
              >
                <Pages.MarksPage />
              </ProtectedRoute>
            }
          />

          {/* Student Management Routes */}
          <Route
            path="/students"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                  'parent',
                ]}
              >
                <Pages.StudentsPage />
              </ProtectedRoute>
            }
          />

          {/* Certificate Management Routes */}
          <Route
            path="/certificates"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'teacher',
                  'student',
                  'parent',
                ]}
              >
                <Pages.CertificatesPage />
              </ProtectedRoute>
            }
          />

          {/* Billing Management Routes */}
          <Route
            path="/billing"
            element={
              <ProtectedRoute
                roles={[
                  'super_admin',
                  'district_admin',
                  'school_admin',
                  'parent',
                ]}
              >
                <Pages.BillingPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="*"
            element={
              <Layout.Error
                title="Page Not Found"
                message="The page you're looking for doesn't exist."
                actionText="Go to Dashboard"
                onAction={() => (window.location.href = '/dashboard')}
              />
            }
          />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default AppRouter;