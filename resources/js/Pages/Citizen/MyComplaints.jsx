import { useState } from 'react';
import { Link } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';

const statusConfig = {
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800' },
    acknowledged: { label: 'Acknowledged', cls: 'bg-blue-100 text-blue-800' },
    'in-progress': { label: 'In Progress', cls: 'bg-purple-100 text-purple-800' },
    resolved: { label: 'Resolved', cls: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800' },
};

export default function MyComplaints({ complaints }) {
    const [filter, setFilter] = useState('');
    const items = complaints.data || [];
    const filtered = filter ? items.filter(c => c.status === filter) : items;

    return (
        <CitizenLayout>
            <div className="p-4 sm:p-6 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">My Complaints</h1>
                        <p className="text-sm text-gray-500">Track all your submitted complaints</p>
                    </div>
                    <Link href={route('citizen.complaints.new')}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Complaint
                    </Link>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {['', 'pending', 'acknowledged', 'in-progress', 'resolved', 'rejected'].map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                                filter === s
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}>
                            {s === '' ? 'All' : statusConfig[s]?.label}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl p-10 text-center shadow-sm">
                        <p className="text-gray-500 text-sm">No complaints found</p>
                        <Link href={route('citizen.complaints.new')}
                            className="mt-3 inline-block text-sm text-emerald-600 font-semibold">
                            Submit a complaint →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(c => (
                            <Link key={c.id} href={route('citizen.complaints.show', c.id)}
                                className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-gray-400">{c.reference_number}</span>
                                            {c.is_anonymous && (
                                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Anonymous</span>
                                            )}
                                        </div>
                                        <p className="font-semibold text-gray-900 text-sm truncate">{c.title}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                            <span>{c.department?.name}</span>
                                            <span>•</span>
                                            <span>{c.location}</span>
                                            <span>•</span>
                                            <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusConfig[c.status]?.cls}`}>
                                        {statusConfig[c.status]?.label}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {complaints.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {complaints.links?.map((link, i) => (
                            link.url ? (
                                <Link key={i} href={link.url}
                                    className={`px-3 py-1.5 rounded text-sm ${link.active ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={i} className="px-3 py-1.5 rounded text-sm text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            )
                        ))}
                    </div>
                )}
            </div>
        </CitizenLayout>
    );
}
