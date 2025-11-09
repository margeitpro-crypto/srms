import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { 
  FiDownload, 
  FiBarChart2, 
  FiTrendingUp,
  FiUsers,
  FiBookOpen,
  FiAward,
  FiCalendar,
  FiHome
} from 'react-icons/fi';

const Reports = () => {
  const [filters, setFilters] = useState({
    type: 'student_performance',
    school: 'all',
    class: 'all',
    dateRange: 'current_year'
  });
  const [generating, setGenerating] = useState(false);

  const { hasAnyRole } = useAuth();

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = async (reportType) => {
    try {
      setGenerating(true);
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a sample PDF blob
      const sampleData = `Sample Report: ${reportType}\nGenerated on: ${new Date().toLocaleDateString()}\nFilters: ${JSON.stringify(filters, null, 2)}`;
      const blob = new Blob([sampleData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const getReportIcon = (type) => {
    const icons = {
      student_performance: <FiTrendingUp className="w-6 h-6" />,
      class_performance: <FiUsers className="w-6 h-6" />,
      subject_analysis: <FiBookOpen className="w-6 h-6" />,
      grade_distribution: <FiAward className="w-6 h-6" />,
      attendance_report: <FiCalendar className="w-6 h-6" />,
      school_summary: <FiHome className="w-6 h-6" />
    };
    
    return icons[type] || <FiBarChart2 className="w-6 h-6" />;
  };

  const getReportColor = (type) => {
    const colors = {
      student_performance: 'blue',
      class_performance: 'green',
      subject_analysis: 'purple',
      grade_distribution: 'yellow',
      attendance_report: 'indigo',
      school_summary: 'red'
    };
    
    return colors[type] || 'gray';
  };

  const reportTypes = [
    { value: 'student_performance', label: 'Student Performance Report' },
    { value: 'class_performance', label: 'Class Performance Report' },
    { value: 'subject_analysis', label: 'Subject Analysis Report' },
    { value: 'grade_distribution', label: 'Grade Distribution Report' },
    { value: 'attendance_report', label: 'Attendance Report' },
    { value: 'school_summary', label: 'School Summary Report' }
  ];

  const dateRanges = [
    { value: 'current_month', label: 'Current Month' },
    { value: 'current_year', label: 'Current Academic Year' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_year', label: 'Last Academic Year' }
  ];

  const classes = [
    { value: 'all', label: 'All Classes' },
    { value: '1', label: 'Class 1' },
    { value: '2', label: 'Class 2' },
    { value: '3', label: 'Class 3' },
    { value: '4', label: 'Class 4' },
    { value: '5', label: 'Class 5' },
    { value: '6', label: 'Class 6' },
    { value: '7', label: 'Class 7' },
    { value: '8', label: 'Class 8' },
    { value: '9', label: 'Class 9' },
    { value: '10', label: 'Class 10' }
  ];

  return (
    <Layout>
      <Layout.PageHeader
        title="Reports"
        subtitle="Generate and view various academic reports"
        actions={
          <Button
            variant="primary"
            onClick={() => generateReport(filters.type)}
            icon={generating ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FiDownload />}
            loading={generating}
          >
            Generate Report
          </Button>
        }
      />

      <Layout.Content>
        {/* Filters */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Report Filters</h3>
            <p className="text-sm text-gray-500">Select criteria for your report</p>
          </Card.Header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>
            
            {hasAnyRole(['super_admin', 'district_admin']) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School
                </label>
                <Select
                  value={filters.school}
                  onChange={(e) => handleFilterChange('school', e.target.value)}
                >
                  <option value="all">All Schools</option>
                  <option value="school1">Sample School 1</option>
                  <option value="school2">Sample School 2</option>
                </Select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <Select
                value={filters.class}
                onChange={(e) => handleFilterChange('class', e.target.value)}
              >
                {classes.map(cls => (
                  <option key={cls.value} value={cls.value}>
                    {cls.label}
                  </option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <Select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map(reportType => (
            <Card key={reportType.value} className="hover:shadow-md transition-shadow">
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg bg-${getReportColor(reportType.value)}-100`}>
                      <div className={`text-${getReportColor(reportType.value)}-600`}>
                        {getReportIcon(reportType.value)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {reportType.label}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Generate detailed {reportType.label.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Header>
              <div className="flex justify-between items-center">
                <Badge color={getReportColor(reportType.value)}>
                  PDF Format
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateReport(reportType.value)}
                  icon={<FiDownload />}
                >
                  Generate
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default Reports;