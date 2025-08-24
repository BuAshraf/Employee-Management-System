
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import emailjs from 'emailjs-com';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  Building2,
  DollarSign,
  Clock,
  FileText,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { useI18n } from '../../i18n';

// Helper to get admin email from settings (localStorage)
function getAdminEmail() {
  const settings = localStorage.getItem('ems_settings');
  if (settings) {
    try {
      return JSON.parse(settings).companyEmail || 'employeemanagementsysteme@gmail.com';
    } catch {
      return 'employeemanagementsysteme@gmail.com';
    }
  }
  return 'employeemanagementsysteme@gmail.com';
}

const Reports = () => {
  const { t, lang } = useI18n();
  // Auth removed
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  // Popup state for report sent
  const [showReportPopup, setShowReportPopup] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await EmployeeService.getAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { id: 'overview', name: t('overview') || 'Overview', icon: BarChart3 },
    { id: 'department', name: t('departmentAnalysis') || 'Department Analysis', icon: Building2 },
    { id: 'salary', name: t('salaryDistribution') || 'Salary Distribution', icon: DollarSign },
    { id: 'trend', name: t('hiringTrends') || 'Hiring Trends', icon: TrendingUp },
    { id: 'attendance', name: t('attendanceReport') || 'Attendance Report', icon: Clock }
  ];

  const periods = [
    { value: 'week', label: t('thisWeek') || 'This Week' },
    { value: 'month', label: t('thisMonth') || 'This Month' },
    { value: 'quarter', label: t('thisQuarter') || 'This Quarter' },
    { value: 'year', label: t('thisYear') || 'This Year' }
  ];

  const generateDepartmentReport = () => {
    const deptStats = employees.reduce((acc, emp) => {
      const dept = emp.department || 'Unknown';
      if (!acc[dept]) {
        acc[dept] = {
          department: dept,
          count: 0,
          totalSalary: 0,
          avgSalary: 0,
        };
      }
      acc[dept].count++;
      acc[dept].totalSalary += parseFloat(emp.salary) || 0;
      acc[dept].avgSalary = acc[dept].totalSalary / acc[dept].count;
      return acc;
    }, {});

    return Object.values(deptStats);
  };

  const generateSalaryReport = () => {
    const salaryRanges = {
      '< $30K': { range: '< $30K', count: 0, totalBonus: 0 },
      '$30K - $50K': { range: '$30K - $50K', count: 0, totalBonus: 0 },
      '$50K - $70K': { range: '$50K - $70K', count: 0, totalBonus: 0 },
      '$70K - $100K': { range: '$70K - $100K', count: 0, totalBonus: 0 },
      '> $100K': { range: '> $100K', count: 0, totalBonus: 0 },
    };

    employees.forEach(emp => {
      const salary = parseFloat(emp.salary) || 0;
      const bonus = parseFloat(emp.bonus) || 0;

      if (salary < 30000) {
        salaryRanges['< $30K'].count++;
        salaryRanges['< $30K'].totalBonus += bonus;
      } else if (salary < 50000) {
        salaryRanges['$30K - $50K'].count++;
        salaryRanges['$30K - $50K'].totalBonus += bonus;
      } else if (salary < 70000) {
        salaryRanges['$50K - $70K'].count++;
        salaryRanges['$50K - $70K'].totalBonus += bonus;
      } else if (salary < 100000) {
        salaryRanges['$70K - $100K'].count++;
        salaryRanges['$70K - $100K'].totalBonus += bonus;
      } else {
        salaryRanges['> $100K'].count++;
        salaryRanges['> $100K'].totalBonus += bonus;
      }
    });

    return Object.values(salaryRanges);
  };

  const generateJoiningTrendReport = () => {
    const monthlyJoins = employees.reduce((acc, emp) => {
      if (emp.joiningDate) {
        const date = new Date(emp.joiningDate);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(monthlyJoins)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  };

  const departmentData = generateDepartmentReport();
  const salaryData = generateSalaryReport();
  const joiningTrendData = generateJoiningTrendReport();

  // Calculate overview stats from real data
  const overviewStats = [
    {
      label: t('totalEmployees') || 'Total Employees',
      value: employees.length.toString(),
      change: '+12%',
      positive: true
    },
    {
      label: t('activeDepartments') || 'Active Departments',
      value: [...new Set(employees.map(emp => emp.department).filter(Boolean))].length.toString(),
      change: '+8%',
      positive: true
    },
    {
      label: t('avgSalary') || 'Avg. Salary',
      value: `$${employees.length > 0 ? Math.round(employees.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0) / employees.length).toLocaleString() : '0'}`,
      change: '+5%',
      positive: true
    },
    {
      label: t('turnoverRate') || 'Turnover Rate',
      value: '3.2%',
      change: '-1.1%',
      positive: true
    }
  ];

  const StatCard = ({ stat }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'
              }`}>
              {stat.change}
            </span>
            <span className="text-slate-500 text-sm ml-1">{t('vsLastPeriod') || 'vs last period'}</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${stat.positive ? 'bg-green-100' : 'bg-red-100'
          }`}>
          <TrendingUp className={`w-6 h-6 ${stat.positive ? 'text-green-600' : 'text-red-600'
            }`} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    );
  };

  // Email report to admin
  const handleSendReport = async () => {
    const adminEmail = getAdminEmail();
    try {
      await emailjs.send(
        'service_of80oqi',
        'template_m6z7hue',
        {
          from_name: 'EMS Reports',
          message: 'Automated report sent from EMS Reports page.',
          screenshot: '',
          email: adminEmail,
        },
        'LD4XBjznzfQqThmz2',
      );
      setShowReportPopup(true);
      setTimeout(() => setShowReportPopup(false), 3000);
    } catch (err) {
      alert('Failed to send report: ' + err.message);
    }
  };

  // Export handlers
  const getCurrentReportData = () => {
    if (selectedReport === 'department') return departmentData;
    if (selectedReport === 'salary') return salaryData;
    if (selectedReport === 'trend') return joiningTrendData;
    return [];
  };

  const handleExportExcel = () => {
    const data = getCurrentReportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, 'EMS_Report.xlsx');
  };

  const handleExportCSV = () => {
    const data = getCurrentReportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EMS_Report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const data = getCurrentReportData();
    const doc = new jsPDF();
    let columns = [];
    if (selectedReport === 'department') {
      columns = [
        { header: 'Department', dataKey: 'department' },
        { header: 'Count', dataKey: 'count' },
        { header: 'Avg Salary', dataKey: 'avgSalary' },
      ];
    } else if (selectedReport === 'salary') {
      columns = [
        { header: 'Range', dataKey: 'range' },
        { header: 'Count', dataKey: 'count' },
        { header: 'Total Bonus', dataKey: 'totalBonus' },
      ];
    } else if (selectedReport === 'trend') {
      columns = [
        { header: 'Month', dataKey: 'month' },
        { header: 'Count', dataKey: 'count' },
      ];
    }
    autoTable(doc, { columns, body: data });
    doc.save('EMS_Report.pdf');
  };

  return (
    <div className="min-h-screen bg-slate-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{t('reportsAnalytics') || 'Reports & Analytics'}</h1>
            <p className="text-slate-600 mt-1">{t('reportsSubtitle') || 'Comprehensive insights into your organization'}</p>
          </div>

          <div className="flex space-x-3">
            <Link
              to="/"
              className="flex items-center px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              {t('backToHome') || 'Back to Home'}
            </Link>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleSendReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Mail size={16} className="mr-2" />
              {t('emailReport') || 'Email Report'}
            </button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-wrap gap-3">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${selectedReport === type.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
              >
                <type.icon size={16} />
                <span>{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        {selectedReport === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {overviewStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StatCard stat={stat} />
                </motion.div>
              ))}
            </div>

            {/* Overview Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Department Overview Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">{t('departmentOverview') || 'Department Overview'}</h3>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Download size={14} className="mr-2" />
                    {t('export') || 'Export'}
                  </button>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name={t('employeeCount') || 'Employee Count'} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Hiring Trend Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">{t('hiringTrends') || 'Hiring Trends'}</h3>
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Download size={14} className="mr-2" />
                    {t('export') || 'Export'}
                  </button>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={joiningTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} name={t('newHires') || 'New Hires'} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Department Report */}
        {selectedReport === 'department' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">{t('departmentEmployeeCount') || 'Department Employee Count'}</h3>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Download size={14} className="mr-2" />
                    {t('export') || 'Export'}
                  </button>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name={t('employeeCount') || 'Employee Count'} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('departmentSummary') || 'Department Summary'}</h3>

                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <motion.div
                      key={dept.department || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800">{dept.department}</h4>
                          <p className="text-sm text-slate-600">{dept.count} {t('employees') || 'employees'}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-600">{t('avgSalary') || 'Avg Salary'}</p>
                        <p className="font-semibold text-slate-800">
                          ${dept.avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Salary Report */}
        {selectedReport === 'salary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">{t('salaryRangeDistribution') || 'Salary Range Distribution'}</h3>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Download size={14} className="mr-2" />
                    {t('export') || 'Export'}
                  </button>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" name={t('employeeCount') || 'Employee Count'} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('salaryStatistics') || 'Salary Statistics'}</h3>

                <div className="space-y-4">
                  {salaryData.map((range, index) => (
                    <motion.div
                      key={range.range || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800">{range.range}</h4>
                          <p className="text-sm text-slate-600">{range.count} {t('employees') || 'employees'}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-600">{t('totalBonus') || 'Total Bonus'}</p>
                        <p className="font-semibold text-slate-800">
                          ${range.totalBonus.toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hiring Trend Report */}
        {selectedReport === 'trend' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">{t('monthlyHiringTrends') || 'Monthly Hiring Trends'}</h3>
              <button
                onClick={handleExportPDF}
                className="flex items-center px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download size={14} className="mr-2" />
                {t('export') || 'Export'}
              </button>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={joiningTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} name={t('newHires') || 'New Hires'} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Attendance Report */}
        {selectedReport === 'attendance' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">{t('attendanceReport') || 'Attendance Report'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-800">94.5%</p>
                <p className="text-slate-600">{t('attendanceRate') || 'Attendance Rate'}</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-800">2.1</p>
                <p className="text-slate-600">{t('avgDaysOff') || 'Avg. Days Off'}</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <Users className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-800">23</p>
                <p className="text-slate-600">{t('lateArrivals') || 'Late Arrivals'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('exportOptions') || 'Export Options'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExportExcel}
              className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FileText size={18} className="mr-2" />
              {t('exportToExcel') || 'Export to Excel'}
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <FileText size={18} className="mr-2" />
              {t('exportToPDF') || 'Export to PDF'}
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FileText size={18} className="mr-2" />
              {t('exportToCSV') || 'Export to CSV'}
            </button>
          </div>
        </div>
      </div>

      {/* Report sent popup */}
      {showReportPopup && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-6 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-lg shadow-lg z-50"
        >
          {t('reportSent') || 'Report sent successfully!'}
        </motion.div>
      )}
    </div>
  );
};

export default Reports;