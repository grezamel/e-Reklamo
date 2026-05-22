import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import logo from '@/Assets/images/eReklamo_logo.png';
import topEllipse from '@/Assets/images/green_top_ellipse.png';
import bottomEllipse from '@/Assets/images/green_bottom_ellipse.png';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password - e-Reklamo" />
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

                    <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot your password?</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        No problem. Enter your email and we'll send you a reset link.
                    </p>

                    {status && (
                        <div className="mb-5 text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <input type="email" value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="Enter your email address" autoFocus
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50">
                            {processing ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Remember your password?{' '}
                        <Link href={route('login')} className="text-emerald-600 font-semibold hover:text-emerald-700">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
