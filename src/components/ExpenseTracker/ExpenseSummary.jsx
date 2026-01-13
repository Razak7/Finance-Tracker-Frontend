// client/src/components/ExpenseTracker/ExpenseSummary.jsx
import React from 'react';
import { FiDollarSign, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { format, getMonth, getYear } from 'date-fns';
import { formatCurrency } from '../../utils/helpers';

const ExpenseSummary = ({ dailyTotal, monthlyTotal, selectedDate }) => {
    // Calculate percentage of month passed
    const currentMonth = getMonth(selectedDate);
    const currentYear = getYear(selectedDate);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayOfMonth = selectedDate.getDate();
    const monthProgress = (dayOfMonth / daysInMonth) * 100;

    // Calculate average daily expense
    const averageDaily = dayOfMonth > 0 ? monthlyTotal / dayOfMonth : 0;
    
    // Projected monthly total based on current average
    const projectedMonthly = averageDaily * daysInMonth;

    return (
        <div className="card">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Summary</h3>

            <div className="space-y-4 lg:space-y-6">
                {/* Daily Total */}
                <div className="bg-blue-50 rounded-lg p-3 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="p-1.5 lg:p-2 bg-blue-100 rounded-lg">
                                <FiDollarSign className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs lg:text-sm text-gray-600">Daily Total</p>
                                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                                    {formatCurrency(dailyTotal)}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs lg:text-sm text-blue-600 font-medium whitespace-nowrap">
                            {format(selectedDate, 'MMM d')}
                        </span>
                    </div>
                </div>

                {/* Monthly Total */}
                <div className="bg-green-50 rounded-lg p-3 lg:p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="p-1.5 lg:p-2 bg-green-100 rounded-lg">
                                <FiCalendar className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs lg:text-sm text-gray-600">Monthly Total</p>
                                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                                    {formatCurrency(monthlyTotal)}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs lg:text-sm text-green-600 font-medium whitespace-nowrap">
                            {format(selectedDate, 'MMMM')}
                        </span>
                    </div>
                </div>

                {/* Month Progress */}
                <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs lg:text-sm font-medium text-gray-700">Month Progress</span>
                        <span className="text-xs lg:text-sm font-bold text-gray-900">{Math.round(monthProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 lg:h-2">
                        <div
                            className="bg-primary-600 h-1.5 lg:h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(monthProgress, 100)}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Day {dayOfMonth}</span>
                        <span>of {daysInMonth}</span>
                    </div>
                </div>

                {/* Projection */}
                <div className="bg-purple-50 rounded-lg p-3 lg:p-4">
                    <div className="flex items-center gap-2 lg:gap-3">
                        <div className="p-1.5 lg:p-2 bg-purple-100 rounded-lg">
                            <FiTrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs lg:text-sm text-gray-600">Projected Monthly</p>
                            <p className="text-base lg:text-lg font-bold text-gray-900">
                                {formatCurrency(projectedMonthly)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 lg:mt-1">
                                Based on current daily average
                            </p>
                        </div>
                    </div>
                </div>

                {/* Daily Average */}
                <div className="bg-yellow-50 rounded-lg p-3 lg:p-4">
                    <div className="text-center">
                        <p className="text-xs lg:text-sm text-gray-600">Daily Average</p>
                        <p className="text-base lg:text-xl font-bold text-gray-900">
                            {formatCurrency(averageDaily)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 lg:mt-1">
                            Average spent per day this month
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseSummary;