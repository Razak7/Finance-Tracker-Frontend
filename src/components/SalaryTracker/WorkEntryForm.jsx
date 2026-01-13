// client/src/components/SalaryTracker/WorkEntryForm.jsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiCalendar, FiDollarSign, FiBriefcase } from 'react-icons/fi';
import { workEntriesAPI } from '../../utils/api';

const WorkEntryForm = ({ jobs, selectedJob, onAddEntry, fetchUserData }) => {
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [jobId, setJobId] = useState(selectedJob?._id || '');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!jobId || !amount || parseFloat(amount) <= 0) {
            alert('Please select a job and enter a valid amount');
            return;
        }

        try {
            setLoading(true);
            const response = await workEntriesAPI.create({
                job: jobId,
                date: selectedDate,
                amount: parseFloat(amount)
            });

            onAddEntry(response.data);
            setAmount('');
            await fetchUserData();
        } catch (error) {
            console.error('Error adding work entry:', error);
            alert('Error adding work entry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Add Work Entry</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        <div className="flex items-center space-x-2">
                            <FiCalendar className="w-4 h-4" />
                            <span>Date</span>
                        </div>
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input-field text-sm lg:text-base"
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        <div className="flex items-center space-x-2">
                            <FiBriefcase className="w-4 h-4" />
                            <span>Job</span>
                        </div>
                    </label>
                    <select
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                        className="input-field text-sm lg:text-base"
                        required
                        disabled={loading}
                    >
                        <option value="">Select a job</option>
                        {jobs.map(job => (
                            <option key={job._id} value={job._id}>{job.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2">
                        <div className="flex items-center space-x-2">
                            <FiDollarSign className="w-4 h-4" />
                            <span>Amount Earned ($)</span>
                        </div>
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="input-field text-sm lg:text-base"
                        placeholder="Enter amount"
                        min="0.01"
                        step="0.01"
                        required
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full text-sm lg:text-base py-2 lg:py-2.5"
                    disabled={jobs.length === 0 || loading}
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                        </>
                    ) : (
                        'Add Work Entry'
                    )}
                </button>
            </form>
        </div>
    );
};

export default WorkEntryForm;