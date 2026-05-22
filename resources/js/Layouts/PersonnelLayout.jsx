import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import logo from '@/Assets/images/eReklamo_logo.png';

export default function PersonnelLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth, flash } = usePage().props;
    const personnel = auth?.personnel;

    const navItems = [
        {
            label: 'Dashboard',
            href: route('personnel.dashboard'),
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        },
        {
            label: 'Complaints',
            href: route('personnel.complaints.index'),
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
        },
        {
            label: 'Analytics',
            href: route('personnel.analytics'),
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
        },
        ...(personnel?.is_admin ? [
            {
                label: 'Users',
                href: route('personnel.personnel.index'),
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
            },
            {
                label: 'Citizens',
                href: route('personnel.citizens.index'),
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            },
        ] : []),
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('personnel.logout'));
    };

    const isActive = (href) => {
        try { return window.location.pathname === new URL(href).pathname; }
        catch { return false; }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-screen w-64 bg-[#1e3a8a] text-white z-40 flex flex-col
                transform transition-transform duration-200
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:sticky lg:top-0
            `}>
                {/* Sidebar logo */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-blue-800">
                    <Link href={route('personnel.dashboard')} className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 p-0.5">
                            <img src={logo} alt="e-Reklamo"
                                className="h-full w-full object-contain" />
                        </div>
                        <span className="font-bold text-base leading-none">
                            <span className="text-emerald-400">e-</span>Reklamo
                        </span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                                isActive(item.href)
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-blue-100 hover:bg-blue-800'
                            }`}>
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User footer */}
                <div className="px-4 py-4 border-t border-blue-800 space-y-2">
                    <Link href={route('personnel.profile.edit')}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blue-800 transition">
                        <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {personnel?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{personnel?.name}</p>
                            <p className="text-xs text-blue-300 truncate">{personnel?.email}</p>
                        </div>
                    </Link>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-200 hover:bg-blue-800 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar (mobile only — shows hamburger) */}
                <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-20 lg:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="h-7 w-7 rounded-full bg-blue-900 flex items-center justify-center p-0.5 flex-shrink-0">
                        <img src={logo} alt="e-Reklamo" className="h-full w-full object-contain" />
                    </div>
                    <span className="font-bold text-sm text-blue-900">
                        <span className="text-emerald-600">e-</span>Reklamo
                    </span>
                </header>

                {flash?.success && (
                    <div className="mx-4 mt-4">
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            {flash.success}
                        </div>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-4 mt-4">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {flash.error}
                        </div>
                    </div>
                )}

                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
