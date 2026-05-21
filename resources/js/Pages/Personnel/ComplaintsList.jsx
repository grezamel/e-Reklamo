import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import PersonnelLayout from '@/Layouts/PersonnelLayout';

const statusConfig = {
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800' },
    acknowledged: { label: 'Acknowledged', cls: 'bg-blue-100 text-blue-800' },
    'in-progress': { label: 'In Progress', cls: 'bg-purple-100 text-purple-800' },
    resolved: { label: 'Resolved', cls: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800' },
};

const priorityConfig = {
    low: 'text-blue-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    urgent: 'text-red-600 font-bold',
};

export default function ComplaintsList({ complaints, departments = [], categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [priority, setPriority] = useState(filters.priority || '');
    const [deptId, setDeptId] = useState(filters.department_id || '');

    const applyFilters = () => {
        router.get(route('personnel.complaints.index'), {
            search, status, priority, department_id: deptId,
        }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch(''); setStatus(''); setPriority(''); setDeptId('');
        router.get(route('personnel.complaints.index'), {}, { preserveState: false });
    };

    const items = complaints.data || [];

    return (
        <PersonnelLayout>
            <div className="p-4 sm:p-6">
                <div className="mb-5">
                    <h1 className="text-xl font-bold text-gray-900">Complaints Management</h1>
                    <p className="text-sm text-gray-500">Manage and track all citizen complaints</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            className="col-span-2 sm:col-span-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />

                        <select value={status} onChange={e => setStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="acknowledged">Acknowledged</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <select value={priority} onChange={e => setPriority(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                            <option value="">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>

                        <select value={deptId} onChange={e => setDeptId(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                            <option value="">All Departments</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>

                        <div className="flex gap-2">
                            <button onClick={applyFilters}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                                Filter
                            </button>
                            <button onClick={resetFilters}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {items.length === 0 ? (
                        <div className="p-10 text-center text-sm text-gray-400">No complaints found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Reference</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Title</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Complainant</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Priority</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">Department</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">Date</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {items.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.reference_number}</td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900">{c.title}</p>
                                                <p className="text-xs text-gray-400">{c.location}</p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                                                {c.is_anonymous ? <span className="italic text-gray-400">Anonymous</span> : c.citizen?.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[c.status]?.cls}`}>
                                                    {statusConfig[c.status]?.label}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-3 text-xs font-semibold hidden md:table-cell ${priorityConfig[c.priority]}`}>
                                                {c.priority}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{c.department?.name}</td>
                                            <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                                                {new Date(c.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Link href={route('personnel.complaints.show', c.id)}
                                                    className="text-blue-600 hover:text-blue-800 font-semibold text-xs">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {complaints.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-5">
                        {complaints.links?.map((link, i) => (
                            link.url ? (
                                <Link key={i} href={link.url}
                                    className={`px-3 py-1.5 rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={i} className="px-3 py-1.5 rounded text-sm text-gray-300 border border-gray-100"
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            )
                        ))}
                    </div>
                )}
            </div>
        </PersonnelLayout>
    );
}
