import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('/auth/login/', {
                username,
                password
            });

            if (response.data.token) {
                onLogin(response.data.token);
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError('Invalid username or password');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left side - Image */}
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
                        <h2 className="text-2xl font-semibold mb-4">Take control of your spending</h2>
                        <p className="text-lg">Track expenses, set budgets, reach financial goals, and gain insights into your spending habits.</p>

                        <div className="mt-6 flex space-x-3">
                            <div className="flex -space-x-2">
                                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                <img src="https://randomuser.me/api/portraits/women/21.jpg" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                            </div>
                            <p className="text-sm self-center">Joined by 10,000+ users</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="text-center md:text-left mb-10">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome !!!</h1>
                        <p className="mt-2 text-gray-600">Please sign in to your account</p>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            {/* Add Forgot Password link */}
                            <div className="text-sm">
                                <Link to="/request-reset" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
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
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                Register now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
