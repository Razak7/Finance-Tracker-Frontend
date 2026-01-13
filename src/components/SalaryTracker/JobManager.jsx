// client/src/components/SalaryTracker/JobManager.jsx
import React, { useState } from 'react';
import { FiBriefcase, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { jobsAPI } from '../../utils/api';

const JobManager = ({ jobs, setJobs, selectedJob, setSelectedJob, fetchUserData }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [jobName, setJobName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!jobName.trim()) {
            alert('Please enter a job name');
            return;
        }

        try {
            setLoading(true);

            if (editingJob) {
                // Update existing job
                const response = await jobsAPI.update(editingJob._id, { name: jobName.trim() });
                setJobs(prev => prev.map(job =>
                    job._id === editingJob._id ? response.data : job
                ));
                setEditingJob(null);
            } else {
                // Add new job
                const response = await jobsAPI.create({ name: jobName.trim() });
                setJobs(prev => [...prev, response.data]);
                setSelectedJob(response.data);
            }

            setJobName('');
            setIsAdding(false);
            await fetchUserData();
        } catch (error) {
            console.error('Error saving job:', error);
            alert('Error saving job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setJobName(job.name);
        setIsAdding(true);
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) {
            return;
        }

        try {
            setLoading(true);
            await jobsAPI.delete(jobId);
            setJobs(prev => prev.filter(job => job._id !== jobId));
            if (selectedJob?._id === jobId) {
                setSelectedJob(jobs.length > 1 ? jobs[0] : null);
            }
            await fetchUserData();
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Error deleting job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 lg:mb-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">Job Management</h3>
                <button
                    onClick={() => {
                        setIsAdding(true);
                        setEditingJob(null);
                        setJobName('');
                    }}
                    className="btn-primary flex items-center justify-center sm:justify-start space-x-2 text-sm lg:text-base py-2 lg:py-2.5"
                    disabled={loading}
                >
                    <FiPlus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    <span>Add Job</span>
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="mb-4 lg:mb-6 p-3 lg:p-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={jobName}
                            onChange={(e) => setJobName(e.target.value)}
                            className="input-field flex-1 text-sm lg:text-base"
                            placeholder="Enter job name (e.g., Restaurant Server, Tutor)"
                            autoFocus
                            disabled={loading}
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="btn-primary flex-1 sm:flex-none text-sm lg:text-base py-2 lg:py-2.5"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                                    </>
                                ) : editingJob ? 'Update' : 'Add'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingJob(null);
                                    setJobName('');
                                }}
                                className="btn-secondary flex-1 sm:flex-none text-sm lg:text-base py-2 lg:py-2.5"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <div className="space-y-2 lg:space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {jobs.length === 0 ? (
                    <div className="text-center py-6 lg:py-8 text-gray-500">
                        <FiBriefcase className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-3 opacity-50" />
                        <p className="text-sm lg:text-base">No jobs added yet. Add your first job!</p>
                    </div>
                ) : (
                    jobs.map(job => (
                        <div
                            key={job._id}
                            className={`flex items-center justify-between p-3 lg:p-4 rounded-lg border transition-colors ${selectedJob?._id === job._id
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <button
                                onClick={() => setSelectedJob(job)}
                                className="flex-1 text-left min-w-0"
                                disabled={loading}
                            >
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <div className={`p-1.5 lg:p-2 rounded-lg ${selectedJob?._id === job._id ? 'bg-primary-100' : 'bg-gray-100'
                                        }`}>
                                        <FiBriefcase className={`w-4 h-4 lg:w-5 lg:h-5 ${selectedJob?._id === job._id ? 'text-primary-600' : 'text-gray-600'
                                            }`} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-medium text-gray-900 text-sm lg:text-base truncate">{job.name}</h4>
                                    </div>
                                </div>
                            </button>

                            <div className="flex gap-1 lg:gap-2 ml-2">
                                <button
                                    onClick={() => handleEdit(job)}
                                    className="p-1.5 lg:p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    aria-label="Edit job"
                                    disabled={loading}
                                >
                                    <FiEdit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(job._id)}
                                    className="p-1.5 lg:p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    aria-label="Delete job"
                                    disabled={loading}
                                >
                                    <FiTrash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobManager;