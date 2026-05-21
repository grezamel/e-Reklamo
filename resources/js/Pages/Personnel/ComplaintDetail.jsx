import { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import PersonnelLayout from '@/Layouts/PersonnelLayout';

const statusConfig = {
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800' },
    acknowledged: { label: 'Acknowledged', cls: 'bg-blue-100 text-blue-800' },
    'in-progress': { label: 'In Progress', cls: 'bg-purple-100 text-purple-800' },
    resolved: { label: 'Resolved', cls: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800' },
};

export default function ComplaintDetail({ complaint, personnelList = [] }) {
    const [showStatusForm, setShowStatusForm] = useState(false);

    const statusForm = useForm({
        status: complaint.status,
        remarks: complaint.remarks || '',
        assigned_to: complaint.assigned_to || '',
    });

    const submitStatus = (e) => {
        e.preventDefault();
        statusForm.post(route('personnel.complaints.updateStatus', complaint.id), {
            onSuccess: () => setShowStatusForm(false),
        });
    };

    return (
        <PersonnelLayout>
            <div className="p-4 sm:p-6 max-w-4xl mx-auto">
                {/* Back */}
                <Link href={route('personnel.complaints.index')}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to complaints
                </Link>

                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-mono text-gray-400 mb-1">{complaint.reference_number}</p>
                            <h1 className="text-lg font-bold text-gray-900">{complaint.title}</h1>
                            <p className="text-sm text-gray-500 mt-1">{complaint.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${statusConfig[complaint.status]?.cls}`}>
                                {statusConfig[complaint.status]?.label}
                            </span>
                            <button onClick={() => setShowStatusForm(!showStatusForm)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">
                                Update Status
                            </button>
                        </div>
                    </div>

                    {/* Status update form */}
                    {showStatusForm && (
                        <form onSubmit={submitStatus} className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">New Status</label>
                                    <select value={statusForm.data.status} onChange={e => statusForm.setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="acknowledged">Acknowledged</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Assign to</label>
                                    <select value={statusForm.data.assigned_to} onChange={e => statusForm.setData('assigned_to', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">Unassigned</option>
                                        {personnelList.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                                <textarea value={statusForm.data.remarks} onChange={e => statusForm.setData('remarks', e.target.value)}
                                    rows={3} placeholder="Add remarks or notes..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" disabled={statusForm.processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                                    {statusForm.processing ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" onClick={() => setShowStatusForm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main details */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <h2 className="font-semibold text-gray-900 mb-3">Complaint Details</h2>
                            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                <div>
                                    <p className="text-xs text-gray-500">Department</p>
                                    <p className="font-medium text-gray-900">{complaint.department?.name || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Category</p>
                                    <p className="font-medium text-gray-900">{complaint.category?.name || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Priority</p>
                                    <p className="font-medium text-gray-900 capitalize">{complaint.priority}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Filed on</p>
                                    <p className="font-medium text-gray-900">{new Date(complaint.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Complainant</p>
                                    <p className="font-medium text-gray-900">
                                        {complaint.is_anonymous ? 'Anonymous' : complaint.citizen?.name || '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Assigned to</p>
                                    <p className="font-medium text-gray-900">{complaint.assignedPersonnel?.name || 'Unassigned'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Description</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{complaint.description}</p>
                            </div>
                            {complaint.remarks && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Remarks</p>
                                    <p className="text-sm text-gray-700">{complaint.remarks}</p>
                                </div>
                            )}
                        </div>

                        {/* Photos */}
                        {complaint.photos && complaint.photos.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <h2 className="font-semibold text-gray-900 mb-3">Photos</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {complaint.photos.map((photo, i) => (
                                        <a key={i} href={`/storage/${photo}`} target="_blank" rel="noreferrer">
                                            <img src={`/storage/${photo}`} alt={`Photo ${i + 1}`}
                                                className="w-full h-28 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h2 className="font-semibold text-gray-900 mb-4">Activity Timeline</h2>
                        {complaint.updates && complaint.updates.length > 0 ? (
                            <div className="space-y-4">
                                {complaint.updates.map((update, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                            {i < complaint.updates.length - 1 && (
                                                <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                                            )}
                                        </div>
                                        <div className="pb-4 min-w-0">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[update.status]?.cls}`}>
                                                {statusConfig[update.status]?.label}
                                            </span>
                                            {update.remarks && (
                                                <p className="text-xs text-gray-600 mt-1">{update.remarks}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-1">
                                                {update.updated_by_name} • {new Date(update.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">No updates yet</p>
                        )}
                    </div>
                </div>
            </div>
        </PersonnelLayout>
    );
}
