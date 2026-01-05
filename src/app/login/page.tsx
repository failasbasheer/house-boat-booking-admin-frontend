'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthAPI } from '@/services/api';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await AuthAPI.login({ username, password });
            router.push('/'); // Redirect to dashboard
        } catch (err) {
            console.error(err);
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-panel rounded-lg shadow-xl overflow-hidden">
                <div className="bg-primary p-8 text-center">
                    <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
                    <p className="text-forest-50 mt-2">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-espresso-500 mb-1">Username</label>
                        <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 glass-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="admin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-espresso-500 mb-1">Password</label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 glass-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-all ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-hover hover:shadow-lg'
                            }`}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
