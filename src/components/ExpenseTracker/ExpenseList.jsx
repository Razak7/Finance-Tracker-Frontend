// client/src/components/ExpenseTracker/ExpenseList.jsx
import React from 'react';
import { FiEdit2, FiTrash2, FiDollarSign } from 'react-icons/fi';
import { formatCurrency } from '../../utils/helpers';

const ExpenseList = ({ expenses, onEdit, onDelete, onDeleteAll, loading }) => {
    const getCategoryColor = (category) => {
        const colors = {
            Food: 'bg-green-100 text-green-800',
            Transport: 'bg-blue-100 text-blue-800',
            Shopping: 'bg-purple-100 text-purple-800',
            Entertainment: 'bg-pink-100 text-pink-800',
            Bills: 'bg-red-100 text-red-800',
            Healthcare: 'bg-indigo-100 text-indigo-800',
            Education: 'bg-yellow-100 text-yellow-800',
            Other: 'bg-gray-100 text-gray-800',
        };
        return colors[category] || colors.Other;
    };

    if (expenses.length === 0) {
        return (
            <div className="card text-center py-8 lg:py-12">
                <FiDollarSign className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-3 lg:mb-4" />
                <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-1 lg:mb-2">No expenses for this date</h3>
                <p className="text-xs lg:text-sm text-gray-600">Add your first expense using the form</p>
            </div>
        );
    }

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 lg:mb-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">Daily Expenses</h3>
                <div className="flex items-center justify-between sm:justify-end gap-3 lg:gap-4">
                    <span className="text-base lg:text-lg font-bold text-gray-900">
                        Total: {formatCurrency(totalAmount)}
                    </span>
                    {expenses.length > 0 && (
                        <button
                            onClick={onDeleteAll}
                            className="text-xs lg:text-sm text-danger hover:text-red-700 whitespace-nowrap"
                            disabled={loading}
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-2 lg:space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {expenses.map((expense) => (
                    <div
                        key={expense._id}
                        className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)} whitespace-nowrap w-fit`}>
                                    {expense.category}
                                </span>
                                <h4 className="font-medium text-gray-900 text-sm lg:text-base truncate">
                                    {expense.title}
                                </h4>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 lg:gap-4 ml-2">
                            <span className="font-bold text-gray-900 text-sm lg:text-base whitespace-nowrap">
                                {formatCurrency(expense.amount)}
                            </span>

                            <div className="flex gap-1 lg:gap-2">
                                <button
                                    onClick={() => onEdit(expense)}
                                    className="p-1.5 lg:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    aria-label="Edit expense"
                                    disabled={loading}
                                >
                                    <FiEdit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                </button>

                                <button
                                    onClick={() => onDelete(expense._id)}
                                    className="p-1.5 lg:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    aria-label="Delete expense"
                                    disabled={loading}
                                >
                                    <FiTrash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExpenseList;