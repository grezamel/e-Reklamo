import { router } from '@inertiajs/react';
import PersonnelLayout from '@/Layouts/PersonnelLayout';

export default function ManageCitizens({ citizens }) {
    const items = citizens.data || [];

    const toggleActive = (citizen) => {
        router.patch(route('personnel.citizens.update', citizen.id), {
            is_active: !citizen.is_active,
        }, { preserveScroll: true });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this citizen account? This will also delete all their complaints.')) {
            router.delete(route('personnel.citizens.destroy', id));
        }
    };

    return (
        <PersonnelLayout>
            <div className="p-4 sm:p-6">
                <div className="mb-5">
                    <h1 className="text-xl font-bold text-gray-900">Citizen Accounts</h1>
                    <p className="text-sm text-gray-500">Manage registered citizen accounts</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {items.length === 0 ? (
                        <div className="p-10 text-center text-sm text-gray-400">No citizens registered yet</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Email</th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Phone</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Complaints</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {items.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                                            <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{c.email}</td>
                                            <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{c.phone || '—'}</td>
                                            <td className="px-4 py-3 text-center text-gray-700 font-semibold">{c.complaints_count}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {c.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => toggleActive(c)}
                                                        className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                                                        {c.is_active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button onClick={() => handleDelete(c.id)}
                                                        className="text-red-500 hover:text-red-700 text-xs font-medium">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {citizens.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-5">
                        {citizens.links?.map((link, i) => (
                            link.url ? (
                                <a key={i} href={link.url}
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
