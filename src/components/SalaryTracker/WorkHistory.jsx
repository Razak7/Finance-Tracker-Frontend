// client/src/components/SalaryTracker/WorkHistory.jsx
import React from 'react';
import { format } from 'date-fns';
import { FiTrash2, FiCalendar, FiBriefcase } from 'react-icons/fi';
import { formatCurrency } from '../../utils/helpers';
import { workEntriesAPI } from '../../utils/api';

const WorkHistory = ({ workEntries, jobs, onDeleteEntry, fetchUserData }) => {
    const [loading, setLoading] = React.useState(false);

    if (workEntries.length === 0) {
        return (
            <div className="card text-center py-12">
                <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No work entries yet</h3>
                <p className="text-gray-600">Add your first work entry to start tracking</p>
            </div>
        );
    }

    // Sort entries by date (newest first)
    const sortedEntries = [...workEntries].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this work entry?')) {
            return;
        }

        try {
            setLoading(true);
            await workEntriesAPI.delete(id);
            onDeleteEntry(id);
            await fetchUserData();
        } catch (error) {
            console.error('Error deleting work entry:', error);
            alert('Error deleting work entry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Work History</h3>
                <span className="text-sm text-gray-600">
                    {workEntries.length} entries total
                </span>
            </div>

            <div className="space-y-3">
                {sortedEntries.map(entry => {
                    const job = jobs.find(j => j._id === entry.job?._id);

                    return (
                        <div
                            key={entry._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FiBriefcase className="w-4 h-4 text-blue-600" />
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {job?.name || 'Unknown Job'}
                                        </h4>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <FiCalendar className="w-3 h-3" />
                                                <span>{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="font-bold text-gray-900">
                                    {formatCurrency(entry.amount)}
                                </span>

                                <button
                                    onClick={() => handleDelete(entry._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    disabled={loading}
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorkHistory;