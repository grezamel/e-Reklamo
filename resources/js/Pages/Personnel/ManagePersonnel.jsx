import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import PersonnelLayout from '@/Layouts/PersonnelLayout';
import InputError from '@/Components/InputError';

export default function ManagePersonnel({ personnelList, departments = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        department_id: '',
        position: '',
        is_admin: false,
        is_active: true,
    });

    const openAdd = () => {
        reset();
        setEditItem(null);
        setShowForm(true);
    };

    const openEdit = (p) => {
        setEditItem(p);
        setData({ name: p.name, email: p.email, password: '', password_confirmation: '', department_id: p.department_id || '', position: p.position || '', is_admin: p.is_admin, is_active: p.is_active });
        setShowForm(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editItem) {
            patch(route('personnel.personnel.update', editItem.id), {
                onSuccess: () => { setShowForm(false); reset(); setEditItem(null); },
            });
        } else {
            post(route('personnel.personnel.store'), {
                onSuccess: () => { setShowForm(false); reset(); },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Delete this personnel account?')) {
            router.delete(route('personnel.personnel.destroy', id));
        }
    };

    const items = personnelList.data || [];

    return (
        <PersonnelLayout>
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Personnel Management</h1>
                        <p className="text-sm text-gray-500">Manage staff accounts</p>
                    </div>
                    <button onClick={openAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Personnel
                    </button>
                </div>

                {/* Add/Edit form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
                        <h2 className="font-semibold text-gray-900 mb-4">{editItem ? 'Edit Personnel' : 'Add New Personnel'}</h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Password {editItem && <span className="text-gray-400">(leave blank to keep)</span>}
                                    </label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                                    <InputError message={errors.password} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                                    <select value={data.department_id} onChange={e => setData('department_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">Select department</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                    <InputError message={errors.department_id} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                                    <input type="text" value={data.position} onChange={e => setData('position', e.target.value)}
                                        placeholder="e.g. Officer, Supervisor"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                                    <InputError message={errors.position} className="mt-1" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" checked={data.is_admin} onChange={e => setData('is_admin', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                                    Admin privileges
                                </label>
                                {editItem && (
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                                        Active account
                                    </label>
                                )}
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="submit" disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                                    {processing ? 'Saving...' : editItem ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); reset(); setEditItem(null); }}
                                    className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Department</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Position</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Role</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.email}</td>
                                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.department?.name || '—'}</td>
                                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.position || '—'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {p.is_admin ? 'Admin' : 'Staff'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {p.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => openEdit(p)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                                                <button onClick={() => handleDelete(p.id)}
                                                    className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PersonnelLayout>
    );
}
