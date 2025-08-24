import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  Users,
  Building2,
  BarChart3,
  Home
} from 'lucide-react';
// Auth removed
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n';

const Navbar = () => {
  const user = { name: 'Guest', role: 'viewer', email: 'guest@ems.local' };
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const navigationItems = [
    { name: t('dashboard'), href: '/dashboard', icon: Home },
    { name: t('employees'), href: '/employees', icon: Users },
    { name: t('departments'), href: '/departments', icon: Building2 },
  { name: t('reports'), href: '/reports', icon: BarChart3 },
  ];

  const EMSLogo = () => (
    <svg viewBox="0 0 200 200" className="w-32 h-32">
      <g transform="translate(100, 100)">
        <path d="M 0,-30 L 30,0 L 0,30 L -30,0 Z" fill="#64748b" opacity="0.1" />
        <path d="M 0,-25 L 25,0 L 0,25 L -25,0 Z" fill="none" stroke="#64748b" strokeWidth="1" />
        <circle cx="0" cy="0" r="12" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="0" cy="0" r="7" fill="#3b82f6" opacity="0.2" />
        <circle cx="0" cy="0" r="4" fill="#3b82f6" />
      </g>
    </svg>
  );




  return (
  <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50" dir="ltr" style={{ zIndex: 9999 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <EMSLogo />
              <div>
                <h1 className="text-lg font-bold text-slate-800">{t('ems')}</h1>
                <p className="text-xs text-slate-500 hidden sm:block">{t('employeeManagement')}</p>
              </div>
            </button>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 lg:mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder={t('searchPlaceholder') || 'Search employees, departments...'}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search */}
            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Search size={20} className="text-slate-600" />
            </button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Bell size={20} className="text-slate-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </motion.button>

            {/* Settings with Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: showSettingsMenu ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              >
                <Settings size={20} className="text-slate-600" />
              </motion.button>

              <AnimatePresence>
                {showSettingsMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSettingsMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-3 z-20"
                    >
                      {/* Settings Header */}
                      <div className="px-4 py-2 border-b border-slate-100">
                        <h3 className="font-medium text-slate-800">{t('settings') || 'Settings'}</h3>
                      </div>

                      {/* Settings Options */}
                      <div className="py-2 space-y-1">
                        {/* Language Switcher Option */}
                        <div className="px-4 py-3">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            {t('language') || 'Language'}
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                            value={lang}
                            onChange={e => setLang(e.target.value)}
                            aria-label="Language Switcher"
                          >
                            <option value="en">🇺🇸 English</option>
                            <option value="ar">🇸🇦 العربية</option>
                          </select>
                        </div>

                        {/* Theme Switcher Option */}
                        <div className="px-4 py-3 border-t border-slate-100">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            {t('theme') || 'Theme'}
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                            value={theme}
                            onChange={e => setTheme(e.target.value)}
                            aria-label="Theme Switcher"
                          >
                            <option value="light">☀️ {t('lightMode') || 'Light'}</option>
                            <option value="dark">🌙 {t('darkMode') || 'Dark'}</option>
                            <option value="auto">🖥️ {t('autoMode') || 'Auto'}</option>
                          </select>
                        </div>

                        {/* Settings Navigation */}
                        <div className="border-t border-slate-100 pt-2">
                          <button
                            onClick={() => {
                              navigate('/settings');
                              setShowSettingsMenu(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                          >
                            <Settings size={16} className="text-slate-500" />
                            <span className="text-slate-700">{t('advancedSettings') || 'Advanced Settings'}</span>
                          </button>

                          {/* Admin Panel Option */}
                          {(user?.role === 'admin' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                            <button
                              onClick={() => {
                                navigate('/admin');
                                setShowSettingsMenu(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                            >
                              <Shield size={16} className="text-slate-500" />
                              <span className="text-slate-700">{t('adminPanel') || 'Admin Control Panel'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            {/* User Profile Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-800">{user?.name || 'Administrator'}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role || 'admin'}</p>
                </div>
              </motion.button>
              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-medium text-slate-800">{user?.name || 'Administrator'}</p>
                        <p className="text-sm text-slate-500">{user?.email || 'admin@ems.com'}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {user?.employeeId} • {user?.department}
                        </p>
                      </div>
                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                        >
                          <User size={16} className="text-slate-500" />
                          <span className="text-slate-700">{t('myProfile') || 'View Profile'}</span>
                        </button>

                        <button
                          onClick={() => {
                            navigate('/settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                        >
                          <Settings size={16} className="text-slate-500" />
                          <span className="text-slate-700">{t('settings') || 'Account Settings'}</span>
                        </button>

                        {user?.role === 'admin' && (
                          <button
                            onClick={() => {
                              navigate('/admin');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                          >
                            <Shield size={16} className="text-slate-500" />
                            <span className="text-slate-700">{t('adminPanel') || 'Admin Control Panel'}</span>
                          </button>
                        )}
                      </div>
                      <div className="border-t border-slate-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-red-50 transition-colors text-red-600"
                        >
                          <LogOut size={16} />
                          <span>{t('logout') || 'Sign Out'}</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Navigation - Always Visible */}
              <div className="space-y-2 mb-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${location.pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder') || 'Search employees, departments...'}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;