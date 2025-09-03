import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  ArrowLeft,
  UserPlus,
  ChevronDown,

} from 'lucide-react';
import { useI18n } from '../../i18n';
import EmployeeService from '../../services/EmployeeService';


const EmployeeList = () => {
  const { t, lang } = useI18n();
  const location = useLocation();

  // Auth removed

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showStatusSubmenu, setShowStatusSubmenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all employees
  const loadEmployees = async () => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    setSearchTerm(q);
    try {
      console.log('Loading employees...');
      let res;
      if (q) {
        try {
          res = await EmployeeService.searchEmployees(q);
        } catch (e) {
          console.warn('Search API failed; falling back to full list + client filter', e);
          res = await EmployeeService.getAllEmployees();
        }
      } else {
        res = await EmployeeService.getAllEmployees();
      }
      console.log('API Response:', res);

      // Ensure we always set an array, even if the response is unexpected
      const employeeData = Array.isArray(res.data) ? res.data :
        Array.isArray(res) ? res :
          res.data?.employees ? res.data.employees : [];

      // Generate usernames for employees that don't have one
      const processedEmployeeData = employeeData.map(emp => ({
        ...emp,
        // Ensure name field exists - combine firstName and lastName if name is not provided
        name: emp.name || (emp.firstName && emp.lastName ? `${emp.firstName} ${emp.lastName}` : emp.firstName || emp.lastName || 'N/A'),
        username: emp.username || (emp.firstName && emp.lastName ?
          `${emp.firstName.toLowerCase()}.${emp.lastName.toLowerCase()}` : 'N/A')
      }));

      console.log('Employee data to set:', processedEmployeeData);
      setEmployees(processedEmployeeData);
    } catch (err) {
      console.error('Error loading employees:', err);
      setError(`Failed to load employees: ${err.message}`);
      setEmployees([]); // Ensure employees is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(null);
        setShowStatusSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Filter employees based on search and filters
  const filteredEmployees = Array.isArray(employees) ? employees.filter(employee => {
    const matchesSearch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment;
    const matchesStatus = !selectedStatus || employee.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  }) : [];

  const departments = Array.isArray(employees) ? [...new Set(employees.map(emp => emp.department).filter(Boolean))] : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      case 'ON_LEAVE': return 'bg-yellow-100 text-yellow-800';
      case 'IN_VACATION_DAY': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'ACTIVE': return t('active') || 'Active';
      case 'INACTIVE': return t('inactive') || 'Inactive';
      case 'ON_LEAVE': return t('onLeave') || 'On Leave';
      case 'IN_VACATION_DAY': return t('inVacationDay') || 'In Vacation Day';
      default: return 'Unknown';
    }
  };

  // Update employee status
  const updateEmployeeStatus = async (employeeId, newStatus) => {
    try {
      await EmployeeService.updateEmployeeStatus(employeeId, newStatus);
      // Reload employees to reflect the status change
      await loadEmployees();
    } catch (err) {
      console.error('Error updating employee status:', err);
      setError(`Failed to update status: ${err.message}`);
    }
  };

  // Delete
  const deleteEmployee = async (id) => {
    if (!window.confirm(t('confirmDelete') || 'Delete this employee?')) return;
    try {
      await EmployeeService.deleteEmployee(id);
      setEmployees(prev => Array.isArray(prev) ? prev.filter(e => e.id !== id) : []);
    } catch (err) {
      setError(`Failed to delete: ${err.message}`);
    }
  };

  const EmployeeCard = ({ employee }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow overflow-visible relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {employee.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{employee.name || 'N/A'}</h3>
            <p className="text-sm text-slate-600">{employee.position || 'N/A'}</p>
            <p className="text-xs text-slate-500">{employee.employeeId || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
            {getStatusDisplayName(employee.status)}
          </span>
          {/* Always show the dropdown for testing - remove user role check temporarily */}
          <div className="relative dropdown-container">
            <button
              className="p-2 hover:bg-slate-100 rounded border border-gray-300"
              title="More options"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Dropdown clicked for employee:', employee.id);
                console.log('Current showDropdown state:', showDropdown);
                setShowDropdown(showDropdown === employee.id ? null : employee.id);
                setShowStatusSubmenu(null); // Reset status submenu when opening/closing main dropdown
              }}
            >
              <MoreVertical size={16} className="text-slate-400" />
            </button>

            {/* Dropdown menu with proper styling */}
            {showDropdown === employee.id && (
              <div
                className="absolute right-0 top-full mt-1 w-56 bg-white rounded-md shadow-xl z-[9999] border border-slate-200"
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '100%',
                  marginTop: '4px',
                  zIndex: 9999
                }}
              >
                <div className="py-1">
                  <Link
                    to={`/employees/edit/${employee.id}`}
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    onClick={() => setShowDropdown(null)}
                  >
                    <Edit size={14} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />
                    {t('editEmployee') || 'Edit Employee'}
                  </Link>

                  {/* Status Update Dropdown */}
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => setShowStatusSubmenu(showStatusSubmenu === employee.id ? null : employee.id)}
                    className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors text-left"
                  >
                    <span className={`w-2 h-2 bg-slate-400 rounded-full ${lang === 'ar' ? 'ml-2' : 'mr-2'}`}></span>
                    {t('updateStatus') || 'Update Status'}
                    <ChevronDown size={14} className={`${lang === 'ar' ? 'mr-auto' : 'ml-auto'} transition-transform ${showStatusSubmenu === employee.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Status Options - Only show when submenu is open */}
                  {showStatusSubmenu === employee.id && (
                    <div className={`${lang === 'ar' ? 'mr-4 border-r-2' : 'ml-4 border-l-2'} border-slate-100`}>
                      <button
                        onClick={() => {
                          setShowDropdown(null);
                          setShowStatusSubmenu(null);
                          updateEmployeeStatus(employee.id, 'ACTIVE');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors text-left"
                      >
                        <span className={`w-2 h-2 bg-green-500 rounded-full ${lang === 'ar' ? 'ml-2' : 'mr-2'}`}></span>
                        {t('setActive') || 'Set Active'}
                      </button>

                      <button
                        onClick={() => {
                          setShowDropdown(null);
                          setShowStatusSubmenu(null);
                          updateEmployeeStatus(employee.id, 'INACTIVE');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <span className={`w-2 h-2 bg-red-500 rounded-full ${lang === 'ar' ? 'ml-2' : 'mr-2'}`}></span>
                        {t('setInactive') || 'Set Inactive'}
                      </button>

                      <button
                        onClick={() => {
                          setShowDropdown(null);
                          setShowStatusSubmenu(null);
                          updateEmployeeStatus(employee.id, 'ON_LEAVE');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors text-left"
                      >
                        <span className={`w-2 h-2 bg-yellow-500 rounded-full ${lang === 'ar' ? 'ml-2' : 'mr-2'}`}></span>
                        {t('setOnLeave') || 'Set On Leave'}
                      </button>

                      <button
                        onClick={() => {
                          setShowDropdown(null);
                          setShowStatusSubmenu(null);
                          updateEmployeeStatus(employee.id, 'IN_VACATION_DAY');
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors text-left"
                      >
                        <span className={`w-2 h-2 bg-blue-500 rounded-full ${lang === 'ar' ? 'ml-2' : 'mr-2'}`}></span>
                        {t('setInVacationDay') || 'Set In Vacation Day'}
                      </button>
                    </div>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      setShowDropdown(null);
                      deleteEmployee(employee.id);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <Trash2 size={14} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />
                    {t('deleteEmployee') || 'Delete Employee'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-600">
          <Mail size={14} className="mr-2" />
          {employee.email || 'N/A'}
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <Building2 size={14} className="mr-2" />
          {employee.department || 'N/A'}
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <Calendar size={14} className="mr-2" />
          {employee.joiningDate ? `Joined ${new Date(employee.joiningDate).toLocaleDateString()}` : 'Join date not available'}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => {
            setSelectedEmployee(employee);
            setShowDetailsModal(true);
          }}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
        >
          <Eye size={14} className="mr-1" />
          {t('view') || 'View'}
          <ChevronDown size={14} className="ml-1" />
        </button>
        {/* Admin-only actions removed with auth */}
      </div>
    </motion.div>
  );

  const EmployeeDetailsModal = () => (
    <AnimatePresence>
      {showDetailsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">{t('employeeDetails') || 'Employee Details'}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">
                    {selectedEmployee.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-800">{selectedEmployee.name || 'N/A'}</h3>
                  <p className="text-slate-600 text-lg">{selectedEmployee.position || 'N/A'}</p>
                  <p className="text-slate-500 text-sm">{t('employeeId') || 'Employee ID'}: {selectedEmployee.employeeId || 'N/A'}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(selectedEmployee.status)}`}>
                    {getStatusDisplayName(selectedEmployee.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800">{t('contactInformation') || 'Contact Information'}</h4>
                  <div className="space-y-3">
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <Mail size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-700">{t('email') || 'Email'}:</span>
                      <span className="text-slate-600">{selectedEmployee.email || 'N/A'}</span>
                    </div>
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <Phone size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-700">{t('phone') || 'Phone'}:</span>
                      <span className="text-slate-600">{selectedEmployee.phone || 'N/A'}</span>
                    </div>
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <MapPin size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-700">{t('address') || 'Address'}:</span>
                      <span className="text-slate-600">{selectedEmployee.address || 'N/A'}</span>
                    </div>
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <User size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-700">{t('username') || 'Username'}:</span>
                      <span className="text-slate-600">{selectedEmployee.username || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800">{t('employmentDetails') || 'Employment Details'}</h4>
                  <div className="space-y-3">
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <User size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-700">{t('employeeId') || 'Employee ID'}:</span>
                      <span className="text-slate-600">{selectedEmployee.employeeId || 'N/A'}</span>
                    </div>
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <Building2 size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-700">{t('department') || 'Department'}:</span>
                      <span className="text-slate-600">{selectedEmployee.department || 'N/A'}</span>
                    </div>
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <Building2 size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-700">{t('position') || 'Position'}:</span>
                      <span className="text-slate-600">{selectedEmployee.position || 'N/A'}</span>
                    </div>
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <Calendar size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-700">{t('joiningDate') || 'Joining Date'}:</span>
                      <span className="text-slate-600">
                        {selectedEmployee.joiningDate ? new Date(selectedEmployee.joiningDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800">💰 {t('financialDetails') || 'Financial Details'}</h4>
                  <div className="space-y-3">
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <span className="text-green-600">💰</span>
                      <span className="font-medium text-slate-700">{t('salary') || 'Salary'}:</span>
                      <span className="text-green-600 font-semibold">{selectedEmployee.salary?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <span className="text-green-600">🎁</span>
                      <span className="font-medium text-slate-700">{t('bonus') || 'Bonus'}:</span>
                      <span className="text-green-600 font-semibold">{selectedEmployee.bonus?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800">📅 {t('additionalInfo') || 'Additional Info'}</h4>
                  <div className="space-y-3">
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <span>🏖️</span>
                      <span className="font-medium text-slate-700">{t('annualVacationDays') || 'Annual Vacation Days'}:</span>
                      <span className="text-slate-600">{selectedEmployee.annualVacationDays || 'N/A'}</span>
                    </div>
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <span>📅</span>
                      <span className="font-medium text-slate-700">{t('createdAt') || 'Created At'}:</span>
                      <span className="text-slate-600">
                        {selectedEmployee.createdAt ? new Date(selectedEmployee.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <span>🔄</span>
                      <span className="font-medium text-slate-700">{t('lastUpdated') || 'Last Updated'}:</span>
                      <span className="text-slate-600">
                        {selectedEmployee.updatedAt ? new Date(selectedEmployee.updatedAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    {selectedEmployee.leavingDate && (
                      <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                        <span className="text-red-600">🚪</span>
                        <span className="font-medium text-slate-700">{t('leavingDate') || 'Leaving Date'}:</span>
                        <span className="text-red-600 font-medium">
                          {new Date(selectedEmployee.leavingDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className={`flex ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <Link
                    to={`/employees/edit/${selectedEmployee.id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    {t('editEmployee') || 'Edit Employee'}
                  </Link>
                  <button className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                    {t('generateReport') || 'Generate Report'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{t('employees') || 'Employees'}</h1>
            <p className="text-slate-600 mt-1">{t('employeeManagementDesc') || "Manage your organization's workforce"}</p>
          </div>

          <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-6' : 'space-x-6'} mr-2`}>
            <button
              onClick={() => setShowDetailsModal(true)}
            >
              <Link
                to="/"
                aria-label={t('backToHome')}
                className="inline-flex items-center gap-2 h-9 px-3 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <ArrowLeft size={16} className="shrink-0" />
                <span className="hidden sm:inline">{t('backToHome')}</span>
              </Link>
            </button>

            {/* Add Employee Button - Always visible */}
            <div className="ml-4">
              <Link
                to="/employees/add"
                className={`btn btn-outline-primary flex items-center justify-center px-5 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors ${lang === 'ar' ? 'space-x-reverse space-x-1' : 'space-x-1'}`}
              >
                <UserPlus size={16} className={lang === 'ar' ? 'ml-1' : 'mr-1'} />
                {t('addEmployee') || 'Add Employee'}
              </Link>
            </div>

            {/* Admin/HR only features */}
            {/* Admin/HR features removed with auth */}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder={t('searchEmployees') || 'Search Employees...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Filter by department"
            >
              <option value="">{t('allDepartments') || 'All Departments'}</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Filter by status"
            >
              <option value="">{t('allStatus') || 'All Status'}</option>
              <option value="ACTIVE">{t('active') || 'Active'}</option>
              <option value="INACTIVE">{t('inactive') || 'Inactive'}</option>
              <option value="ON_LEAVE">{t('onLeave') || 'On Leave'}</option>
              <option value="IN_VACATION_DAY">In Vacation Day</option>
            </select>

            <button className="flex items-center justify-center px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter size={16} className="mr-2" />
              {t('moreFilters') || 'More Filters'}
            </button>
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EmployeeCard employee={employee} />
            </motion.div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <User size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">{t('noEmployeesFound') || 'No employees found'}</h3>
            <p className="text-slate-500">{t('adjustSearchCriteria') || 'Try adjusting your search criteria'}</p>
          </div>
        )}
      </div>

      <EmployeeDetailsModal />
    </div>
  );
};

export default EmployeeList;
