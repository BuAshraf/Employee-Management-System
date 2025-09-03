import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Plus,
  Edit,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft
} from 'lucide-react';
import { useI18n } from '../../i18n';

const DepartmentList = () => {
  const { t } = useI18n();
  const user = { role: 'viewer' };
  const [departments, setDepartments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  // removed unused selectedDepartment state
  const [isLoading, setIsLoading] = useState(true);

  // Function to get department translation using i18n system
  const getDepartmentTranslation = (deptName) => {
    const key = `departmentNames.${deptName.toLowerCase().replace(/\s+/g, '')}`;
    return t(key) !== key ? t(key) : deptName;
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/departments');
        const data = await response.json();
        // Convert the departments object to an array
        if (data.departments) {
          const departmentsArray = Object.entries(data.departments).map(([name, dept]) => ({
            id: name,
            name: name,
            head: dept.head,
            manager: dept.head, // Use head as manager
            budget: dept.budget_allocated || 0,
            budgetAllocated: dept.budget_allocated || 0,
            budgetSpent: dept.budget_spent || 0,
            budgetRemaining: dept.budget_remaining || 0,
            employeeCount: dept.employees || 0,
            status: dept.status?.toLowerCase() || 'active',
            description: dept.description || '',
            growth: Math.floor(Math.random() * 21) - 10, // Random growth between -10 and 10
            location: 'Main Office', // Default location
            established: '2020-01-01' // Default established date
          }));
          setDepartments(departmentsArray);
        } else {
          setDepartments([]);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const totalEmployees = departments?.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0) || 0;
  const totalBudget = departments?.reduce((sum, dept) => sum + (dept.budget || 0), 0) || 0;
  const activeDepartments = departments?.filter(dept => dept.status === 'active').length || 0;

  const DepartmentCard = ({ department }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">
              {getDepartmentTranslation(department.name)}
            </h3>
            <p className="text-sm text-slate-600">{department.manager}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${department.growth > 0 ? 'bg-green-100 text-green-700' :
              department.growth < 0 ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
            }`}>
            {department.growth > 0 ? <TrendingUp size={12} className="mr-1" /> :
              department.growth < 0 ? <TrendingDown size={12} className="mr-1" /> :
                <Minus size={12} className="mr-1" />}
            {Math.abs(department.growth)}%
          </div>

          {(user?.role === 'admin' || user?.role === 'hr') && (
            <div className="relative">
              <button className="p-1 hover:bg-slate-100 rounded">
                <MoreVertical size={16} className="text-slate-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{department.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Users size={16} className="text-slate-500 mr-1" />
          </div>
          <p className="text-lg font-semibold text-slate-800">{department.employeeCount}</p>
          <p className="text-xs text-slate-500">{t('employees')}</p>
        </div>

        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <p className="text-lg font-semibold text-slate-800">
            ${(department.budget / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-slate-500">{t('budget')}</p>
        </div>
      </div>

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>{t('location')}:</span>
            <span>{department.location}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('established')}:</span>
            <span>{new Date(department.established).getFullYear()}</span>
          </div>
        </div>

  {(user?.role === 'admin' || user?.role === 'hr') && (
        <div className="flex space-x-2 mt-4 pt-4 border-t border-slate-100">
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
            <Edit size={14} className="mr-1" />
            {t('edit')}
          </button>
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors text-sm">
            {t('viewDetails')}
          </button>
        </div>
      )}
    </motion.div>
  );

  if (isLoading) {
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
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{t('departments')}</h1>
            <p className="text-slate-600 mt-1">{t('departmentManagementDesc')}</p>
          </div>

          <div className="flex space-x-3">
            <Link
              to="/"
              className="flex items-center px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              {t('backToHome')}
            </Link>
            {/* Add Department Button - Always visible */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              {t('addDepartment')}
            </button>

            {/* Admin/HR only features - removed with auth */}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">{t('departments')}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{activeDepartments}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">{t('totalEmployees')}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{totalEmployees}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">{t('totalBudget')}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  ${(totalBudget / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Department Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments?.map((department, index) => (
            <motion.div
              key={department.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DepartmentCard department={department} />
            </motion.div>
          )) || []}
        </div>

        {(!departments || departments.length === 0) && !isLoading && (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">{t('noDepartmentsFound')}</h3>
            <p className="text-slate-500">{t('createFirstDepartment')}</p>
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">{t('addNewDepartment')}</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label htmlFor="departmentName" className="block text-sm font-medium text-slate-700 mb-2">
                    {t('departmentName')}
                  </label>
                  <input
                    type="text"
                    id="departmentName"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('enterDepartmentName')}
                  />
                </div>

                <div>
                  <label htmlFor="departmentHead" className="block text-sm font-medium text-slate-700 mb-2">
                    {t('departmentHead')}
                  </label>
                  <input
                    type="text"
                    id="departmentHead"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('enterDepartmentHead')}
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                    {t('budgetAllocation')}
                  </label>
                  <input
                    type="number"
                    id="budget"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('enterBudget')}
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                    {t('description')}
                  </label>
                  <textarea
                    id="description"
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('enterDescription')}
                  ></textarea>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('addDepartment')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentList;
