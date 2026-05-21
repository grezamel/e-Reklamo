import { useForm } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';
import InputError from '@/Components/InputError';

export default function Profile({ citizen }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: citizen.name || '',
        phone: citizen.phone || '',
        address: citizen.address || '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('citizen.profile.update'));
    };

    return (
        <CitizenLayout>
            <div className="p-4 sm:p-6 max-w-2xl mx-auto">
                <h1 className="text-xl font-bold text-gray-900 mb-5">My Profile</h1>

                <div className="bg-white rounded-xl shadow-sm p-5">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" value={citizen.email} disabled
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                            <InputError message={errors.phone} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input type="text" value={data.address} onChange={e => setData('address', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                            <InputError message={errors.address} className="mt-1" />
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Change Password (optional)</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input type="password" value={data.current_password} onChange={e => setData('current_password', e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                                    <InputError message={errors.current_password} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                                    <InputError message={errors.password} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold text-sm transition disabled:opacity-50">
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </CitizenLayout>
    );
}
