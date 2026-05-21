import { Link, usePage } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';

const statusConfig = {
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800' },
    acknowledged: { label: 'Acknowledged', cls: 'bg-blue-100 text-blue-800' },
    'in-progress': { label: 'In Progress', cls: 'bg-purple-100 text-purple-800' },
    resolved: { label: 'Resolved', cls: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800' },
};

export default function Dashboard({ stats, complaints = [] }) {
    const { auth } = usePage().props;

    return (
        <CitizenLayout>
            <div className="p-4 sm:p-6 max-w-5xl mx-auto">
                {/* Welcome banner */}
                <div className="bg-emerald-600 rounded-xl p-5 text-white mb-6">
                    <h1 className="text-xl font-bold">Welcome to e-Reklamo</h1>
                    <p className="text-emerald-100 text-sm mt-1">Your voice matters. Report community issues and track their resolution.</p>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Link href={route('citizen.complaints.new')}
                        className="flex items-center gap-3 p-4 bg-white border-2 border-emerald-500 rounded-xl hover:bg-emerald-50 transition">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-emerald-700 text-sm">Submit Complaint</p>
                            <p className="text-xs text-gray-500">Report a new issue</p>
                        </div>
                    </Link>

                    <Link href={route('citizen.complaints.index')}
                        className="flex items-center gap-3 p-4 bg-white border-2 border-emerald-500 rounded-xl hover:bg-emerald-50 transition">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-emerald-700 text-sm">Track Complaints</p>
                            <p className="text-xs text-gray-500">View your submissions</p>
                        </div>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-gray-900' },
                        { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
                        { label: 'In Progress', value: stats.in_progress, color: 'text-purple-600' },
                        { label: 'Resolved', value: stats.resolved, color: 'text-green-600' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm text-center">
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Recent updates */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Recent Updates</h2>
                    </div>
                    {complaints.length === 0 ? (
                        <div className="p-8 text-center">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500 text-sm">No complaints yet</p>
                            <Link href={route('citizen.complaints.new')}
                                className="mt-3 inline-block text-sm text-emerald-600 font-semibold hover:text-emerald-700">
                                Submit your first complaint →
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {complaints.map(c => (
                                <Link key={c.id} href={route('citizen.complaints.show', c.id)}
                                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{c.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{c.location}</p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[c.status]?.cls}`}>
                                        {statusConfig[c.status]?.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                    {complaints.length > 0 && (
                        <div className="px-5 py-3 border-t border-gray-100">
                            <Link href={route('citizen.complaints.index')} className="text-sm text-emerald-600 font-semibold hover:text-emerald-700">
                                View all complaints →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </CitizenLayout>
    );
}
