import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { format } from 'date-fns';
import { Download, Filter } from 'lucide-react';
import Chatbot from '../components/ChatBot/Chatbot';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [categoryTotals, setCategoryTotals] = useState([]);
    const [monthlyTotals, setMonthlyTotals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);

    // Filter states
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [availableYears, setAvailableYears] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const months = [
        { value: '', label: 'All Months' },
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    const filterExpenses = (expenseData, month, year) => {
        if (!month && !year) {
            return expenseData;
        }

        return expenseData.filter(expense => {
            const expenseDate = new Date(expense.date);
            const expenseMonth = String(expenseDate.getMonth() + 1).padStart(2, '0');
            const expenseYear = String(expenseDate.getFullYear());

            const monthMatch = !month || expenseMonth === month;
            const yearMatch = !year || expenseYear === year;

            return monthMatch && yearMatch;
        });
    };

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

    const getAvailableYears = (expenseData) => {
        const years = [...new Set(expenseData.map(expense =>
            new Date(expense.date).getFullYear()
        ))].sort((a, b) => b - a); // Sort descending (newest first)

        setAvailableYears(years);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const expensesRes = await axios.get('/expenses/');
                setExpenses(expensesRes.data);
                getAvailableYears(expensesRes.data);

                // Apply initial filtering
                const filtered = filterExpenses(expensesRes.data, selectedMonth, selectedYear);
                setFilteredExpenses(filtered);
                calculateTotals(filtered);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Apply filters when month or year changes
    useEffect(() => {
        const filtered = filterExpenses(expenses, selectedMonth, selectedYear);
        setFilteredExpenses(filtered);
        calculateTotals(filtered);
    }, [selectedMonth, selectedYear, expenses]);

    const handleResetFilters = () => {
        setSelectedMonth('');
        setSelectedYear('');
    };

    const exportData = async (format) => {
        try {
            // Include filter parameters in export
            const params = new URLSearchParams();
            if (selectedMonth) params.append('month', selectedMonth);
            if (selectedYear) params.append('year', selectedYear);

            const response = await axios.get(`/export/${format}/?${params.toString()}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Add filter info to filename
            let filename = 'expenses';
            if (selectedYear || selectedMonth) {
                filename += '_filtered';
                if (selectedYear) filename += `_${selectedYear}`;
                if (selectedMonth) filename += `_${months.find(m => m.value === selectedMonth)?.label || selectedMonth}`;
            }
            filename += `.${format}`;

            link.setAttribute('download', filename);
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
                    {/* Filter Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Filter size={18} />
                        {showFilters ? 'Close' : 'Filters'}
                    </button>

                    {/* Export Button */}
                    <button
                        onClick={() => exportData('csv')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="month-filter" className="text-sm font-medium text-gray-700">
                                Month:
                            </label>
                            <select
                                id="month-filter"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {months.map(month => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label htmlFor="year-filter" className="text-sm font-medium text-gray-700">
                                Year:
                            </label>
                            <select
                                id="year-filter"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">All Years</option>
                                {availableYears.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reset Filters Button */}
                        {(selectedMonth || selectedYear) && (
                            <button
                                onClick={handleResetFilters}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                            >
                                Reset Filters
                            </button>
                        )}

                        {/* Active Filter Indicator */}
                        {(selectedMonth || selectedYear) && (
                            <div className="text-sm text-indigo-600 font-medium">
                                Showing: {(() => {
                                    if (selectedMonth && selectedYear) {
                                        return `${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`;
                                    } else if (selectedMonth && !selectedYear) {
                                        return `${months.find(m => m.value === selectedMonth)?.label} (All years)`;
                                    } else if (!selectedMonth && selectedYear) {
                                        return `All months in ${selectedYear}`;
                                    }
                                    return '';
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h2>
                    <p className="text-3xl font-bold text-indigo-800">₹{totalExpense.toFixed(2)}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Number of Expenses</h2>
                    <p className="text-3xl font-bold text-indigo-800">{filteredExpenses.length}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Average Expense</h2>
                    <p className="text-3xl font-bold text-indigo-800">
                        ₹{filteredExpenses.length > 0 ? (totalExpense / filteredExpenses.length).toFixed(2) : '0.00'}
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