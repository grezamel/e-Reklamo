import { useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('citizen.register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <>
            <Head title="Sign Up - e-Reklamo" />
            <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center px-4 py-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50 pointer-events-none" />

                <div className="relative z-10 w-full max-w-sm">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-3">
                            <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-blue-900">e-Reklamo</h1>
                        <p className="text-gray-500 text-sm mt-1">Welcome!</p>
                        <p className="text-xs text-gray-400 mt-1">Sign up or login and start voicing out community issues.</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex mb-6 border-b border-gray-200">
                        <Link href={route('login')} className="flex-1 py-2 text-sm font-semibold text-gray-400 text-center hover:text-emerald-600 transition">
                            Login
                        </Link>
                        <button className="flex-1 py-2 text-sm font-semibold text-emerald-600 border-b-2 border-emerald-500">
                            Sign up
                        </button>
                    </div>

                    <form onSubmit={submit} className="space-y-3">
                        <div>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                placeholder="Full Name" autoFocus
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        <div>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                placeholder="Email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div>
                            <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                placeholder="Phone Number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                            <InputError message={errors.phone} className="mt-1" />
                        </div>

                        <div>
                            <input type="text" value={data.address} onChange={e => setData('address', e.target.value)}
                                placeholder="Address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                            <InputError message={errors.address} className="mt-1" />
                        </div>

                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={data.password}
                                onChange={e => setData('password', e.target.value)} placeholder="Password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-10" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        <div className="relative">
                            <input type={showConfirm ? 'text' : 'password'} value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)} placeholder="Confirm password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-10" />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50 mt-2">
                            {processing ? 'Creating account...' : 'Sign up'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link href={route('login')} className="text-emerald-600 font-semibold hover:text-emerald-700">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
