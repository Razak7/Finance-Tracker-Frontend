// client/src/components/Layout/Sidebar.jsx
import React from 'react';
import { FiDollarSign, FiBriefcase, FiUser, FiLogOut, FiX } from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab, onClose, user, onLogout }) => {
    const menuItems = [
        { id: 'expenses', label: 'Expense Tracker', icon: FiDollarSign },
        { id: 'salary', label: 'Salary Tracker', icon: FiBriefcase },
    ];

    const handleMenuItemClick = (id) => {
        setActiveTab(id);
        if (onClose) onClose();
    };

    return (
        <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
            {/* Mobile Close Button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">💰 Finance Pro</h2>
                    <p className="text-xs text-gray-600">Manage your money wisely</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <FiX className="w-5 h-5" />
                </button>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">💰 Finance Pro</h2>
                    <p className="text-sm text-gray-600">Manage your money wisely</p>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-6">
                    <div className="p-2 bg-primary-100 rounded-lg">
                        <FiUser className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-600 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 lg:p-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleMenuItemClick(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                                ? 'bg-primary-50 text-primary-600 border border-primary-100'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-sm lg:text-base">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 lg:p-6 border-t border-gray-200">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                >
                    <FiLogOut className="w-5 h-5" />
                    <span className="font-medium text-sm lg:text-base">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar; 