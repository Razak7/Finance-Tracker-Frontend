// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiDollarSign,
    FiTrendingUp,
    FiPieChart,
    FiCalendar,
    FiLogOut,
    FiUser,
    FiCalendar as FiCalendarIcon,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import ExpenseTracker from '../components/ExpenseTracker';
import SalaryTracker from '../components/SalaryTracker';
import { expensesAPI, jobsAPI, workEntriesAPI, salaryPaymentsAPI } from '../utils/api';
import { formatCurrency, getMonthRange } from '../utils/helpers';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('expenses');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [workEntries, setWorkEntries] = useState([]);
    const [salaryPayments, setSalaryPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const [expensesRes, jobsRes, workEntriesRes, salaryPaymentsRes] = await Promise.all([
                expensesAPI.getAll(),
                jobsAPI.getAll(),
                workEntriesAPI.getAll(),
                salaryPaymentsAPI.getAll()
            ]);

            setExpenses(expensesRes.data);
            setJobs(jobsRes.data);
            setWorkEntries(workEntriesRes.data);
            setSalaryPayments(salaryPaymentsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401) {
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get selected month range
    const monthRange = getMonthRange(selectedMonth);
    const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    const shortMonthName = selectedMonth.toLocaleString('default', { month: 'short' });

    // Filter expenses for selected month
    const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= monthRange.start && expenseDate <= monthRange.end;
    });

    // Filter work entries for selected month
    const currentMonthWorkEntries = workEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= monthRange.start && entryDate <= monthRange.end;
    });

    // Filter salary payments for selected month
    const currentMonthSalaryPayments = salaryPayments.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= monthRange.start && paymentDate <= monthRange.end;
    });

    // Calculate dashboard stats for SELECTED MONTH ONLY
    const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalEarned = currentMonthWorkEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalReceived = currentMonthSalaryPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPending = totalEarned - totalReceived;

    // Navigation between months
    const navigateMonth = (direction) => {
        const newMonth = new Date(selectedMonth);
        newMonth.setMonth(newMonth.getMonth() + direction);
        setSelectedMonth(newMonth);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            {sidebarOpen ? '✕' : '☰'}
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Finance Manager</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <FiLogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex pt-16 lg:pt-0">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={`
          fixed lg:static inset-y-0 left-0 transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          w-64 lg:w-64 xl:w-72 z-40
        `}>
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onClose={() => setSidebarOpen(false)}
                        user={user}
                        onLogout={handleLogout}
                    />
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-6 lg:p-8 w-full">
                    {/* Desktop Header */}
                    <header className="mb-6 lg:mb-8 hidden lg:block">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Personal Finance Manager</h1>
                                <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">
                                    Welcome back, {user?.name}!
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FiUser className="w-5 h-5" />
                                    <span className="font-medium">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="btn-secondary flex items-center space-x-2"
                                >
                                    <FiLogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Month Navigation */}
                    <div className="mb-6 lg:mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Monthly Overview</h2>
                                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                                    Here's your financial summary for {monthName}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <FiChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                                    <FiCalendarIcon className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium text-gray-900">{monthName}</span>
                                </div>
                                <button
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <FiChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Month Stats Bar */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-600">Expenses</span>
                                    <span className="text-xs font-bold text-red-600">{currentMonthExpenses.length}</span>
                                </div>
                                <div className="mt-1 text-lg font-bold text-gray-900">{formatCurrency(totalExpenses)}</div>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-600">Work Entries</span>
                                    <span className="text-xs font-bold text-blue-600">{currentMonthWorkEntries.length}</span>
                                </div>
                                <div className="mt-1 text-lg font-bold text-gray-900">{formatCurrency(totalEarned)}</div>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-600">Salary Received</span>
                                    <span className="text-xs font-bold text-green-600">{currentMonthSalaryPayments.length}</span>
                                </div>
                                <div className="mt-1 text-lg font-bold text-gray-900">{formatCurrency(totalReceived)}</div>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-600">Net Balance</span>
                                    <span className={`text-xs font-bold ${(totalEarned - totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {(totalEarned - totalExpenses) >= 0 ? '+' : ''}{formatCurrency(totalEarned - totalExpenses)}
                                    </span>
                                </div>
                                <div className={`mt-1 text-lg font-bold ${(totalEarned - totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(totalEarned - totalExpenses)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                        <div className="card">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="p-2 lg:p-3 bg-blue-100 rounded-lg">
                                        <FiDollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-3 lg:ml-4">
                                        <p className="text-xs lg:text-sm text-gray-600">Total Expenses</p>
                                        <p className="text-lg lg:text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {shortMonthName}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                {currentMonthExpenses.length} expense{currentMonthExpenses.length !== 1 ? 's' : ''} this month
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="p-2 lg:p-3 bg-green-100 rounded-lg">
                                        <FiTrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                                    </div>
                                    <div className="ml-3 lg:ml-4">
                                        <p className="text-xs lg:text-sm text-gray-600">Total Earned</p>
                                        <p className="text-lg lg:text-2xl font-bold text-gray-900">{formatCurrency(totalEarned)}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                    {shortMonthName}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                {currentMonthWorkEntries.length} work entr{currentMonthWorkEntries.length !== 1 ? 'ies' : 'y'} this month
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="p-2 lg:p-3 bg-purple-100 rounded-lg">
                                        <FiPieChart className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                                    </div>
                                    <div className="ml-3 lg:ml-4">
                                        <p className="text-xs lg:text-sm text-gray-600">Total Received</p>
                                        <p className="text-lg lg:text-2xl font-bold text-gray-900">{formatCurrency(totalReceived)}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                    {shortMonthName}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                {currentMonthSalaryPayments.length} payment{currentMonthSalaryPayments.length !== 1 ? 's' : ''} received
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="p-2 lg:p-3 bg-yellow-100 rounded-lg">
                                        <FiCalendar className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-3 lg:ml-4">
                                        <p className="text-xs lg:text-sm text-gray-600">Pending Salary</p>
                                        <p className="text-lg lg:text-2xl font-bold text-gray-900">{formatCurrency(totalPending)}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                                    {shortMonthName}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500">
                                {totalPending > 0 ? 'Awaiting payment' : 'All cleared'}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bars for Monthly Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Expense Progress */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Daily Average</span>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(totalExpenses / new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate())}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${Math.min((totalExpenses / (totalExpenses + totalEarned || 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Highest Category</span>
                                        <span className="font-medium text-gray-900">
                                            {(() => {
                                                const categories = {};
                                                currentMonthExpenses.forEach(expense => {
                                                    categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
                                                });
                                                const highest = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
                                                return highest ? highest[0] : 'None';
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Income Progress */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Overview</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Earned vs Received</span>
                                        <span className="font-medium text-gray-900">
                                            {totalEarned > 0 ? `${Math.round((totalReceived / totalEarned) * 100)}%` : '0%'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full"
                                            style={{ width: `${Math.min((totalReceived / (totalEarned || 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Net Balance</span>
                                        <span className={`font-medium ${(totalEarned - totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(totalEarned - totalExpenses)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${(totalEarned - totalExpenses) >= 0 ? 'bg-green-600' : 'bg-red-600'}`}
                                            style={{ width: `${Math.min(Math.abs(totalEarned - totalExpenses) / Math.max(totalEarned, totalExpenses, 1) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="card">
                        {activeTab === 'expenses' && (
                            <ExpenseTracker
                                expenses={expenses}
                                setExpenses={setExpenses}
                                fetchUserData={fetchUserData}
                            />
                        )}

                        {activeTab === 'salary' && (
                            <SalaryTracker
                                jobs={jobs}
                                setJobs={setJobs}
                                workEntries={workEntries}
                                setWorkEntries={setWorkEntries}
                                salaryPayments={salaryPayments}
                                setSalaryPayments={setSalaryPayments}
                                fetchUserData={fetchUserData}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;