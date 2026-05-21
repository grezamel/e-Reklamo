import { Link, usePage } from '@inertiajs/react';
import PersonnelLayout from '@/Layouts/PersonnelLayout';

const statusConfig = {
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800' },
    acknowledged: { label: 'Acknowledged', cls: 'bg-blue-100 text-blue-800' },
    'in-progress': { label: 'In Progress', cls: 'bg-purple-100 text-purple-800' },
    resolved: { label: 'Resolved', cls: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800' },
};

export default function Dashboard({ stats, recentComplaints = [], departments = [] }) {
    const { auth } = usePage().props;
    const personnel = auth?.personnel;

    return (
        <PersonnelLayout>
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500">Real-time monitoring of citizen complaints</p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Complaints', value: stats.total, icon: '📋', color: 'border-blue-500', textColor: 'text-blue-600' },
                        { label: 'Pending', value: stats.pending, icon: '⏳', color: 'border-yellow-500', textColor: 'text-yellow-600' },
                        { label: 'In Progress', value: stats.in_progress, icon: '🔄', color: 'border-purple-500', textColor: 'text-purple-600' },
                        { label: 'Resolved', value: stats.resolved, icon: '✅', color: 'border-green-500', textColor: 'text-green-600' },
                    ].map((card, i) => (
                        <div key={i} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${card.color}`}>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-500">{card.label}</p>
                                <span className="text-lg">{card.icon}</span>
                            </div>
                            <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent complaints */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-900">Recent Complaints</h2>
                            <Link href={route('personnel.complaints.index')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                View all →
                            </Link>
                        </div>
                        {recentComplaints.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-400">No complaints yet</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {recentComplaints.map(c => (
                                    <Link key={c.id} href={route('personnel.complaints.show', c.id)}
                                        className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-gray-900 text-sm truncate">{c.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {c.is_anonymous ? 'Anonymous' : c.citizen?.name} • {c.location}
                                            </p>
                                            <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`ml-3 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusConfig[c.status]?.cls}`}>
                                            {statusConfig[c.status]?.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Department performance */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-900">Department Performance</h2>
                        </div>
                        <div className="p-5 space-y-4">
                            {departments.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">No data available</p>
                            ) : (
                                departments.map(dept => {
                                    const total = dept.complaints_count || 0;
                                    const resolved = dept.resolved_count || 0;
                                    const pct = total > 0 ? Math.round((resolved / total) * 100) : 0;
                                    return (
                                        <div key={dept.id}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">{dept.name}</span>
                                                <span className="text-gray-500">{resolved}/{total}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <Link href={route('personnel.complaints.index')}
                        className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition border-t-4 border-blue-500 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">Manage Complaints</p>
                            <p className="text-xs text-gray-500">View & update status</p>
                        </div>
                    </Link>

                    <Link href={route('personnel.analytics')}
                        className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition border-t-4 border-emerald-500 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">Analytics</p>
                            <p className="text-xs text-gray-500">Performance reports</p>
                        </div>
                    </Link>

                    {personnel?.is_admin && (
                        <Link href={route('personnel.personnel.index')}
                            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition border-t-4 border-purple-500 flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Manage Users</p>
                                <p className="text-xs text-gray-500">Personnel & citizens</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </PersonnelLayout>
    );
}
