import { Link } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';

const statusConfig = {
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800', step: 1 },
    acknowledged: { label: 'Acknowledged', cls: 'bg-blue-100 text-blue-800', step: 2 },
    'in-progress': { label: 'In Progress', cls: 'bg-purple-100 text-purple-800', step: 3 },
    resolved: { label: 'Resolved', cls: 'bg-green-100 text-green-800', step: 4 },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800', step: 4 },
};

const steps = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved'];

export default function ComplaintDetail({ complaint }) {
    const currentStep = statusConfig[complaint.status]?.step || 1;
    const isRejected = complaint.status === 'rejected';

    return (
        <CitizenLayout>
            <div className="p-4 sm:p-6 max-w-3xl mx-auto">
                {/* Back */}
                <Link href={route('citizen.complaints.index')}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to complaints
                </Link>

                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                            <p className="text-xs font-mono text-gray-400 mb-1">{complaint.reference_number}</p>
                            <h1 className="text-lg font-bold text-gray-900">{complaint.title}</h1>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold flex-shrink-0 ${statusConfig[complaint.status]?.cls}`}>
                            {statusConfig[complaint.status]?.label}
                        </span>
                    </div>

                    {/* Progress tracker */}
                    {!isRejected && (
                        <div className="mt-4">
                            <div className="flex items-center">
                                {steps.map((step, i) => (
                                    <div key={i} className="flex items-center flex-1 last:flex-none">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                            i + 1 <= currentStep ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                                        }`}>
                                            {i + 1 < currentStep ? '✓' : i + 1}
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className={`flex-1 h-1 mx-1 ${i + 1 < currentStep ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-1">
                                {steps.map((step, i) => (
                                    <span key={i} className={`text-xs ${i + 1 <= currentStep ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                                        {step}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {isRejected && (
                        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-700 font-medium">This complaint was rejected.</p>
                            {complaint.remarks && <p className="text-sm text-red-600 mt-1">{complaint.remarks}</p>}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
                    <h2 className="font-semibold text-gray-900 mb-3">Complaint Details</h2>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-gray-500">Department</p>
                                <p className="font-medium text-gray-900">{complaint.department?.name || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Category</p>
                                <p className="font-medium text-gray-900">{complaint.category?.name || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="font-medium text-gray-900">{complaint.location}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Filed on</p>
                                <p className="font-medium text-gray-900">{new Date(complaint.created_at).toLocaleDateString()}</p>
                            </div>
                            {complaint.assignedPersonnel && (
                                <div>
                                    <p className="text-xs text-gray-500">Assigned to</p>
                                    <p className="font-medium text-gray-900">{complaint.assignedPersonnel.name}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-500">Anonymous</p>
                                <p className="font-medium text-gray-900">{complaint.is_anonymous ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Description</p>
                            <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
                        </div>
                    </div>
                </div>

                {/* Photos */}
                {complaint.photos && complaint.photos.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
                        <h2 className="font-semibold text-gray-900 mb-3">Photos</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {complaint.photos.map((photo, i) => (
                                <a key={i} href={`/storage/${photo}`} target="_blank" rel="noreferrer">
                                    <img src={`/storage/${photo}`} alt={`Photo ${i + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Updates timeline */}
                {complaint.updates && complaint.updates.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h2 className="font-semibold text-gray-900 mb-4">Status Updates</h2>
                        <div className="space-y-4">
                            {complaint.updates.map((update, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                                        {i < complaint.updates.length - 1 && (
                                            <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                                        )}
                                    </div>
                                    <div className="pb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[update.status]?.cls}`}>
                                                {statusConfig[update.status]?.label}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(update.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        {update.remarks && (
                                            <p className="text-sm text-gray-600">{update.remarks}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">by {update.updated_by_name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CitizenLayout>
    );
}
