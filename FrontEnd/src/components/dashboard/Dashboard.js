import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Building2,
  Calendar,
  Activity,
  DollarSign,
  FileText,
  Search,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n';
import EmployeeService from '../../services/EmployeeService';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, LineChart, Line
} from 'recharts';

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  // Keep dateRange and refreshing states per request
  const [dateRange, setDateRange] = useState('month');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    byDepartment: {},
    bySalaryRange: {},
    recentEmployees: [],
    performanceMetrics: [],
    trendData: [],
    growthRate: null,
    avgSalary: 0,
    totalPayroll: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = { name: 'User', avatar: null };

  const CHART_COLORS = {
    primary: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4']
  };

  const loadDashboardData = async (showRefreshAnimation = false) => {
    try {
      if (showRefreshAnimation) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const response = await EmployeeService.getAllEmployees();
      const employees = Array.isArray(response?.data) ? response.data
        : Array.isArray(response) ? response
          : Array.isArray(response?.data?.employees) ? response.data.employees
            : [];

      const totalEmployees = employees.length;
      const prevMonthTotal = Math.floor(totalEmployees * 0.95);
      const growthRate = ((totalEmployees - prevMonthTotal) / Math.max(prevMonthTotal, 1) * 100).toFixed(1);

      const byDepartment = employees.reduce((acc, emp) => {
        const dept = emp.department || 'Unknown';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {});

      const bySalaryRange = employees.reduce((acc, emp) => {
        const salary = emp.salary || 0;
        let range;
        if (salary < 30000) range = '< 30K';
        else if (salary < 50000) range = '30K-50K';
        else if (salary < 80000) range = '50K-80K';
        else if (salary < 120000) range = '80K-120K';
        else range = '120K+';
        acc[range] = (acc[range] || 0) + 1;
        return acc;
      }, {});

      const recentEmployees = employees
        .slice()
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 10);

      const performanceMetrics = Object.keys(byDepartment).map(dept => ({
        department: dept,
        productivity: Math.floor(Math.random() * 30) + 70,
        satisfaction: Math.floor(Math.random() * 20) + 75,
        retention: Math.floor(Math.random() * 15) + 85
      }));

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const trendData = months.map((month, idx) => ({
        month,
        employees: Math.floor(totalEmployees * (0.85 + idx * 0.03)),
        hires: Math.floor(Math.random() * 15) + 5,
        departures: Math.floor(Math.random() * 5) + 2
      }));

      setDashboardData({
        totalEmployees,
        growthRate,
        byDepartment,
        bySalaryRange,
        recentEmployees,
        performanceMetrics,
        trendData,
        avgSalary: employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / Math.max(employees.length, 1),
        totalPayroll: employees.reduce((sum, emp) => sum + (emp.salary || 0), 0)
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => loadDashboardData(true), 300000);
    return () => clearInterval(interval);
  }, []);

  // Removed no-op setDateRange effect; dateRange is now controlled via UI below

  const stats = useMemo(() => [
    {
      label: t('totalEmployees'),
      value: dashboardData.totalEmployees.toLocaleString(),
      change: dashboardData.growthRate ? `+${dashboardData.growthRate}%` : null,
      changeType: 'positive',
      icon: Users,
      color: 'blue',
      description: t('activeEmployees')
    },
    {
      label: t('departments'),
      value: Object.keys(dashboardData.byDepartment || {}).length.toString(),
      change: null,
      icon: Building2,
      color: 'purple',
      description: t('operatingUnits')
    },
    {
      label: t('avgSalary'),
      value: `$${Math.round(dashboardData.avgSalary || 0).toLocaleString()}`,
      change: '+2.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green',
      description: t('perEmployee')
    },
    {
      label: t('newHires'),
      value: (dashboardData.recentEmployees?.length || 0).toString(),
      change: '+15%',
      changeType: 'positive',
      icon: UserPlus,
      color: 'orange',
      description: t('thisMonth')
    }
  ], [dashboardData, t]);

  const recentActivities = useMemo(() => {
    return dashboardData.recentEmployees.slice(0, 5).map(emp => ({
      id: emp.id,
      type: 'hire',
      action: 'New employee joined',
      employee: emp.name,
      department: emp.department,
      time: new Date(emp.createdAt || Date.now()).toLocaleDateString()
    }));
  }, [dashboardData.recentEmployees]);

  const filteredEmployees = useMemo(() => {
    let filtered = dashboardData.recentEmployees || [];
    if (searchQuery) {
      filtered = filtered.filter(emp =>
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }
    return filtered;
  }, [dashboardData.recentEmployees, searchQuery, selectedDepartment]);

  const StatCard = ({ stat, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8">
        <div className={`w-full h-full rounded-full opacity-10 bg-gradient-to-br 
          ${stat.color === 'blue' ? 'from-blue-400 to-blue-600' :
            stat.color === 'green' ? 'from-green-400 to-green-600' :
              stat.color === 'purple' ? 'from-purple-400 to-purple-600' :
                'from-orange-400 to-orange-600'}`}
        />
      </div>
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg inline-flex
            ${stat.color === 'blue' ? 'bg-blue-100' :
              stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'purple' ? 'bg-purple-100' :
                  'bg-orange-100'}`}
          >
            <stat.icon className={`w-6 h-6 
              ${stat.color === 'blue' ? 'text-blue-600' :
                stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'}`}
            />
          </div>
          {stat.change && (
            <span className={`flex items-center text-sm font-semibold
              ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}
            >
              {stat.changeType === 'positive' ?
                <ArrowUpRight className="w-4 h-4 mr-1" /> :
                <ArrowDownRight className="w-4 h-4 mr-1" />
              }
              {stat.change}
            </span>
          )}
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
        <p className="text-sm font-medium text-slate-600">{stat.label}</p>
        <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, children, action }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {action && (
          <div className="flex items-center space-x-2">
            {action}
          </div>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="w-20 h-20 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">{t('loadingDashboardData')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Keep AnimatePresence usage around error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between"
              >
                <span className="text-red-700">{error}</span>
                <button
                  onClick={() => loadDashboardData()}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  {t('retry')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start md:items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  {t('dashboard')}, {user?.name}! 👋
                </h1>
                <div className="flex items-center gap-3 text-slate-600">
                  <p>{t('hereIsOrganizationOverview')}</p>
                  <span className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {dateRange === 'week' && t('thisWeek')}
                    {dateRange === 'month' && t('thisMonth')}
                    {dateRange === 'quarter' && t('thisQuarter')}
                    {dateRange === 'year' && t('thisYear')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  to="/"
                  aria-label={t('backToHome')}
                  className="inline-flex items-center gap-2 h-9 px-3 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <ArrowLeft size={16} className="shrink-0" />
                  <span className="hidden sm:inline">{t('backToHome')}</span>
                </Link>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="h-9 px-3 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  style={{ minWidth: '140px' }}
                >
                  <option value="week">{t('thisWeek')}</option>
                  <option value="month">{t('thisMonth')}</option>
                  <option value="quarter">{t('thisQuarter')}</option>
                  <option value="year">{t('thisYear')}</option>
                </select>
                <button
                  onClick={() => loadDashboardData(true)}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  disabled={refreshing}
                  aria-label={t('refresh') || 'Refresh'}
                  title={t('refresh') || 'Refresh'}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard
              title={t('employeesByDepartment')}
              action={
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  {t('viewDetails')}
                </button>
              }
            >
              {Object.keys(dashboardData.byDepartment || {}).length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(dashboardData.byDepartment).map(([name, value]) => ({
                        name,
                        value,
                        percentage: ((value / dashboardData.totalEmployees) * 100).toFixed(1)
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(dashboardData.byDepartment).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-slate-500">{t('noDataAvailable')}</p>
                </div>
              )}
            </ChartCard>

            <ChartCard
              title={t('salaryDistribution')}
              action={
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  {t('exportData')}
                </button>
              }
            >
              {Object.keys(dashboardData.bySalaryRange || {}).length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(dashboardData.bySalaryRange).map(([name, value]) => ({ name, value }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748B' }} />
                    <YAxis tick={{ fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                      {Object.entries(dashboardData.bySalaryRange).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-slate-500">{t('noDataAvailable')}</p>
                </div>
              )}
            </ChartCard>
          </div>

          <div className="mb-8">
            <ChartCard
              title={t('employeeTrends')}
              action={
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">{t('totalEmployees')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">{t('newHires')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">{t('departures')}</span>
                  </div>
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fill: '#64748B' }} />
                  <YAxis tick={{ fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="employees"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hires"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="departures"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-800">{t('recentEmployees')}</h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate('/employees/add')}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <UserPlus className="w-4 h-4 inline mr-1" />
                        {t('addNew')}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('searchEmployees')}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">{t('allDepartments')}</option>
                      {Object.keys(dashboardData.byDepartment || {}).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {filteredEmployees.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {t('employee')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {t('department')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {t('position')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {t('salary')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {t('actions')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {filteredEmployees.map((emp, index) => (
                          <motion.tr
                            key={emp.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                    {emp.name?.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                                  <div className="text-sm text-slate-500">
                                    {new Date(emp.createdAt || Date.now()).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {emp.department}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                              {emp.position}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                              ${emp.salary?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-900 transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-slate-600 hover:text-slate-900 transition-colors">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center">
                      <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">{t('noEmployeesFound')}</p>
                    </div>
                  )}
                </div>

                {filteredEmployees.length > 0 && (
                  <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      {t('showing')} {filteredEmployees.length} {t('of')} {dashboardData.totalEmployees} {t('employees')}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      {t('viewAll')} →
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">{t('performanceMetrics')}</h3>
                </div>
                <div className="p-6 space-y-4">
                  {dashboardData.performanceMetrics?.slice(0, 3).map((metric, index) => (
                    <motion.div
                      key={metric.department}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">{metric.department}</span>
                        <span className="text-sm text-slate-500">{metric.productivity}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.productivity}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">{t('quickActions')}</h3>
                </div>
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => navigate('/employees/add')}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left group"
                  >
                    <UserPlus className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-700">{t('addNewEmployee')}</span>
                  </button>
                  <button
                    onClick={() => navigate('/departments')}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left group"
                  >
                    <Building2 className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-700">{t('manageDepartments')}</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left group">
                    <Calendar className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-700">{t('scheduleMeeting')}</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left group">
                    <FileText className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-700">{t('generateReport')}</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">{t('recentActivities')}</h3>
                </div>
                <div className="p-6">
                  {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3"
                        >
                          <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <UserPlus className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-700">
                              <span className="font-medium">{activity.employee}</span> joined
                            </p>
                            <p className="text-xs text-slate-500">{activity.department} • {activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">{t('noRecentActivities')}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Footer spacer */}

    </>
  );
};

export default EnhancedDashboard;
