import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Request Password Reset Form Component
export const RequestPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post('/password-reset/request/', {
                email,
            });
            setIsSubmitted(true);
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left side - Image (same as login page) */}
            <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                {/* Main background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-2000"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&q=80")',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* Overlay gradient to ensure text is readable */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/80 via-indigo-800/60 to-purple-800/50"></div>
                </div>

                {/* Content inside the image area */}
                <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
                    <div>
                        <h1 className="text-4xl font-bold">ExpenseTracker</h1>
                        <p className="text-xl mt-2">Manage your finances with ease</p>
                    </div>

                    <div className="mb-8 max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Reset your password</h2>
                        <p className="text-lg">We'll send you a secure link to reset your password and get back to managing your finances.</p>
                    </div>
                </div>
            </div>

            {/* Right side - Request Reset Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    {isSubmitted ? (
                        <div>
                            <div className="text-center md:text-left mb-6">
                                <h1 className="text-3xl font-bold text-gray-900">Check Your Email</h1>
                                <p className="mt-2 text-gray-600">We've sent password reset instructions</p>
                            </div>

                            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm">
                                <div className="flex">
                                    <div className="py-1">
                                        <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium">Email sent successfully!</p>
                                        <p className="text-sm">If an account exists with the email you provided, we've sent password reset instructions. Please check your email inbox and spam folder.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Link
                                    to="/login"
                                    className="flex justify-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Return to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="text-center md:text-left mb-10">
                                <h1 className="text-3xl font-bold text-gray-900">Reset Your Password</h1>
                                <p className="mt-2 text-gray-600">Enter your email to receive a reset link</p>
                            </div>

                            {error && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
                                    <div className="flex">
                                        <div className="py-1">
                                            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div>{error}</div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex justify-center items-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-8">
                                <p className="text-sm text-gray-600">
                                    Remember your password?{' '}
                                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                        Back to Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Reset Password Form Component
export const ResetPassword = ({ onLogin }) => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isValidatingToken, setIsValidatingToken] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Validate token when component mounts
    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.post('/password-reset/validate-token/', { uid, token });
                setIsTokenValid(response.data.valid);
            } catch (err) {
                setIsTokenValid(false);
                setError('This password reset link is invalid or has expired.');
            } finally {
                setIsValidatingToken(false);
            }
        };

        validateToken();
    }, [uid, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate password
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/password-reset/reset/', {
                uid,
                token,
                new_password: newPassword,
            });

            if (onLogin && response.data.token) {
                onLogin(response.data.token);
            }

            setIsSubmitted(true);

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('An error occurred. Please try again.');
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left side - Image (same as login page) */}
            <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-2000"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&q=80")',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/80 via-indigo-800/60 to-purple-800/50"></div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
                    <div>
                        <h1 className="text-4xl font-bold">ExpenseTracker</h1>
                        <p className="text-xl mt-2">Manage your finances with ease</p>
                    </div>

                    <div className="mb-8 max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Set your new password</h2>
                        <p className="text-lg">Choose a strong, secure password to protect your financial data.</p>
                    </div>
                </div>
            </div>

            {/* Right side - Password Reset Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    {isValidatingToken ? (
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Validating your reset link...</h2>
                            <p className="mt-2 text-gray-600">Please wait while we verify your request.</p>
                        </div>
                    ) : !isTokenValid ? (
                        <div>
                            <div className="text-center md:text-left mb-6">
                                <h1 className="text-3xl font-bold text-red-600">Invalid Reset Link</h1>
                                <p className="mt-2 text-gray-600">This link is no longer valid</p>
                            </div>

                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
                                <div className="flex">
                                    <div className="py-1">
                                        <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium">Invalid or expired link</p>
                                        <p className="text-sm">This password reset link is invalid or has expired. Please request a new one.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Link
                                    to="/request-reset"
                                    className="flex justify-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Request a New Link
                                </Link>
                            </div>
                        </div>
                    ) : isSubmitted ? (
                        <div>
                            <div className="text-center md:text-left mb-6">
                                <h1 className="text-3xl font-bold text-green-600">Password Reset Successful</h1>
                                <p className="mt-2 text-gray-600">Your password has been updated</p>
                            </div>

                            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm">
                                <div className="flex">
                                    <div className="py-1">
                                        <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium">Success!</p>
                                        <p className="text-sm">Your password has been reset successfully. You are now logged in. Redirecting to dashboard...</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex justify-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="text-center md:text-left mb-10">
                                <h1 className="text-3xl font-bold text-gray-900">Set New Password</h1>
                                <p className="mt-2 text-gray-600">Create a strong password for your account</p>
                            </div>

                            {error && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
                                    <div className="flex">
                                        <div className="py-1">
                                            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div>{error}</div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="newPassword">
                                        New Password
                                    </label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        placeholder="Enter new password"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Password must be at least 8 characters long
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Confirm new password"
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex justify-center items-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Resetting Password...
                                            </>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Export the components as named exports - no default export