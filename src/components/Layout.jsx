import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Clock, TrendingUp, LogOut, User, Wallet, Target } from 'lucide-react';

const Layout = ({ children, onLogout }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-700' : '';
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-indigo-800 text-white flex flex-col">
                <div className="p-4">
                    <h1 className="text-2xl font-bold">ExpenseTracker</h1>
                </div>

                {/* Main navigation */}
                <nav className="flex-1 mt-8">
                    <Link to="/" className={`flex items-center px-4 py-3 hover:bg-indigo-700 ${isActive('/')}`}>
                        <Home className="mr-3" size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/add-expense" className={`flex items-center px-4 py-3 hover:bg-indigo-700 ${isActive('/add-expense')}`}>
                        <PlusCircle className="mr-3" size={20} />
                        <span>Add Expense</span>
                    </Link>
                    <Link to="/history" className={`flex items-center px-4 py-3 hover:bg-indigo-700 ${isActive('/history')}`}>
                        <Clock className="mr-3" size={20} />
                        <span>History</span>
                    </Link>
                    <Link to="/predictions" className={`flex items-center px-4 py-3 hover:bg-indigo-700 ${isActive('/predictions')}`}>
                        <TrendingUp className="mr-3" size={20} />
                        <span>Predictions</span>
                    </Link>
                    <Link to="/budgets" className={`flex items-center px-4 py-3 hover:bg-indigo-700 ${isActive('/budgets')}`}>
                        <Wallet className="mr-3" size={20} />
                        <span>Budget Management</span>
                    </Link>
                    <Link to="/goals" className={`flex items-center px-4 py-3 hover:bg-indigo-700 ${isActive('/goals')}`}>
                        <Target className="mr-3" size={20} />
                        <span>Financial Goals</span>
                    </Link>
                </nav>

                {/* Bottom section with Profile and Logout */}
                <div className="mt-auto">
                    <Link to="/profile" className={`flex items-center px-4 py-3 hover:bg-indigo-700 ${isActive('/profile')}`}>
                        <User className="mr-3" size={20} />
                        <span>Profile</span>
                    </Link>
                    <button
                        onClick={onLogout}
                        className="flex items-center px-4 py-3 w-full text-left hover:bg-indigo-700"
                    >
                        <LogOut className="mr-3" size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
