import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Pencil } from 'lucide-react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expenseCount, setExpenseCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [usernameError, setUsernameError] = useState(null);
    const [usernameSuccess, setUsernameSuccess] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [emailSuccess, setEmailSuccess] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const [profileRes, expensesRes, categoriesRes] = await Promise.all([
                    axios.get('/auth/profile/'),
                    axios.get('/expenses/'),
                    axios.get('/categories/')
                ]);
                setProfile(profileRes.data);
                setExpenseCount(expensesRes.data.length);
                setCategoryCount(categoriesRes.data.length);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user profile. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(false);

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/auth/change-password/', {
                current_password: currentPassword,
                new_password: newPassword
            });

            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;

            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Error changing password:', err);
            setPasswordError(err.response?.data?.error || 'Failed to change password');
        }
    };

    const handleUsernameUpdate = async (e) => {
        e.preventDefault();
        setUsernameError(null);
        setUsernameSuccess(false);

        try {
            const response = await axios.post("/auth/update-username/", {
                new_username: newUsername
            });

            localStorage.setItem("token", response.data.token);
            axios.defaults.headers.common["Authorization"] = `Token ${response.data.token}`;

            setUsernameSuccess(true);
            setNewUsername('');

            const profileRes = await axios.get("/auth/profile/");
            setProfile(profileRes.data);

            setTimeout(() => {
                setShowUsernameModal(false);
                setUsernameSuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Error updating username:', err);
            setUsernameError(err.response?.data?.error || "Failed to update username");
        }
    };


    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        setEmailError(null);
        setEmailSuccess(false);

        try {
            const response = await axios.post('/auth/update-email/', {
                new_email: newEmail
            });

            localStorage.setItem("token", response.data.token);
            axios.defaults.headers.common["Authorization"] = `Token ${response.data.token}`;

            setEmailSuccess(true);
            setNewEmail('');

            const profileRes = await axios.get("/auth/profile/");
            setProfile(profileRes.data);

            setTimeout(() => {
                setShowEmailModal(false);
                setEmailSuccess(false);
            }, 2000);
        } catch (err) {
            console.error('Error updating email:', err);
            setEmailError(err.response?.data?.error || 'Failed to update email');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-800"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center text-gray-600">
                No profile data available
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-indigo-100 rounded-full p-6">
                            <User size={64} className="text-indigo-800" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Username</label>
                                <div className="mt-1 flex items-center space-x-2">
                                    <span className="text-lg font-semibold text-gray-900">{profile.username}</span>
                                    <button
                                        onClick={() => setShowUsernameModal(true)}
                                        className="text-gray-500 hover:text-gray-700"
                                        aria-label="Edit Username"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <div className="mt-1 flex items-center space-x-2">
                                    <span className="text-lg font-semibold text-gray-900">{profile.email}</span>
                                    <button
                                        onClick={() => setShowEmailModal(true)}
                                        className="text-gray-500 hover:text-gray-700"
                                        aria-label="Edit Email"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-right">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Member Since</label>
                                <div className="mt-1 text-lg font-semibold text-gray-900">
                                    {new Date(profile.date_joined).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Last Login</label>
                                <div className="mt-1 text-lg font-semibold text-gray-900">
                                    {profile.last_login ? new Date(profile.last_login).toLocaleDateString() : "No last login recorded yet"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200">
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <div className="p-6 text-center">
                            <div className="text-2xl font-bold text-indigo-800">{expenseCount}</div>
                            <div className="text-sm font-medium text-gray-600">Total Expenses</div>
                        </div>
                        <div className="p-6 text-center">
                            <div className="text-2xl font-bold text-indigo-800">{categoryCount}</div>
                            <div className="text-sm font-medium text-gray-600">Categories Created</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Security</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Password</h3>
                            <p className="text-sm text-gray-500">Update your password regularly to keep your account secure</p>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="bg-indigo-800 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Email</h2>
                        {emailError && (
                            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {emailError}
                            </div>
                        )}
                        {emailSuccess && (
                            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                Email updated successfully!
                            </div>
                        )}
                        <form onSubmit={handleEmailUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Email</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEmailModal(false);
                                        setEmailError(null);
                                        setEmailSuccess(false);
                                        setNewEmail('');
                                    }}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-800 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Update Email
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showUsernameModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Username</h2>
                        {usernameError && (
                            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {usernameError}
                            </div>
                        )}
                        {usernameSuccess && (
                            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                Username updated successfully!
                            </div>
                        )}
                        <form onSubmit={handleUsernameUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Username</label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUsernameModal(false);
                                        setUsernameError(null);
                                        setUsernameSuccess(false);
                                        setNewUsername('');
                                    }}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-800 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Update Username
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
                        {passwordError && (
                            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {passwordError}
                            </div>
                        )}
                        {passwordSuccess && (
                            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                Password changed successfully!
                            </div>
                        )}
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordError(null);
                                        setPasswordSuccess(false);
                                        setCurrentPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                    }}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-800 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
