import { useState } from 'react';
import { router } from '@inertiajs/react';
import PersonnelLayout from '@/Layouts/PersonnelLayout';

const BAR_COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-orange-500'];

function BarChart({ data, labelKey, valueKey, color = 'bg-blue-500' }) {
    const max = Math.max(...data.map(d => d[valueKey]), 1);
    return (
        <div className="space-y-3">
            {data.map((item, i) => (
                <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 truncate max-w-[60%]">{item[labelKey]}</span>
                        <span className="font-semibold text-gray-900">{item[valueKey]}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className={`${color} h-2.5 rounded-full transition-all duration-500`}
                            style={{ width: `${(item[valueKey] / max) * 100}%` }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function TrendChart({ data }) {
    if (!data || data.length === 0) {
        return <p className="text-sm text-gray-400 text-center py-8">No data for selected period</p>;
    }
    const max = Math.max(...data.map(d => d.total), 1);
    return (
        <div className="overflow-x-auto">
            <div className="flex items-end gap-1 h-40 min-w-max px-2">
                {data.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 group" style={{ minWidth: '28px' }}>
                        <div className="relative flex items-end gap-0.5 h-32">
                            <div title={`Resolved: ${day.resolved}`}
                                className="bg-emerald-500 rounded-t w-2 transition-all"
                                style={{ height: `${(day.resolved / max) * 100}%` }} />
                            <div title={`Pending: ${day.pending}`}
                                className="bg-yellow-400 rounded-t w-2 transition-all"
                                style={{ height: `${(day.pending / max) * 100}%` }} />
                            <div title={`Other: ${day.total - day.resolved - day.pending}`}
                                className="bg-blue-400 rounded-t w-2 transition-all"
                                style={{ height: `${Math.max(0, (day.total - day.resolved - day.pending) / max) * 100}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 rotate-45 origin-left whitespace-nowrap" style={{ fontSize: '9px' }}>
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block" /> Resolved</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-sm inline-block" /> Pending</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded-sm inline-block" /> Other</span>
            </div>
        </div>
    );
}

export default function Analytics({ metrics, byPriority, dailyData, byDepartment, departments, filters }) {
    const [dateRange, setDateRange] = useState(filters.date_range || '30');
    const [dept, setDept] = useState(filters.department || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = () => {
        router.get(route('personnel.analytics'), { date_range: dateRange, department: dept, status }, { preserveState: true });
    };

    const handlePrint = () => window.print();

    const priorityData = [
        { name: 'Low', count: byPriority.low || 0 },
        { name: 'Medium', count: byPriority.medium || 0 },
        { name: 'High', count: byPriority.high || 0 },
        { name: 'Urgent', count: byPriority.urgent || 0 },
    ];

    const deptData = (byDepartment || []).map(d => ({ name: d.department, count: d.count }));

    return (
        <PersonnelLayout>
            <div className="p-4 sm:p-6 print:p-0" id="analytics-report">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 print:mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Performance Analytics</h1>
                        <p className="text-sm text-gray-500">Department complaint resolution reports</p>
                    </div>
                    <div className="flex gap-2 print:hidden">
                        <button onClick={handlePrint}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print / PDF
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-5 print:hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Period</label>
                            <select value={dateRange} onChange={e => setDateRange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 90 days</option>
                                <option value="365">Last year</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                            <select value={dept} onChange={e => setDept(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                <option value="">All Departments</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="acknowledged">Acknowledged</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button onClick={applyFilters}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                                Apply
                            </button>
                        </div>
                    </div>
                </div>

                {/* Print header */}
                <div className="hidden print:block mb-6">
                    <h2 className="text-2xl font-bold">e-Reklamo — Analytics Report</h2>
                    <p className="text-gray-500 text-sm">Period: {filters.start_date} to {filters.end_date}</p>
                    <p className="text-gray-500 text-sm">Generated: {new Date().toLocaleString()}</p>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    {[
                        { label: 'Total', value: metrics.total, color: 'border-blue-500 text-blue-600' },
                        { label: 'Resolved', value: metrics.resolved, color: 'border-green-500 text-green-600' },
                        { label: 'In Progress', value: metrics.in_progress, color: 'border-purple-500 text-purple-600' },
                        { label: 'Pending', value: metrics.pending, color: 'border-yellow-500 text-yellow-600' },
                    ].map((m, i) => (
                        <div key={i} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${m.color.split(' ')[0]}`}>
                            <p className="text-xs text-gray-500">{m.label}</p>
                            <p className={`text-3xl font-bold mt-1 ${m.color.split(' ')[1]}`}>{m.value}</p>
                        </div>
                    ))}
                </div>

                {/* Performance metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                    {[
                        { label: 'Resolution Rate', value: `${metrics.resolution_rate}%`, desc: 'Complaints resolved' },
                        { label: 'Avg Response Time', value: `${metrics.avg_response_time}h`, desc: 'Hours to acknowledge' },
                        { label: 'Avg Resolution Time', value: `${metrics.avg_resolution_time}d`, desc: 'Days to resolve' },
                    ].map((m, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                            <p className="text-xs text-gray-500">{m.label}</p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">{m.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{m.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">By Priority</h3>
                        <BarChart data={priorityData} labelKey="name" valueKey="count" color="bg-blue-500" />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">By Department</h3>
                        {deptData.length > 0
                            ? <BarChart data={deptData} labelKey="name" valueKey="count" color="bg-emerald-500" />
                            : <p className="text-sm text-gray-400 text-center py-4">No data</p>
                        }
                    </div>
                </div>

                {/* Trend chart */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Daily Trend</h3>
                    <TrendChart data={dailyData} />
                </div>
            </div>

            {/* Print styles */}
            <style>{`
                @media print {
                    body { background: white; }
                    .print\\:hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                    nav, aside, header { display: none !important; }
                    #analytics-report { padding: 20px; }
                }
            `}</style>
        </PersonnelLayout>
    );
}
