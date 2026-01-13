// client/src/components/SalaryTracker/index.jsx
import React, { useState } from 'react';
import JobManager from './JobManager';
import WorkEntryForm from './WorkEntryForm';
import SalaryProgress from './SalaryProgress';
import WorkHistory from './WorkHistory';

const SalaryTracker = ({
    jobs,
    setJobs,
    workEntries,
    setWorkEntries,
    salaryPayments,
    setSalaryPayments,
    fetchUserData
}) => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [activeSection, setActiveSection] = useState('jobs'); // 'jobs', 'entries', 'progress'

    // Calculate totals for each job
    const jobStats = jobs.map(job => {
        const jobEntries = workEntries.filter(entry => entry.job?._id === job._id);
        const totalEarned = jobEntries.reduce((sum, entry) => sum + entry.amount, 0);

        const jobPayments = salaryPayments.filter(payment => payment.job?._id === job._id);
        const totalReceived = jobPayments.reduce((sum, payment) => sum + payment.amount, 0);

        return {
            ...job,
            totalEarned,
            totalReceived,
            pending: totalEarned - totalReceived
        };
    });

    // Mobile Navigation
    const MobileNav = () => (
        <div className="lg:hidden mb-4">
            <div className="flex border-b border-gray-200">
                {[
                    { id: 'jobs', label: 'Jobs' },
                    { id: 'entries', label: 'Entries' },
                    { id: 'progress', label: 'Progress' }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeSection === item.id
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Salary Tracker</h2>
                <div className="text-xs lg:text-sm text-gray-600">
                    {jobs.length} jobs, {workEntries.length} entries
                </div>
            </div>

            <MobileNav />

            <div className="lg:hidden">
                {activeSection === 'jobs' && (
                    <div className="space-y-4">
                        <JobManager
                            jobs={jobs}
                            setJobs={setJobs}
                            selectedJob={selectedJob}
                            setSelectedJob={setSelectedJob}
                            fetchUserData={fetchUserData}
                        />
                        <WorkEntryForm
                            jobs={jobs}
                            selectedJob={selectedJob}
                            onAddEntry={(entry) => setWorkEntries(prev => [...prev, entry])}
                            fetchUserData={fetchUserData}
                        />
                    </div>
                )}

                {activeSection === 'entries' && (
                    <WorkHistory
                        workEntries={workEntries}
                        jobs={jobs}
                        onDeleteEntry={(id) => setWorkEntries(prev => prev.filter(entry => entry._id !== id))}
                        fetchUserData={fetchUserData}
                    />
                )}

                {activeSection === 'progress' && (
                    <SalaryProgress
                        jobStats={jobStats}
                        onAddPayment={(jobId, amount) => {
                            // Implement payment logic
                            console.log('Add payment:', jobId, amount);
                        }}
                        fetchUserData={fetchUserData}
                    />
                )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
                {/* Left Column - Job Management */}
                <div className="lg:col-span-2 space-y-6">
                    <JobManager
                        jobs={jobs}
                        setJobs={setJobs}
                        selectedJob={selectedJob}
                        setSelectedJob={setSelectedJob}
                        fetchUserData={fetchUserData}
                    />

                    <WorkEntryForm
                        jobs={jobs}
                        selectedJob={selectedJob}
                        onAddEntry={(entry) => setWorkEntries(prev => [...prev, entry])}
                        fetchUserData={fetchUserData}
                    />

                    <WorkHistory
                        workEntries={workEntries}
                        jobs={jobs}
                        onDeleteEntry={(id) => setWorkEntries(prev => prev.filter(entry => entry._id !== id))}
                        fetchUserData={fetchUserData}
                    />
                </div>

                {/* Right Column - Salary Progress */}
                <div>
                    <SalaryProgress
                        jobStats={jobStats}
                        onAddPayment={(jobId, amount) => {
                            // Implement payment logic
                            console.log('Add payment:', jobId, amount);
                        }}
                        fetchUserData={fetchUserData}
                    />
                </div>
            </div>
        </div>
    );
};

export default SalaryTracker;