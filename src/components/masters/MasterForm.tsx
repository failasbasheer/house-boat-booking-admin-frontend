'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MasterService } from '@/services/master.service';
import { DynamicIcon } from '@/components/DynamicIcon';

export function MasterForm({ type }: { type: string }) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [category, setCategory] = useState('highlight');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        setLoading(true);
        try {
            const payload: any = { name };
            if (type === 'amenities') {
            } else if (type === 'features') {
                payload.category = category;
            } else if (type === 'badges') {
                payload.label = name;
                delete payload.name;
                payload.color = 'blue';
                payload.icon = icon;
            }

            await MasterService.create(type, payload);
            setName('');
            setIcon('');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to create item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-8 flex gap-4 items-end">
            <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Name / Label</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder={`New ${type.slice(0, -1)} name`}
                />
            </div>

            {type === 'badges' && (
                <div className="w-40 relative">
                    <label className="block text-sm font-medium mb-1">
                        Icon
                    </label>
                    <select
                        value={icon}
                        onChange={e => setIcon(e.target.value)}
                        className="w-full border p-2 rounded appearance-none"
                    >
                        <option value="">Select Icon</option>
                        <option value="Star">Star</option>
                        <option value="Check">Check</option>
                        <option value="Shield">Shield</option>
                        <option value="Zap">Zap</option>
                        <option value="Heart">Heart</option>
                        <option value="Award">Award</option>
                        <option value="ThumbsUp">Thumbs Up</option>
                    </select>
                    {icon && (
                        <div className="absolute right-8 top-8 text-blue-600 pointer-events-none">
                            <DynamicIcon name={icon} size={20} />
                        </div>
                    )}
                </div>
            )}

            {type === 'features' && (
                <div className="w-40">
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="highlight">Highlight</option>
                        <option value="service">Service</option>
                        <option value="audience">Audience</option>
                        <option value="crew_role">Crew Role</option>
                        <option value="safety">Safety</option>
                    </select>
                </div>
            )}

            <button disabled={loading} type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {loading ? '...' : 'Add'}
            </button>
        </form>
    );
}
