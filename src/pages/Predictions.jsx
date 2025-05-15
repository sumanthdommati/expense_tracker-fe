import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Predictions = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/predictions/');
                setPredictions(response.data);

                // Extract unique categories
                const uniqueCategories = [...new Set(response.data.map((pred) => pred.category))];
                setCategories(uniqueCategories);

            } catch (err) {
                console.error('Error fetching predictions:', err);
                setError('Failed to load predictions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPredictions();
    }, []);

    // Prepare chart data based on selected category
    const getChartData = () => {
        if (selectedCategory === 'all') {
            // Aggregate all categories
            const months = new Set();
            predictions.forEach(catPred => {
                catPred.predictions.forEach(pred => {
                    months.add(pred.month);
                });
            });

            const sortedMonths = Array.from(months).sort((a, b) => {
                const dateA = new Date(a);
                const dateB = new Date(b);
                return dateA.getTime() - dateB.getTime();
            });

            const datasets = predictions.map(catPred => {
                const data = sortedMonths.map(month => {
                    const prediction = catPred.predictions.find(pred => pred.month === month);
                    return prediction ? prediction.predicted_amount : 0;
                });

                return {
                    label: catPred.category,
                    data,
                    borderColor: getRandomColor(catPred.category),
                    backgroundColor: 'transparent',
                    tension: 0.1,
                };
            });

            return {
                labels: sortedMonths,
                datasets,
            };
        } else {
            // Show only selected category
            const categoryData = predictions.find(pred => pred.category === selectedCategory);

            if (!categoryData) {
                return {
                    labels: [],
                    datasets: [],
                };
            }

            const sortedPredictions = [...categoryData.predictions].sort((a, b) => {
                const dateA = new Date(a.month);
                const dateB = new Date(b.month);
                return dateA.getTime() - dateB.getTime();
            });

            return {
                labels: sortedPredictions.map(pred => pred.month),
                datasets: [
                    {
                        label: categoryData.category,
                        data: sortedPredictions.map(pred => pred.predicted_amount),
                        borderColor: getRandomColor(categoryData.category),
                        backgroundColor: 'transparent',
                        tension: 0.1,
                    },
                ],
            };
        }
    };

    // Generate consistent colors for categories
    const getRandomColor = (category) => {
        const colors = [
            '#4F46E5', // indigo-600
            '#7C3AED', // violet-600
            '#EC4899', // pink-600
            '#F59E0B', // amber-500
            '#10B981', // emerald-500
            '#3B82F6', // blue-500
            '#8B5CF6', // purple-500
            '#EF4444', // red-500
        ];

        // Use the category name to pick a consistent color
        const index = category.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // Calculate total predicted expense for next month
    const getTotalPrediction = () => {
        let total = 0;
        predictions.forEach(catPred => {
            if (catPred.predictions.length > 0) {
                // Assume the first prediction is for the next month
                total += catPred.predictions[0].predicted_amount;
            }
        });
        return total.toFixed(2);
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
            <h1 className="text-2xl font-bold text-gray-800">Expense Predictions</h1>

            {/* Prediction Summary */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Predicted Expenses for Next Month</h2>
                <div className="text-3xl font-bold text-indigo-800">₹{getTotalPrediction()}</div>
                <p className="text-gray-500 mt-2">
                    Based on your spending patterns, we predict this will be your total expense next month.
                </p>
            </div>

            {/* Category Selector */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Prediction Chart</h2>
                    <select
                        className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Prediction Chart */}
                <div className="h-80">
                    {predictions.length > 0 ? (
                        <Line
                            data={getChartData()}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Predicted Amount (₹)'
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Month'
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Future Expense Predictions'
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                return `${context.dataset.label}: ₹${context.parsed.y.toFixed(2)}`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    ) : (
                        <div className="flex justify-center items-center h-full text-gray-500">
                            No prediction data available
                        </div>
                    )}
                </div>
            </div>

            {/* Prediction Details */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Prediction Details</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Month</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2 Months Later</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3 Months Later</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {predictions.length > 0 ? (
                                predictions.map((catPred, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{catPred.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ₹{catPred.predictions[0]?.predicted_amount.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ₹{catPred.predictions[1]?.predicted_amount.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ₹{catPred.predictions[2]?.predicted_amount.toFixed(2) || '0.00'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        No prediction data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-indigo-800 mb-2">How We Make Predictions</h3>
                    <p className="text-gray-700">
                        Our AI analyzes your spending patterns, seasonal trends, and recurring expenses to predict future spending.
                        These predictions become more accurate as you add more expense data to the system.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Predictions;
