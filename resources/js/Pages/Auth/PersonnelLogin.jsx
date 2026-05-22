import { useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import logo from '@/Assets/images/eReklamo_logo.png';
import topEllipse from '@/Assets/images/blue_top_ellipse.png';
import bottomEllipse from '@/Assets/images/blue_bottom_ellipse.png';

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
            <div className="min-h-screen bg-gray-50 relative overflow-hidden flex">

                {/* ── Left branding panel (lg+) ── */}
                <div className="hidden lg:flex lg:w-1/2 bg-blue-900 items-center justify-center relative overflow-hidden flex-shrink-0">
                    <img src={topEllipse} alt="" aria-hidden="true"
                        className="pointer-events-none absolute top-0 right-0 w-[480px] h-[480px] -translate-y-1/3 translate-x-1/3 select-none opacity-50" />
                    <img src={bottomEllipse} alt="" aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 left-0 w-[480px] h-[480px] translate-y-1/3 -translate-x-1/3 select-none opacity-50" />
                    <div className="relative z-10 text-center text-white px-12">
                        {/* Logo in a glowing circle */}
                        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-white/10 ring-4 ring-white/20 mb-8 mx-auto">
                            <img src={logo} alt="e-Reklamo logo" className="h-16 w-16 object-contain" />
                        </div>
                        <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
                            <span className="text-emerald-400">e-</span>Reklamo
                        </h1>
                        <p className="text-blue-200 text-lg mb-6">Manage community complaints</p>
                        {/* Decorative divider */}
                        <div className="w-16 h-1 bg-emerald-400 rounded-full mx-auto mb-6" />
                        <p className="text-blue-300 text-sm max-w-xs mx-auto leading-relaxed">
                            LGU Personnel Portal — monitor, manage, and resolve citizen complaints efficiently.
                        </p>
                    </div>
                </div>

                {/* ── Right form panel ── */}
                <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
                    {/* Mobile-only ellipses */}
                    <img src={topEllipse} alt="" aria-hidden="true"
                        className="lg:hidden pointer-events-none absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 -translate-y-1/3 translate-x-1/3 select-none opacity-30" />
                    <img src={bottomEllipse} alt="" aria-hidden="true"
                        className="lg:hidden pointer-events-none absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 translate-y-1/3 -translate-x-1/3 select-none opacity-30" />

                    <div className="relative z-10 w-full max-w-sm">
                        {/* Mobile logo */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-900/10 ring-2 ring-blue-200 mb-3 mx-auto">
                                <img src={logo} alt="e-Reklamo logo" className="h-12 w-12 object-contain" />
                            </div>
                            <h1 className="text-2xl font-bold">
                                <span className="text-emerald-600">e-</span><span className="text-blue-900">Reklamo</span>
                            </h1>
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
                                <input type="email" value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="Enter your email" autoFocus
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')}
                                        className="text-emerald-600 hover:text-emerald-700 font-semibold">
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
