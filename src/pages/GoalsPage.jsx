import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, Edit2, Save, Trash2, Target, TrendingUp, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const GoalsPage = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        deadline: format(new Date().setMonth(new Date().getMonth() + 3), 'yyyy-MM-dd')
    });

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/goals/');

                const parsedGoals = response.data.map((goal) => ({
                    ...goal,
                    targetAmount: parseFloat(goal.targetAmount),
                    currentAmount: parseFloat(goal.currentAmount)
                }));

                setGoals(parsedGoals);
            } catch (err) {
                console.error('Error fetching goals:', err);
                setError('Failed to load goals. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: ['targetAmount', 'currentAmount'].includes(name) ? value === "" ? "" : parseFloat(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingGoal) {
                await axios.put(`/goals/${editingGoal.id}/`, formData);
                setGoals(goals.map(goal =>
                    goal.id === editingGoal.id ? {
                        ...goal,
                        ...formData,
                        targetAmount: parseFloat(formData.targetAmount.toString()),
                        currentAmount: parseFloat(formData.currentAmount.toString())
                    } : goal
                ));
            } else {
                const response = await axios.post('/goals/', formData);
                const newGoal = {
                    ...response.data,
                    targetAmount: parseFloat(response.data.targetAmount),
                    currentAmount: parseFloat(response.data.currentAmount)
                };
                setGoals([...goals, newGoal]);
            }

            setFormData({
                name: '',
                targetAmount: 0,
                currentAmount: 0,
                deadline: format(new Date().setMonth(new Date().getMonth() + 3), 'yyyy-MM-dd')
            });
            setShowForm(false);
            setEditingGoal(null);
        } catch (err) {
            console.error('Error saving goal:', err);
            setError('Failed to save goal. Please try again.');
        }
    };

    const handleEdit = (goal) => {
        setFormData({
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            deadline: goal.deadline
        });
        setEditingGoal(goal);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await axios.delete(`/goals/${id}/`);
                setGoals(goals.filter(goal => goal.id !== id));
            } catch (err) {
                console.error('Error deleting goal:', err);
                setError('Failed to delete goal. Please try again.');
            }
        }
    };

    const handleUpdateContribution = async (goal, amount) => {
        try {
            const response = await axios.post(`/goals/${goal.id}/update_contribution/`, { amount });

            const updatedGoal = {
                ...response.data,
                targetAmount: parseFloat(response.data.targetAmount),
                currentAmount: parseFloat(response.data.currentAmount)
            };

            setGoals(goals.map(g =>
                g.id === goal.id ? updatedGoal : g
            ));
        } catch (err) {
            console.error('Error updating goal contribution:', err);
            setError('Failed to update goal contribution. Please try again.');
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
                <h1 className="text-2xl font-bold text-gray-800">Financial Goals</h1>
                <button
                    onClick={() => {
                        setFormData({
                            name: '',
                            targetAmount: 0,
                            currentAmount: 0,
                            deadline: format(new Date().setMonth(new Date().getMonth() + 3), 'yyyy-MM-dd')
                        });
                        setEditingGoal(null);
                        setShowForm(!showForm);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    {showForm ? <X size={18} /> : <Plus size={18} />}
                    {showForm ? 'Cancel' : 'Add Goal'}
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
                        {editingGoal ? 'Edit Goal' : 'Create New Financial Goal'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Goal Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., New Laptop, Vacation, Emergency Fund"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                                    Target Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    id="targetAmount"
                                    name="targetAmount"
                                    value={formData.targetAmount}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    id="currentAmount"
                                    name="currentAmount"
                                    value={formData.currentAmount}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                                    Target Date
                                </label>
                                <input
                                    type="date"
                                    id="deadline"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    required
                                    min={format(new Date(), 'yyyy-MM-dd')}
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
                                {editingGoal ? 'Update Goal' : 'Save Goal'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Financial Goals</h2>
                    {goals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {goals.map((goal) => {
                                const currentAmount = parseFloat(goal.currentAmount.toString());
                                const targetAmount = parseFloat(goal.targetAmount.toString());

                                const progress = (currentAmount / targetAmount) * 100;
                                const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
                                const isCompleted = currentAmount >= targetAmount;

                                return (
                                    <div
                                        key={goal.id}
                                        className={`border rounded-lg transition-all hover:shadow-md ${isCompleted ? 'border-green-500 bg-green-50' : daysLeft < 0 ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                            }`}
                                    >
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-medium text-lg">{goal.name}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                        <Calendar size={14} />
                                                        <span>
                                                            {isCompleted
                                                                ? 'Completed'
                                                                : daysLeft < 0
                                                                    ? `Overdue by ${Math.abs(daysLeft)} days`
                                                                    : `${daysLeft} days left`
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(goal)}
                                                        className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                                                        aria-label="Edit goal"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(goal.id)}
                                                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                                        aria-label="Delete goal"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>


                                            <div className="mt-3">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>₹{currentAmount.toFixed(2)}</span>
                                                    <span>₹{targetAmount.toFixed(2)}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                                                    <div
                                                        className={`h-2.5 rounded-full ${isCompleted ? 'bg-green-600' : 'bg-indigo-600'
                                                            }`}
                                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Target size={16} className="text-indigo-600" />
                                                    <span className="font-medium">
                                                        {progress.toFixed(1)}% complete
                                                    </span>
                                                </div>

                                                {!isCompleted && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleUpdateContribution(goal, 100)}
                                                            className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 transition-colors"
                                                        >
                                                            Add ₹100
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateContribution(goal, 500)}
                                                            className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 transition-colors"
                                                        >
                                                            Add ₹500
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {!isCompleted && (
                                                <div className="mt-3 text-xs text-gray-600 flex items-center gap-1">
                                                    <TrendingUp size={14} />
                                                    <span>
                                                        Need ₹{(targetAmount - currentAmount).toFixed(2)} more to reach your goal
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No financial goals set yet. Create your first goal to start saving for something important!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoalsPage;
