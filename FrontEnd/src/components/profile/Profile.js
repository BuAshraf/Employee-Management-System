import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                department: user.department || '',
                position: user.position || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call to update profile
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update user in context
            updateUser({ ...user, ...formData });

            toast.success('Profile updated successfully!');
            setEditing(false);
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original user data
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            department: user.department || '',
            position: user.position || '',
            address: user.address || ''
        });
        setEditing(false);
    };

    if (!user) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning" role="alert">
                    Please log in to view your profile.
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h4 className="card-title mb-0">
                                <i className="bi bi-person-circle me-2"></i>
                                My Profile
                            </h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Profile Picture Section */}
                                    <div className="col-md-4 text-center mb-4">
                                        <div className="position-relative d-inline-block">
                                            <img
                                                src={user.profilePicture || '/default-avatar.png'}
                                                alt="Profile"
                                                className="rounded-circle border border-3 border-primary"
                                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/150/6c757d/ffffff?text=Profile';
                                                }}
                                            />
                                            {editing && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                                                    style={{ width: '35px', height: '35px' }}
                                                >
                                                    <i className="bi bi-camera"></i>
                                                </button>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <h5>{formData.firstName} {formData.lastName}</h5>
                                            <p className="text-muted">{formData.position}</p>
                                            <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Profile Information */}
                                    <div className="col-md-8">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="firstName" className="form-label">First Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    disabled={!editing}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    disabled={!editing}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!editing}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="phone" className="form-label">Phone</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    disabled={!editing}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="department" className="form-label">Department</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="department"
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleInputChange}
                                                    disabled={!editing}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="position" className="form-label">Position</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="position"
                                                    name="position"
                                                    value={formData.position}
                                                    onChange={handleInputChange}
                                                    disabled={!editing}
                                                />
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label htmlFor="address" className="form-label">Address</label>
                                                <textarea
                                                    className="form-control"
                                                    id="address"
                                                    name="address"
                                                    rows="3"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    disabled={!editing}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="row mt-4">
                                    <div className="col-12">
                                        <div className="d-flex justify-content-end gap-2">
                                            {editing ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={handleCancel}
                                                        disabled={loading}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            'Save Changes'
                                                        )}
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => setEditing(true)}
                                                >
                                                    <i className="bi bi-pencil me-2"></i>
                                                    Edit Profile
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
