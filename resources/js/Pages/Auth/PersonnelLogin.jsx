import { useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function PersonnelLogin({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('personnel.login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Personnel Login - e-Reklamo" />
            <div className="min-h-screen bg-gray-100 relative overflow-hidden flex">
                {/* Left panel - branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-blue-900 items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700 rounded-full -translate-y-1/2 translate-x-1/2 opacity-40" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full translate-y-1/2 -translate-x-1/2 opacity-40" />
                    <div className="relative z-10 text-center text-white px-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold mb-2">e-Reklamo</h1>
                        <p className="text-blue-200 text-lg">Manage community complaints</p>
                    </div>
                </div>

                {/* Right panel - login form */}
                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-sm">
                        {/* Mobile logo */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-3">
                                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-blue-900">e-Reklamo</h1>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Personnel Portal</h2>
                        <p className="text-gray-500 text-sm mb-8">Welcome, Admin! Sign in to your account.</p>

                        {status && (
                            <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 p-3 rounded-lg">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    placeholder="Enter your email" autoFocus
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} value={data.password}
                                        onChange={e => setData('password', e.target.value)} placeholder="Enter your password"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-emerald-600 hover:text-emerald-700 font-semibold">
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50">
                                {processing ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
