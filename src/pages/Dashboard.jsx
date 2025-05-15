import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import Chatbot from '../components/ChatBot/Chatbot';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [categoryTotals, setCategoryTotals] = useState([]);
    const [monthlyTotals, setMonthlyTotals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);

    const calculateTotals = (expenseData) => {
        // Calculate total expense
        const total = expenseData.reduce((sum, expense) => sum + Number(expense.amount), 0);
        setTotalExpense(total);

        // Calculate category totals
        const categories = {};
        expenseData.forEach(expense => {
            const amount = Number(expense.amount);
            categories[expense.category] = (categories[expense.category] || 0) + amount;
        });

        const categoryData = Object.entries(categories).map(([category, total]) => ({
            category,
            total
        }));
        setCategoryTotals(categoryData);

        // Calculate monthly totals
        const months = {};
        expenseData.forEach(expense => {
            const amount = Number(expense.amount);
            const monthYear = format(new Date(expense.date), 'MMM yyyy');
            months[monthYear] = (months[monthYear] || 0) + amount;
        });

        const monthlyData = Object.entries(months).map(([month, total]) => ({
            month,
            total
        })).sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA.getTime() - dateB.getTime();
        });
        setMonthlyTotals(monthlyData);

        // Get recent expenses
        const sortedExpenses = [...expenseData].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentExpenses(sortedExpenses.slice(0, 5));
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true);
    //             const expensesRes = await axios.get('/expenses/');

    //             setExpenses(expensesRes.data);
    //             calculateTotals(expensesRes.data);
    //         } catch (err) {
    //             console.error('Error fetching data:', err);
    //             setError('Failed to load data. Please try again later.');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();

    //     // Set up polling to refresh data every 30 seconds
    //     const intervalId = setInterval(fetchData, 30000);

    //     // Cleanup interval on component unmount
    //     return () => clearInterval(intervalId);
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const expensesRes = await axios.get('/expenses/');
                setExpenses(expensesRes.data);
                calculateTotals(expensesRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const exportData = async (format) => {
        try {
            const response = await axios.get(`/export/${format}/`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `expenses.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(`Error exporting ${format}:`, err);
            setError(`Failed to export ${format}. Please try again.`);
        }
    };

    // Prepare data for doughnut chart
    const doughnutData = {
        labels: categoryTotals.map(cat => cat.category),
        datasets: [
            {
                data: categoryTotals.map(cat => cat.total),
                backgroundColor: [
                    '#4F46E5', // indigo-600
                    '#7C3AED', // violet-600
                    '#EC4899', // pink-600
                    '#F59E0B', // amber-500
                    '#10B981', // emerald-500
                    '#3B82F6', // blue-500
                    '#8B5CF6', // purple-500
                    '#EF4444', // red-500
                ],
                borderWidth: 1,
            },
        ],
    };

    // Prepare data for line chart
    const lineData = {
        labels: monthlyTotals.map(month => month.month),
        datasets: [
            {
                label: 'Monthly Expenses',
                data: monthlyTotals.map(month => month.total),
                fill: false,
                borderColor: '#4F46E5',
                tension: 0.1,
            },
        ],
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => exportData('csv')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h2>
                    <p className="text-3xl font-bold text-indigo-800">₹{totalExpense.toFixed(2)}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Number of Expenses</h2>
                    <p className="text-3xl font-bold text-indigo-800">{expenses.length}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Average Expense</h2>
                    <p className="text-3xl font-bold text-indigo-800">
                        ₹{expenses.length > 0 ? (totalExpense / expenses.length).toFixed(2) : '0.00'}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Expenses by Category</h2>
                    <div className="h-64">
                        {categoryTotals.length > 0 ? (
                            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <div className="flex justify-center items-center h-full text-gray-500">
                                No category data available
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Expenses</h2>
                    <div className="h-64">
                        {monthlyTotals.length > 0 ? (
                            <Line data={lineData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <div className="flex justify-center items-center h-full text-gray-500">
                                No monthly data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Expenses */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Expenses</h2>
                {recentExpenses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentExpenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(expense.date), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{Number(expense.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-500">No recent expenses found</div>
                )}
            </div>

            {/* Chatbot */}
            <Chatbot />
        </div>
    );
};

export default Dashboard;
