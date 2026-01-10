'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthAPI } from '@/services/api';
import { LayoutDashboard, Ship, Package, LogOut, Sliders, PlusCircle, Briefcase, ClipboardList, Settings } from 'lucide-react';
import Image from 'next/image';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await AuthAPI.logout();
            router.push('/login');
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    return (
        <aside className="w-full md:w-72 bg-[var(--sidebar-bg)] border-r border-gray-200 flex-shrink-0 min-h-screen flex flex-col z-20">
            <div className="p-8 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-3">
                        <Image src="/logo.png" alt="Backwaters Logo" width={40} height={40} className="object-contain" />
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-primary font-serif">
                                <Link href="/">KERALA CRUISE LINE</Link>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                <NavLink href="/" active={pathname === '/'} icon={<LayoutDashboard size={20} />} label="Dashboard" />

                <div className="pt-6 pb-2">
                    <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Inventory</div>
                </div>

                <NavLink href="/houseboats" active={pathname === '/houseboats'} icon={<Ship size={20} />} label="All Boats" />
                <NavLink href="/houseboats/new" active={pathname.startsWith('/houseboats/new')} icon={<PlusCircle size={20} />} label="Add Boat" />
                <NavLink href="/enquiries" active={pathname === '/enquiries'} icon={<ClipboardList size={20} />} label="Enquiries" />

                <div className="pt-4 pb-2">
                    <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Categories</div>
                </div>
                <NavLink href="/categories" active={pathname === '/categories'} icon={<Package size={20} />} label="All Categories" />
                <NavLink href="/categories?action=new" active={pathname === '/categories?action=new'} icon={<PlusCircle size={20} />} label="Add Category" />

                <div className="pt-4 pb-2">
                    <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Packages</div>
                </div>
                <NavLink href="/packages" active={pathname === '/packages'} icon={<Briefcase size={20} />} label="All Packages" />
                <NavLink href="/packages?action=new" active={pathname === '/packages?action=new'} icon={<PlusCircle size={20} />} label="Add Package" />

                <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Content
                </div>
                <NavLink href="/masters" active={pathname.startsWith('/masters')} icon={<Sliders size={20} />} label="Master Data" />
                <NavLink href="/settings" active={pathname.startsWith('/settings')} icon={<Settings size={20} />} label="Settings" />
            </nav>

            <div className="p-6 border-t border-gray-200/50">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-muted hover:text-error transition-all w-full px-4 py-3 rounded-xl hover:bg-red-50 group"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

const NavLink = ({ href, active, label, icon }: { href: string, active: boolean, label: string, icon: React.ReactNode }) => (
    <Link
        href={href}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${active
            ? 'bg-white text-primary shadow-sm border border-gray-100'
            : 'text-body hover:bg-white hover:text-primary hover:shadow-sm'
            }`}
    >
        <span className={`${active ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`}>{icon}</span>
        <span>{label}</span>
    </Link>
);
