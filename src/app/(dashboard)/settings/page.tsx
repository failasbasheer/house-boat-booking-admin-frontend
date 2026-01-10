'use client';

import { useState, useEffect } from 'react';
import { SettingsAPI, GlobalSettings } from '@/services/settings.service';
import { Save, Loader2, Phone, MessageCircle, Mail } from 'lucide-react';

export default function SettingsPage() {
    const [settings, setSettings] = useState<GlobalSettings>({
        whatsappNumber: '',
        whatsappMessage: '',
        contactPhone: '',
        contactEmail: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await SettingsAPI.get();
            if (data) setSettings(data);
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Failed to load settings', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const updated = await SettingsAPI.update(settings);
            setSettings(updated);
            setMessage({ text: 'Settings updated successfully', type: 'success' });
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Failed to update settings', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-full items-center justify-center min-h-[50vh]"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-2">Manage global application settings and contact information.</p>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                    <p className="text-sm text-gray-500">These details are displayed across the website for customer support.</p>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MessageCircle className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="whatsappNumber"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={settings.whatsappNumber}
                                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                                        placeholder="919876543210"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Format: Country code + Number (no spaces/symbols)</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Display Phone</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="contactPhone"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={settings.contactPhone}
                                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Visible format for users</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="contactEmail"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        value={settings.contactEmail}
                                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                        placeholder="hello@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="whatsappMessage" className="block text-sm font-medium text-gray-700">Default WhatsApp Message</label>
                            <input
                                type="text"
                                id="whatsappMessage"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                value={settings.whatsappMessage}
                                onChange={(e) => setSettings({ ...settings, whatsappMessage: e.target.value })}
                                placeholder="Hi, I'm interested..."
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="-ml-1 mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
