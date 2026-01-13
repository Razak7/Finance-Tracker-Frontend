// client/src/components/ExpenseTracker/index.jsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import CalendarView from './CalendarView';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseSummary from './ExpenseSummary';
import { getMonthRange, formatCurrency } from '../../utils/helpers';
import { expensesAPI } from '../../utils/api';

const ExpenseTracker = ({ expenses, setExpenses, fetchUserData }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editingExpense, setEditingExpense] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // Filter expenses for selected date
    const dateExpenses = expenses.filter(expense =>
        format(new Date(expense.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );

    // Calculate totals
    const dailyTotal = dateExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const monthRange = getMonthRange(selectedDate);
    const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= monthRange.start && expenseDate <= monthRange.end;
    });
    const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const handleAddExpense = async (expenseData) => {
        try {
            setLoading(true);

            if (editingExpense) {
                // Update existing expense
                const response = await expensesAPI.update(editingExpense._id, expenseData);
                setExpenses(prev => prev.map(exp =>
                    exp._id === editingExpense._id ? response.data : exp
                ));
                setEditingExpense(null);
            } else {
                // Add new expense
                const response = await expensesAPI.create(expenseData);
                setExpenses(prev => [...prev, response.data]);
            }

            await fetchUserData();
            setIsFormVisible(false);
        } catch (error) {
            console.error('Error saving expense:', error);
            alert('Error saving expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setIsFormVisible(true);
    };

    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        try {
            setLoading(true);
            await expensesAPI.delete(expenseId);
            setExpenses(prev => prev.filter(exp => exp._id !== expenseId));
            await fetchUserData();
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('Error deleting expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAllForDate = async () => {
        if (!window.confirm('Are you sure you want to delete all expenses for this date?')) {
            return;
        }

        try {
            setLoading(true);
            const deletePromises = dateExpenses.map(expense =>
                expensesAPI.delete(expense._id)
            );
            await Promise.all(deletePromises);
            setExpenses(prev => prev.filter(exp =>
                format(new Date(exp.date), 'yyyy-MM-dd') !== format(selectedDate, 'yyyy-MM-dd')
            ));
            await fetchUserData();
        } catch (error) {
            console.error('Error deleting expenses:', error);
            alert('Error deleting expenses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Expense Tracker</h2>
                <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div className="text-xs lg:text-sm text-gray-600">
                        Selected: {format(selectedDate, 'MMM d, yyyy')}
                    </div>
                    <button
                        onClick={() => setIsFormVisible(!isFormVisible)}
                        className="lg:hidden btn-primary px-3 py-2 text-sm"
                        disabled={loading}
                    >
                        {isFormVisible ? 'Hide Form' : 'Add Expense'}
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
            )}

            {/* Mobile Form Toggle */}
            {isFormVisible && (
                <div className="lg:hidden">
                    <ExpenseForm
                        selectedDate={selectedDate}
                        onSubmit={handleAddExpense}
                        editingExpense={editingExpense}
                        onCancel={() => {
                            setEditingExpense(null);
                            setIsFormVisible(false);
                        }}
                        loading={loading}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Left Column - Calendar & List */}
                <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                    <CalendarView
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        expenses={expenses}
                    />

                    <ExpenseList
                        expenses={dateExpenses}
                        onEdit={handleEditExpense}
                        onDelete={handleDeleteExpense}
                        onDeleteAll={handleDeleteAllForDate}
                        loading={loading}
                    />
                </div>

                {/* Right Column - Form & Summary */}
                <div className="space-y-4 lg:space-y-6">
                    <div className="hidden lg:block">
                        <ExpenseForm
                            selectedDate={selectedDate}
                            onSubmit={handleAddExpense}
                            editingExpense={editingExpense}
                            onCancel={() => setEditingExpense(null)}
                            loading={loading}
                        />
                    </div>

                    <ExpenseSummary
                        dailyTotal={dailyTotal}
                        monthlyTotal={monthlyTotal}
                        selectedDate={selectedDate}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;