import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddExpense from './pages/AddExpense';
import ExpenseHistory from './pages/ExpenseHistory';
import Predictions from './pages/Predictions';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import BudgetPage from './pages/BudgetPage';
import axios from 'axios';
import GoalsPage from './pages/GoalsPage';

// Set default base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:7001/api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/" /> : <Login onLogin={login} />
                } />
                <Route path="/register" element={
                    isAuthenticated ? <Navigate to="/" /> : <Register onLogin={login} />
                } />

                {/* Protected routes */}
                <Route path="/" element={
                    isAuthenticated ? (
                        <Layout onLogout={logout}>
                            <Dashboard />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                } />
                <Route path="/add-expense" element={
                    isAuthenticated ? (
                        <Layout onLogout={logout}>
                            <AddExpense />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                } />
                <Route path="/history" element={
                    isAuthenticated ? (
                        <Layout onLogout={logout}>
                            <ExpenseHistory />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                } />
                <Route path="/predictions" element={
                    isAuthenticated ? (
                        <Layout onLogout={logout}>
                            <Predictions />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                } />
                <Route path="/profile" element={
                    isAuthenticated ? (
                        <Layout onLogout={logout}>
                            <Profile />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                } />
                {/* New routes for budgets and goals */}
                <Route path="/budgets" element={
                    isAuthenticated ? (
                        <Layout onLogout={logout}>
                            <BudgetPage />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                } />
                <Route path="/goals" element={
                    isAuthenticated ? (
                        <Layout onLogout={logout}>
                            <GoalsPage />
                        </Layout>
                    ) : (
                        <Navigate to="/login" />
                    )
                } />
            </Routes>
        </Router>
    );
}

export default App;
