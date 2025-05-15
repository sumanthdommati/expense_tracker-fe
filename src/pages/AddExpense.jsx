import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, Calendar, ArrowLeft, PlusCircle, XCircle, Check } from 'lucide-react';

const AddExpense = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const categoryButtonRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/categories/');
                setCategories(response.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories. Please try again later.');
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                categoryButtonRef.current &&
                !categoryButtonRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            setError('Category name cannot be empty');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post('/categories/', { name: newCategory });
            setCategories([...categories, response.data]);
            setCategory(response.data.name);
            setNewCategory('');
            setShowNewCategoryInput(false);
            setError(null);
        } catch (err) {
            console.error('Error adding category:', err);
            setError('Failed to add new category. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (categoryId, categoryName, e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
            try {
                await axios.delete(`/categories/${categoryId}/`);
                setCategories(categories.filter(cat => cat.id !== categoryId));
                if (category === categoryName) {
                    setCategory('');
                }
                setShowDropdown(false);
            } catch (err) {
                console.error('Error deleting category:', err);
                setError('Failed to delete category. Please try again.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !description || !category || !date) {
            setError('All fields are required');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            await axios.post('/expenses/', {
                amount: parseFloat(amount),
                description,
                category,
                date
            });

            setSuccess(true);
            setAmount('');
            setDescription('');
            setDate(new Date().toISOString().split('T')[0]);
            setCategory('');

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            console.error('Error adding expense:', err);
            setError('Failed to add expense. Please try again.');
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full px-4 sm:px-6 md:px-8 max-w-3xl mx-auto">
            {/* JSX structure remains the same as TSX, without TypeScript type annotations */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Expense</h1>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    <ArrowLeft size={18} className="mr-1" />
                    <span className="hidden sm:inline">Back to Dashboard</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">Expense added successfully! Redirecting to dashboard...</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Amount field */}
                        <div>
                            <label className="block text-gray-700 text-base font-medium mb-3" htmlFor="amount">
                                Amount (₹)
                            </label>
                            <div className="mt-2 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-lg">₹</span>
                                </div>
                                <input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-4 text-base border border-gray-300 rounded-lg"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        {/* Date field */}
                        <div>
                            <label className="block text-gray-700 text-base font-medium mb-3" htmlFor="date">
                                Date
                            </label>
                            <div className="mt-2 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Calendar className="h-6 w-6 text-gray-400" />
                                </div>
                                <input
                                    id="date"
                                    type="date"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-4 py-4 text-base border border-gray-300 rounded-lg"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description field */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                            Description
                        </label>
                        <input
                            id="description"
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-3 px-4 sm:text-sm border border-gray-300 rounded-md"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What was this expense for?"
                            required
                        />
                    </div>

                    {/* Category field */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
                            Category
                        </label>
                        {!showNewCategoryInput ? (
                            <div className="relative">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="relative flex-1">
                                        <button
                                            ref={categoryButtonRef}
                                            type="button"
                                            className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            onClick={() => setShowDropdown(!showDropdown)}
                                        >
                                            <span className={`block truncate ${!category ? 'text-gray-500' : ''}`}>
                                                {category || 'Select a category'}
                                            </span>
                                        </button>
                                        {showDropdown && (
                                            <div
                                                ref={dropdownRef}
                                                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                                            >
                                                {categories.length > 0 ? (
                                                    categories.map((cat) => (
                                                        <div
                                                            key={cat.id}
                                                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {
                                                                setCategory(cat.name);
                                                                setShowDropdown(false);
                                                            }}
                                                        >
                                                            <span className={`block truncate ${cat.name === category ? 'font-medium' : 'font-normal'}`}>
                                                                {cat.name}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleDeleteCategory(cat.id, cat.name, e)}
                                                                className="text-red-600 hover:text-red-800 ml-4 p-1 rounded-full hover:bg-red-100"
                                                                title="Delete category"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 text-sm text-gray-500">No categories found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() => setShowNewCategoryInput(true)}
                                    >
                                        <PlusCircle size={18} className="mr-1.5" />
                                        New Category
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    className="block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md px-4 py-3"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Enter new category name"
                                    autoFocus
                                />
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        onClick={handleAddCategory}
                                        disabled={isLoading}
                                    >
                                        <Check size={18} className="mr-1.5" />
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() => {
                                            setShowNewCategoryInput(false);
                                            setNewCategory('');
                                        }}
                                    >
                                        <XCircle size={18} className="mr-1.5" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding Expense...
                                </>
                            ) : (
                                'Add Expense'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;
