import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="e-Reklamo - Your Voice Matters" />
            <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center px-4">
                <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-40 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-200 rounded-full translate-y-1/2 -translate-x-1/2 opacity-40 pointer-events-none" />

                <div className="relative z-10 text-center max-w-md w-full">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-900 rounded-full mb-4">
                        <svg className="w-11 h-11 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-blue-900 mb-2">e-Reklamo</h1>
                    <p className="text-xl font-semibold text-emerald-600 mb-4">Your Voice Matters</p>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Report community issues directly to local authorities. Track complaints and help make your community better.
                    </p>

                    {auth?.citizen ? (
                        <Link href={route('citizen.dashboard')}
                            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <div className="flex gap-3 justify-center">
                            <Link href={route('register')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                                Get Started
                            </Link>
                            <Link href={route('login')}
                                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg font-semibold transition">
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
