import React, { Suspense } from 'react';
import Link from 'next/link';
import { clientFetch } from '@/services/api';
import { Server, Database, UserStar } from 'lucide-react';

export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';

async function getDashboardStats(headers: RequestInit = {}) {
    try {
        const stats = await clientFetch<any>('/dashboard/stats', headers);
        return stats;
    } catch (e) {
        console.error('Stats fetch failed', e);
        return null;
    }
}

export default async function DashboardPage() {
    const cookieStore = cookies();
    const stats = await getDashboardStats({ headers: { Cookie: cookieStore.toString() } });

    const houseboats = stats?.houseboats || { total: 0, active: 0 };
    const categories = stats?.categories || { total: 0, active: 0 };
    const masters = stats?.masters || { amenities: 0, features: 0, badges: 0 };

    return (
        <>
            <header className="bg-background/90 backdrop-blur-md border-b border-gray-200/50 p-8 flex justify-between items-center sticky top-0 z-10 transition-all">
                <div>
                    <h2 className="text-2xl font-bold text-foreground font-cinzel">Dashboard</h2>
                    <p className="text-espresso-500 text-sm mt-1">Overview of your marina activity.</p>
                </div>
                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm hover:bg-white/80 transition-all cursor-pointer group">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold text-gray-900 leading-none">Admin User</p>
                        <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider mt-1">Administrator</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-[2px] shadow-md group-hover:shadow-lg transition-shadow">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                            <UserStar size={20} className="text-emerald-700" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    <Suspense fallback={<StatsSkeleton />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DashboardCard
                                title="Total Houseboats"
                                value={houseboats.total}
                                icon={<BoatIcon />}
                                color="from-blue-500 to-blue-600"
                                shadow="shadow-blue-500/20"
                            />
                            <DashboardCard
                                title="Active Packages"
                                value={categories.active}
                                icon={<TagIcon />}
                                color="from-emerald-500 to-emerald-600"
                                shadow="shadow-emerald-500/20"
                            />
                            <DashboardCard
                                title="Master Items"
                                value={(masters.amenities + masters.features + masters.badges)}
                                icon={<SettingsIcon />}
                                color="from-amber-500 to-amber-600"
                                shadow="shadow-amber-500/20"
                            />
                        </div>
                    </Suspense>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-foreground mb-4 font-cinzel">Quick Actions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <QuickActionButton
                                    href="/houseboats/new"
                                    label="Add New Houseboat"
                                    desc="Create a new fleet item"
                                    icon={<PlusIcon />}
                                />
                                <QuickActionButton
                                    href="/categories"
                                    label="Update Pricing"
                                    desc="Manage tiers and rates"
                                    icon={<TagIcon />}
                                />
                                <QuickActionButton
                                    href="/masters"
                                    label="Master Data"
                                    desc="Manage amenities & features"
                                    icon={<SettingsIcon />}
                                />
                            </div>
                        </div>

                        <div className="glass-panel rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-foreground mb-4 font-cinzel">System Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <Server size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-espresso-500">API Service</span>
                                    </div>
                                    <span className="flex items-center text-xs font-bold text-green-600">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Operational
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                            <Database size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-espresso-500">Database</span>
                                    </div>
                                    <span className="flex items-center text-xs font-bold text-green-600">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Connected
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
        </div>
    );
}

const DashboardCard = ({ title, value, icon, color, shadow }: any) => (
    <div className="glass-card rounded-2xl p-6 flex items-center space-x-5 border border-white/20">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg ${shadow} flex items-center justify-center`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-semibold text-espresso-500 uppercase tracking-wide mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground font-cinzel">{value}</p>
        </div>
    </div>
);

const QuickActionButton = ({ href, label, desc, icon }: any) => (
    <Link href={href} className="group block p-4 glass-card rounded-xl hover:bg-forest-700/5 transition-all border border-white/20 hover:border-forest-700/20">
        <div className="flex items-start space-x-3">
            <div className="text-bronze-600 mt-1">{icon}</div>
            <div>
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{label}</h4>
                <p className="text-xs text-espresso-500 mt-0.5">{desc}</p>
            </div>
        </div>
    </Link>
);

const PlusIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const BoatIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;

const TagIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>;
const SettingsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
