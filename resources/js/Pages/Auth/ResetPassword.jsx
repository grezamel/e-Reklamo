import { useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import logo from '@/Assets/images/eReklamo_logo.png';
import topEllipse from '@/Assets/images/green_top_ellipse.png';
import bottomEllipse from '@/Assets/images/green_bottom_ellipse.png';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <>
            <Head title="Reset Password - e-Reklamo" />
            <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center px-4 py-8">
                <img src={topEllipse} alt="" aria-hidden="true"
                    className="pointer-events-none absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-[420px] lg:h-[420px] -translate-y-1/3 translate-x-1/3 select-none" />
                <img src={bottomEllipse} alt="" aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-[420px] lg:h-[420px] translate-y-1/3 -translate-x-1/3 select-none" />

                <div className="relative z-10 w-full max-w-sm">
                    <div className="text-center mb-8">
                        <img src={logo} alt="e-Reklamo logo" className="h-16 w-16 mx-auto mb-3 object-contain" />
                        <h1 className="text-2xl font-bold">
                            <span className="text-emerald-600">e-</span><span className="text-blue-900">Reklamo</span>
                        </h1>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-1">Set new password</h2>
                    <p className="text-sm text-gray-500 mb-6">Choose a strong password for your account.</p>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                placeholder="Email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                            <InputError message={errors.email} className="mt-1" />
                        </div>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="New password" autoFocus
                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            <InputError message={errors.password} className="mt-1" />
                        </div>
                        <div className="relative">
                            <input type={showConfirm ? 'text' : 'password'} value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50">
                            {processing ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
