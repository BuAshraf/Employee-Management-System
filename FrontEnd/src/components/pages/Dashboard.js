import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Upload,
  Search,
  ChevronRight,
  UserPlus,
  FileSpreadsheet
} from 'lucide-react';

// Mock data generator
const generateMockData = () => {
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const positions = ['Manager', 'Senior Developer', 'Developer', 'Designer', 'Analyst'];

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    firstName: ['John', 'Jane', 'Mike', 'Sarah', 'David'][Math.floor(Math.random() * 5)],
    lastName: ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 5)],
    email: `employee${i + 1}@company.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
    salary: Math.floor(Math.random() * 80000) + 40000,
    bonus: Math.floor(Math.random() * 20000),
    joiningDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), 1),
    profileImage: `https://i.pravatar.cc/150?img=${i + 1}`,
    status: Math.random() > 0.1 ? 'active' : 'on-leave'
  }));
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        {change && (
          <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}> 
            <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(change)}% from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// Department Distribution Chart
const DepartmentChart = ({ employees }) => {
  const deptCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const maxCount = Math.max(1, ...Object.values(deptCounts));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
      <div className="space-y-4">
        {Object.entries(deptCounts).map(([dept, count]) => (
          <div key={dept}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{dept}</span>
              <span className="text-gray-600">{count} employees</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Employee Card Component
const EmployeeCard = ({ employee, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
  >
    <div className="flex items-center space-x-4">
      <img
        src={employee.profileImage}
        alt={`${employee.firstName} ${employee.lastName}`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors">
          {employee.firstName} {employee.lastName}
        </h4>
        <p className="text-sm text-gray-600">{employee.position}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-violet-600 transition-colors" />
    </div>
    <div className="mt-3 flex items-center justify-between text-sm">
      <span className="text-gray-600">{employee.department}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.status === 'active'
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700'
        }`}>
        {employee.status}
      </span>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    setEmployees(generateMockData());
  }, []);

  // Calculate stats
  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgSalary = totalEmployees === 0 ? 0 : Math.round(totalSalary / totalEmployees);
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      searchTerm === '' ||
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const departments = ['all', ...new Set(employees.map(emp => emp.department))];

  const handleExport = () => {
    // Simulate CSV export
    const csv = [
      ['ID', 'Name', 'Email', 'Department', 'Position', 'Salary', 'Status'],
      ...employees.map(emp => [
        emp.id,
        `${emp.firstName} ${emp.lastName}`,
        emp.email,
        emp.department,
        emp.position,
        emp.salary,
        emp.status
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                EMS Pro
              </h1>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-900 font-medium hover:text-violet-600 transition-colors">Dashboard</a>
                <a href="#" className="text-gray-600 hover:text-violet-600 transition-colors">Employees</a>
                <a href="#" className="text-gray-600 hover:text-violet-600 transition-colors">Departments</a>
                <a href="#" className="text-gray-600 hover:text-violet-600 transition-colors">Reports</a>
              </div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h2>
          <p className="text-gray-600 mt-2">Here's what's happening with your team today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Employees"
            value={totalEmployees}
            change={12}
            color="bg-gradient-to-br from-violet-500 to-purple-600"
          />
          <StatCard
            icon={Users}
            title="Active Employees"
            value={activeEmployees}
            change={8}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
          />
          <StatCard
            icon={DollarSign}
            title="Avg. Salary"
            value={`$${avgSalary.toLocaleString()}`}
            change={5}
            color="bg-gradient-to-br from-blue-500 to-cyan-600"
          />
          <StatCard
            icon={Calendar}
            title="New This Month"
            value="8"
            change={-15}
            color="bg-gradient-to-br from-orange-500 to-red-600"
          />
        </div>

        {/* Charts and Employee List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Chart */}
          <div className="lg:col-span-1">
            <DepartmentChart employees={employees} />
          </div>

          {/* Employee List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              {/* Search and Filters */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedDepartment}
                    onChange={e => setSelectedDepartment(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Import</span>
                    </button>
                    <button
                      onClick={handleExport}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Employee Cards */}
              <div className="p-6">
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredEmployees.slice(0, 10).map(employee => (
                    <EmployeeCard key={employee.id} employee={employee} onClick={() => console.log('View employee:', employee.id)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Import Employees</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drop your CSV or Excel file here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                Browse Files
              </button>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
