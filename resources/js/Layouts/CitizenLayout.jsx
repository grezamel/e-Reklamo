import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import logo from '@/Assets/images/eReklamo_logo.png';

export default function CitizenLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { auth, flash } = usePage().props;

    const navItems = [
        {
            label: 'Home',
            href: route('citizen.dashboard'),
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        },
        {
            label: 'My Complaints',
            href: route('citizen.complaints.index'),
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
        },
        {
            label: 'Profile',
            href: route('citizen.profile.edit'),
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
        },
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('citizen.logout'));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-emerald-600 text-white shadow-md sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo + title */}
                        <Link href={route('citizen.dashboard')} className="flex items-center gap-2.5">
                            <img src={logo} alt="e-Reklamo" className="h-9 w-9 object-contain rounded-full bg-white/10 p-0.5" />
                            <span className="font-bold text-base leading-none">
                                <span className="text-emerald-200">e-</span>Reklamo
                            </span>
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full hidden sm:inline">Citizen</span>
                        </Link>

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map(item => (
                                <Link key={item.href} href={item.href}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition">
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                            <Link href={route('citizen.complaints.new')}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-white/20 hover:bg-white/30 transition ml-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Submit
                            </Link>
                            <button onClick={handleLogout}
                                className="ml-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition">
                                Logout
                            </button>
                        </div>

                        {/* Mobile hamburger */}
                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/10">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-white/20 px-4 py-3 space-y-1">
                        {navItems.map(item => (
                            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 transition">
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                        <Link href={route('citizen.complaints.new')} onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm bg-white/20 hover:bg-white/30 transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Submit Complaint
                        </Link>
                        <button onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10 transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                )}
            </nav>

            {flash?.success && (
                <div className="max-w-5xl mx-auto px-4 pt-4">
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        {flash.success}
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-5xl mx-auto px-4 pt-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {flash.error}
                    </div>
                </div>
            )}

            <main>{children}</main>
        </div>
    );
}
