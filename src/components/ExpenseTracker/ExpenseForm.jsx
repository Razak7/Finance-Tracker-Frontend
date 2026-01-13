// client/src/components/ExpenseTracker/ExpenseForm.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FiTag, FiDollarSign, FiSave, FiX } from 'react-icons/fi';

const ExpenseForm = ({ selectedDate, onSubmit, editingExpense, onCancel, loading }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');

    const categories = [
        'Food', 'Transport', 'Shopping', 'Entertainment',
        'Bills', 'Healthcare', 'Education', 'Other'
    ];

    useEffect(() => {
        if (editingExpense) {
            setTitle(editingExpense.title);
            setAmount(editingExpense.amount.toString());
            setCategory(editingExpense.category);
        } else {
            resetForm();
        }
    }, [editingExpense]);

    const resetForm = () => {
        setTitle('');
        setAmount('');
        setCategory('Food');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim() || !amount || parseFloat(amount) <= 0) {
            alert('Please enter valid title and amount');
            return;
        }

        onSubmit({
            title: title.trim(),
            amount: parseFloat(amount),
            category,
            date: selectedDate.toISOString()
        });

        if (!editingExpense) {
            resetForm();
        }
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                    {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                    {format(selectedDate, 'MMM d, yyyy')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        Expense Title
                    </label>
                    <div className="relative">
                        <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input-field pl-9 lg:pl-10 text-sm lg:text-base"
                            placeholder="Enter expense title"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-field text-sm lg:text-base"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        Amount ($)
                    </label>
                    <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="input-field pl-9 lg:pl-10 text-sm lg:text-base"
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 pt-3 lg:pt-4">
                    <button
                        type="submit"
                        className="btn-primary flex-1 flex items-center justify-center space-x-2 text-sm lg:text-base py-2 lg:py-2.5"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <FiSave className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span>{editingExpense ? 'Update' : 'Add Expense'}</span>
                            </>
                        )}
                    </button>

                    {editingExpense && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn-secondary flex items-center justify-center space-x-2 px-4 py-2 lg:py-2.5 text-sm lg:text-base"
                            disabled={loading}
                        >
                            <FiX className="w-3 h-3 lg:w-4 lg:h-4" />
                            <span>Cancel</span>
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ExpenseForm;