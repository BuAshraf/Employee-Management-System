import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Building2,
    Edit,
    Save,
    X,
    Camera,
    Shield,
    Bell,
    Globe
} from 'lucide-react';
// Auth removed

const Profile = () => {
    const user = { name: 'Guest User', email: 'guest@ems.local', role: 'viewer', department: 'General', employeeId: 'N/A' };
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345',
        bio: 'Experienced professional with a passion for technology and innovation.',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: '@johndoe',
        website: 'https://johndoe.com'
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        weeklyReports: true,
        securityAlerts: true
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save to backend
        console.log('Saving profile data:', formData);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'preferences', label: 'Preferences', icon: Globe }
    ];

    const ProfileTab = () => (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-start space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-2xl font-semibold">
                                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </span>
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                            <Camera size={14} />
                        </button>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
                                <p className="text-slate-600">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
                                <p className="text-sm text-slate-500">{user?.department} • {user?.employeeId}</p>
                            </div>

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {isEditing ? <X size={16} className="mr-2" /> : <Edit size={16} className="mr-2" />}
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tell us about yourself..."
                            />
                        ) : (
                            <p className="text-slate-600">{formData.bio}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            ) : (
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <User size={16} className="text-slate-400" />
                                    <span className="text-slate-700">{formData.name}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                <Mail size={16} className="text-slate-400" />
                                <span className="text-slate-700">{formData.email}</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Verified</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            ) : (
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <Phone size={16} className="text-slate-400" />
                                    <span className="text-slate-700">{formData.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                            {isEditing ? (
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            ) : (
                                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <MapPin size={16} className="text-slate-400 mt-0.5" />
                                    <span className="text-slate-700">{formData.address}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                <Building2 size={16} className="text-slate-400" />
                                <span className="text-slate-700">{user?.department}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Join Date</label>
                            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                <Calendar size={16} className="text-slate-400" />
                                <span className="text-slate-700">January 15, 2023</span>
                            </div>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-end mt-6 pt-6 border-t border-slate-200">
                        <button
                            onClick={handleSave}
                            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Save size={16} className="mr-2" />
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Social Links</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn</label>
                        {isEditing ? (
                            <input
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://linkedin.com/in/username"
                            />
                        ) : (
                            <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {formData.linkedin}
                            </a>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Twitter</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="twitter"
                                value={formData.twitter}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="@username"
                            />
                        ) : (
                            <span className="text-slate-700">{formData.twitter}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                        {isEditing ? (
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://yourwebsite.com"
                            />
                        ) : (
                            <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {formData.website}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const SecurityTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Password & Authentication</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-slate-800">Password</h4>
                            <p className="text-sm text-slate-600">Last changed 30 days ago</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Change Password
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-slate-800">Two-Factor Authentication</h4>
                            <p className="text-sm text-slate-600">Add an extra layer of security</p>
                        </div>
                        <button className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                            Enable 2FA
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Login Activity</h3>

                <div className="space-y-3">
                    {[
                        { device: 'Chrome on Windows', location: 'New York, US', time: '2 hours ago', current: true },
                        { device: 'Safari on iPhone', location: 'New York, US', time: '1 day ago', current: false },
                        { device: 'Chrome on Windows', location: 'New York, US', time: '3 days ago', current: false }
                    ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                            <div>
                                <p className="font-medium text-slate-800">{session.device}</p>
                                <p className="text-sm text-slate-600">{session.location} • {session.time}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {session.current && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Current</span>
                                )}
                                {!session.current && (
                                    <button className="text-red-600 hover:text-red-700 text-sm">Revoke</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const NotificationsTab = () => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Notification Preferences</h3>

            <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                            <h4 className="font-medium text-slate-800 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="text-sm text-slate-600">
                                {key === 'emailNotifications' && 'Receive notifications via email'}
                                {key === 'pushNotifications' && 'Receive push notifications in browser'}
                                {key === 'smsNotifications' && 'Receive SMS notifications on your phone'}
                                {key === 'weeklyReports' && 'Get weekly summary reports'}
                                {key === 'securityAlerts' && 'Important security and login alerts'}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={() => handleNotificationChange(key)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    const PreferencesTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Display Preferences</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                        <select className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Light</option>
                            <option>Dark</option>
                            <option>System</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                        <select className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>English (US)</option>
                            <option>English (UK)</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                        <select className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Eastern Time (ET)</option>
                            <option>Central Time (CT)</option>
                            <option>Mountain Time (MT)</option>
                            <option>Pacific Time (PT)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Privacy Settings</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-slate-800">Profile Visibility</h4>
                            <p className="text-sm text-slate-600">Who can see your profile information</p>
                        </div>
                        <select className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Everyone</option>
                            <option>Team Members</option>
                            <option>Department Only</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-slate-800">Contact Information</h4>
                            <p className="text-sm text-slate-600">Who can see your contact details</p>
                        </div>
                        <select className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Team Members</option>
                            <option>Department Only</option>
                            <option>Managers Only</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
    <div className="min-h-screen bg-slate-50">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Profile Settings</h1>
                    <p className="text-slate-600 mt-1">Manage your account settings and preferences</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <tab.icon size={18} />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'profile' && <ProfileTab />}
                            {activeTab === 'security' && <SecurityTab />}
                            {activeTab === 'notifications' && <NotificationsTab />}
                            {activeTab === 'preferences' && <PreferencesTab />}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
