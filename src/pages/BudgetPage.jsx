import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, Edit2, Save, Trash2 } from 'lucide-react';

const BudgetPage = () => {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [formData, setFormData] = useState({ category: 0, limit: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [budgetsRes, categoriesRes] = await Promise.all([
                    axios.get('/budgets/'),
                    axios.get('/categories/'),
                ]);

                setBudgets(budgetsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'limit' ? parseFloat(value) : parseInt(value, 10),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/budgets/', formData);

            // Check if this is a new budget or updating an existing one
            const existingIndex = budgets.findIndex((b) => b.category === formData.category);

            if (existingIndex >= 0) {
                // Update existing budget in the state
                const updatedBudgets = [...budgets];
                updatedBudgets[existingIndex] = {
                    ...updatedBudgets[existingIndex],
                    limit: formData.limit,
                };
                setBudgets(updatedBudgets);
            } else {
                // Fetch all budgets again to get the updated data with spent amounts
                const budgetsRes = await axios.get('/budgets/');
                setBudgets(budgetsRes.data);
            }

            setFormData({ category: 0, limit: 0 });
            setShowForm(false);
            setEditingBudget(null);
        } catch (err) {
            console.error('Error saving budget:', err);
            setError('Failed to save budget. Please try again.');
        }
    };

    const handleEdit = (budget) => {
        setFormData({ category: budget.category, limit: budget.limit });
        setEditingBudget(budget);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                await axios.delete(`/budgets/${id}/`);
                setBudgets(budgets.filter((budget) => budget.id !== id));
            } catch (err) {
                console.error('Error deleting budget:', err);
                setError('Failed to delete budget. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Budget Management</h1>
                <button
                    onClick={() => {
                        setFormData({ category: 0, limit: 0 });
                        setEditingBudget(null);
                        setShowForm(!showForm);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancel' : 'Add Budget'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        {editingBudget ? 'Edit Budget' : 'Create New Budget'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
                                    Monthly Limit (₹)
                                </label>
                                <input
                                    type="number"
                                    id="limit"
                                    name="limit"
                                    value={formData.limit}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Save size={18} />
                                {editingBudget ? 'Update Budget' : 'Save Budget'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Budgets</h2>
                    {budgets.length > 0 ? (
                        <div className="space-y-4">
                            {budgets.map((budget) => {
                                return (
                                    <div key={budget.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <span className="font-medium text-lg">{budget.category_name}</span>
                                                <div className="text-sm text-gray-600">
                                                    <p>Monthly: ₹{budget.spent.toFixed(2)} spent of ₹{budget.limit.toFixed(2)}</p>
                                                    <p>Total: ₹{budget.total_spent.toFixed(2)} (all time)</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(budget)}
                                                    className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                                                    aria-label="Edit budget"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(budget.id)}
                                                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                                    aria-label="Delete budget"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Monthly Budget Progress */}
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Monthly Budget</span>
                                                <span>{budget.percentage.toFixed(1)}% used</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                                <div
                                                    className={`h-2.5 rounded-full ${budget.percentage > 90
                                                            ? 'bg-red-600'
                                                            : budget.percentage > 70
                                                                ? 'bg-yellow-600'
                                                                : 'bg-green-600'
                                                        }`}
                                                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className={`font-medium ${budget.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {budget.remaining < 0 ? 'Over budget by ' : 'Remaining: '}
                                                    ₹{Math.abs(budget.remaining).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Comparison with Total Spending */}
                                        <div className="mt-4 pt-3 border-t border-gray-100">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Total spent on this category:</span>
                                                <span className="font-medium">₹{budget.total_spent.toFixed(2)}</span>
                                            </div>

                                            {budget.total_spent > 0 && (
                                                <div className="mt-1">
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        Monthly budget represents {((budget.limit / budget.total_spent) * 100).toFixed(1)}% of total spending
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="h-2 rounded-full bg-indigo-400"
                                                            style={{ width: `${Math.min((budget.limit / budget.total_spent) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No budgets set yet. Create your first budget to start tracking your spending limits.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BudgetPage;
