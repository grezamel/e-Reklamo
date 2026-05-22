import { useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import logo from '@/Assets/images/eReklamo_logo.png';
import topEllipse from '@/Assets/images/blue_top_ellipse.png';
import bottomEllipse from '@/Assets/images/blue_bottom_ellipse.png';

const EyeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeOffIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

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
            {/* Same centered layout as citizen login, using blue ellipses */}
            <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center px-4 py-8">
                <img src={topEllipse} alt="" aria-hidden="true"
                    className="pointer-events-none absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-[420px] lg:h-[420px] -translate-y-1/3 translate-x-1/3 select-none" />
                <img src={bottomEllipse} alt="" aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-[420px] lg:h-[420px] translate-y-1/3 -translate-x-1/3 select-none" />

                <div className="relative z-10 w-full max-w-sm">
                    {/* Logo — same size as citizen */}
                    <div className="text-center mb-8">
                        <img src={logo} alt="e-Reklamo logo"
                            className="h-20 w-20 mx-auto mb-3 object-contain" />
                        <h1 className="text-2xl font-bold">
                            <span className="text-emerald-600">e-</span><span className="text-blue-900">Reklamo</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Welcome, Admin!</p>
                        <p className="text-xs text-gray-400 mt-1">Sign in to the personnel portal.</p>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 p-3 rounded-lg">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <input type="email" value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="Email" autoFocus
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
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
                                    className="text-blue-600 hover:text-emerald-700 font-semibold">
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full bg-blue-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50">
                            {processing ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
