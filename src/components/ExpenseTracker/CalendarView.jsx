// client/src/components/ExpenseTracker/CalendarView.jsx
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CalendarView = ({ selectedDate, onDateSelect, expenses }) => {
    const [currentMonth, setCurrentMonth] = React.useState(selectedDate);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Group expenses by date for quick lookup
    const expensesByDate = expenses.reduce((acc, expense) => {
        const dateKey = format(new Date(expense.date), 'yyyy-MM-dd');
        if (!acc[dateKey]) {
            acc[dateKey] = 0;
        }
        acc[dateKey] += expense.amount;
        return acc;
    }, {});

    const navigateMonth = (direction) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + direction);
        setCurrentMonth(newMonth);
    };

    const getDayClass = (day) => {
        const baseClasses = "h-8 w-8 lg:h-10 lg:w-10 rounded-full flex items-center justify-center transition-colors text-sm lg:text-base";

        if (!isSameMonth(day, currentMonth)) {
            return `${baseClasses} text-gray-300`;
        }

        if (isSameDay(day, selectedDate)) {
            return `${baseClasses} bg-primary-600 text-white`;
        }

        const dateKey = format(day, 'yyyy-MM-dd');
        const hasExpenses = expensesByDate[dateKey] > 0;

        if (hasExpenses) {
            return `${baseClasses} bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer`;
        }

        return `${baseClasses} hover:bg-gray-100 cursor-pointer text-gray-700`;
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
                <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <FiChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>

                <h3 className="text-base lg:text-lg font-semibold text-gray-900 text-center">
                    {format(currentMonth, 'MMMM yyyy')}
                </h3>

                <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <FiChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-2 lg:mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-center text-xs lg:text-sm font-medium text-gray-500 py-1 lg:py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 lg:gap-2">
                {daysInMonth.map(day => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayExpenses = expensesByDate[dateKey] || 0;

                    return (
                        <div
                            key={day.toString()}
                            className="flex flex-col items-center"
                        >
                            <button
                                onClick={() => onDateSelect(day)}
                                className={getDayClass(day)}
                            >
                                {format(day, 'd')}
                            </button>

                            {dayExpenses > 0 && (
                                <div className="mt-1 text-xs text-red-600 font-medium hidden sm:block">
                                    ${dayExpenses.toFixed(0)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 lg:mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-red-100"></div>
                        <span>Has Expenses</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;