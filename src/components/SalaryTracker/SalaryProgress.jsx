// client/src/components/SalaryTracker/SalaryProgress.jsx
import React, { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiClock, FiPlus } from 'react-icons/fi';
import { formatCurrency } from '../../utils/helpers';
import { salaryPaymentsAPI } from '../../utils/api';

const SalaryProgress = ({ jobStats, onAddPayment, fetchUserData }) => {
    const [selectedJob, setSelectedJob] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const totalEarned = jobStats.reduce((sum, job) => sum + job.totalEarned, 0);
    const totalReceived = jobStats.reduce((sum, job) => sum + job.totalReceived, 0);
    const totalPending = totalEarned - totalReceived;
    const overallProgress = totalEarned > 0 ? (totalReceived / totalEarned) * 100 : 0;

    const handleAddPayment = async (e) => {
        e.preventDefault();

        if (!selectedJob || !paymentAmount || parseFloat(paymentAmount) <= 0) {
            alert('Please select a job and enter a valid amount');
            return;
        }

        try {
            setLoading(true);
            await salaryPaymentsAPI.create({
                job: selectedJob,
                amount: parseFloat(paymentAmount)
            });

            setPaymentAmount('');
            setSelectedJob('');
            await fetchUserData();
            alert('Payment recorded successfully!');
        } catch (error) {
            console.error('Error adding payment:', error);
            alert('Error adding payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Overall Progress</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FiTrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Earned</p>
                                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalEarned)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FiDollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Received</p>
                                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalReceived)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FiClock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Pending</p>
                                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPending)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Payment Progress</span>
                            <span className="text-sm font-bold text-gray-900">{Math.round(overallProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(overallProgress, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Add Salary Payment</h3>

                <form onSubmit={handleAddPayment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Job
                        </label>
                        <select
                            value={selectedJob}
                            onChange={(e) => setSelectedJob(e.target.value)}
                            className="input-field"
                            required
                            disabled={loading || jobStats.length === 0}
                        >
                            <option value="">Choose a job</option>
                            {jobStats.map(job => (
                                <option key={job._id} value={job._id}>
                                    {job.name} (Pending: {formatCurrency(job.pending)})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Amount ($)
                        </label>
                        <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="input-field"
                            placeholder="Enter amount received"
                            min="0.01"
                            step="0.01"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full flex items-center justify-center space-x-2"
                        disabled={loading || jobStats.length === 0}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <FiPlus className="w-4 h-4" />
                                <span>Record Payment</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Job Breakdown</h3>

                <div className="space-y-4">
                    {jobStats.map(job => (
                        <div key={job._id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-gray-900">{job.name}</h4>
                                <span className="text-sm font-bold text-gray-900">{formatCurrency(job.totalEarned)}</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Received:</span>
                                    <span className="text-green-600 font-medium">{formatCurrency(job.totalReceived)}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Pending:</span>
                                    <span className={job.pending > 0 ? "text-yellow-600 font-medium" : "text-gray-600"}>
                                        {formatCurrency(job.pending)}
                                    </span>
                                </div>

                                {job.totalEarned > 0 && (
                                    <div className="pt-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${(job.totalReceived / job.totalEarned) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalaryProgress;