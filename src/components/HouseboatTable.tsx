'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { HouseboatAPI } from '@/services/api';
import { getImageUrl } from '@/lib/constants';
import { Houseboat } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';



const HouseboatRow = memo(({
    hb,
    onDelete
}: {
    hb: Houseboat;
    onDelete: (hb: Houseboat) => void
}) => {
    return (
        <tr className="hover:bg-gray-50/80 transition-colors group">
            <td className="px-4 py-1.5 whitespace-nowrap">
                <div className="h-8 w-12 bg-gray-100 rounded overflow-hidden relative border border-gray-200">
                    {hb.images?.hero ? (
                        <Image
                            src={getImageUrl(hb.images.hero)}
                            alt={hb.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Eye size={12} />
                        </div>
                    )}
                </div>
            </td>
            <td className="px-4 py-1.5 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="ml-0">
                        <div className="text-sm font-bold text-gray-900">{hb.name}</div>
                        <div className="text-[10px] text-gray-500 capitalize">{hb.category_id?.display_name || 'Uncategorized'}</div>
                    </div>
                </div>
            </td>
            <td className="px-4 py-1.5 whitespace-nowrap">
                <span className={`px-2 py-0.5 inline-flex text-[10px] leading-3 font-bold uppercase tracking-wide rounded-full border ${hb.status === 'active'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : hb.status === 'maintenance' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {hb.status}
                </span>
            </td>
            <td className="px-4 py-1.5 whitespace-nowrap text-xs text-body font-medium text-right font-mono">
                {(() => {
                    const min = hb.price_override?.price_range?.min ?? hb.min_price ?? 0;
                    const max = hb.price_override?.price_range?.max ?? hb.max_price ?? 0;
                    if (min === 0 && max === 0) {
                        return <span className="text-gray-400 italic text-[10px]">Price on Request</span>;
                    }
                    return `₹ ${min.toLocaleString()} - ₹ ${max.toLocaleString()}`;
                })()}
            </td>
            <td className="px-4 py-1.5 whitespace-nowrap text-right text-xs font-medium">
                <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                    <button
                        onClick={() => onDelete(hb)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Boat"
                    >
                        <Trash2 size={14} />
                    </button>
                    <Link
                        href={`/houseboats/${hb._id}/preview`}
                        className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        title="Preview Boat"
                    >
                        <Eye size={14} />
                    </Link>
                    <Link
                        href={`/houseboats/${hb._id}/edit`}
                        className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Boat"
                    >
                        <Edit size={14} />
                    </Link>
                </div>
            </td>
        </tr>
    );
});
HouseboatRow.displayName = 'HouseboatRow';

const HouseboatCard = memo(({
    hb,
    onDelete
}: {
    hb: Houseboat;
    onDelete: (hb: Houseboat) => void
}) => {
    return (
        <div className="bg-white rounded border border-gray-100 shadow-sm p-2 flex flex-col justify-between">
            <div>
                <div className="w-full aspect-video bg-gray-100 rounded mb-1.5 overflow-hidden relative">
                    {hb.images?.hero ? (
                        <Image
                            src={getImageUrl(hb.images.hero)}
                            alt={hb.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Eye size={12} />
                        </div>
                    )}
                    <div className="absolute top-1 right-1">
                        <span className={`px-1 py-[1px] text-[9px] font-bold uppercase rounded border shadow-sm ${hb.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : hb.status === 'maintenance' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            {hb.status}
                        </span>
                    </div>
                </div>
                <h3 className="text-xs font-bold text-gray-900 truncate mb-0">{hb.name}</h3>
                <p className="text-[9px] text-gray-500 capitalize mb-1">{hb.category_id?.display_name || 'Uncategorized'}</p>
                <p className="text-xs font-mono font-medium text-gray-900 leading-tight">
                    {(() => {
                        const min = hb.price_override?.price_range?.min ?? hb.min_price ?? 0;
                        const max = hb.price_override?.price_range?.max ?? hb.max_price ?? 0;
                        if (min === 0 && max === 0) {
                            return <span className="text-gray-400 italic text-[10px]">Price on Request</span>;
                        }
                        return `₹ ${min.toLocaleString()} - ₹ ${max.toLocaleString()}`;
                    })()}
                </p>
            </div>
            <div className="flex justify-end gap-2 mt-2 pt-1.5 border-t border-gray-50">
                <Link href={`/houseboats/${hb._id}/preview`} className="text-gray-400 hover:text-blue-500"><Eye size={14} /></Link>
                <Link href={`/houseboats/${hb._id}/edit`} className="text-gray-400 hover:text-blue-500"><Edit size={14} /></Link>
                <button onClick={() => onDelete(hb)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
            </div>
        </div>
    );
});
HouseboatCard.displayName = 'HouseboatCard';


export function HouseboatTable({ houseboats: initialHouseboats }: { houseboats: Houseboat[] }) {
    const router = useRouter();
    const { success, error } = useToast();
    const [deleteTarget, setDeleteTarget] = useState<Houseboat | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    console.group('HouseboatTable Debug');
    console.log('Received Houseboats:', initialHouseboats);
    console.log('Count:', initialHouseboats?.length);
    console.groupEnd();

    const handleDeleteClick = (boat: Houseboat) => {
        setDeleteTarget(boat);
    };

    const confirmDelete = async () => {
        if (!deleteTarget?._id) return;
        setIsDeleting(true);
        try {
            await HouseboatAPI.delete(deleteTarget._id);
            success('Houseboat deleted successfully');
            setDeleteTarget(null);
            router.refresh();
        } catch (e) {
            console.error(e);
            error('Failed to delete houseboat');
        } finally {
            setIsDeleting(false);
        }
    };

    if (initialHouseboats.length === 0) {
        return (
            <div className="p-16 text-center text-muted">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡️</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-heading mb-1">No houseboats yet</h3>
                <p className="text-sm mb-6">Create your first package to get started.</p>
                <Link href="/houseboats/new" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-primary/20 transition-all">
                    Create Package
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete Houseboat"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h4>
                    <p className="text-sm text-gray-500 mb-6">
                        You are about to delete <strong>{deleteTarget?.name}</strong>. This action cannot be undone and will remove the boat from the fleet.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={() => setDeleteTarget(null)}
                            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 flex justify-center items-center"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Boat'}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-[10px] font-bold text-muted uppercase tracking-wider font-serif bg-gray-50/95 backdrop-blur shadow-sm">Image</th>
                            <th className="px-4 py-2 text-left text-[10px] font-bold text-muted uppercase tracking-wider font-serif bg-gray-50/95 backdrop-blur shadow-sm">Name</th>
                            <th className="px-4 py-2 text-left text-[10px] font-bold text-muted uppercase tracking-wider font-serif bg-gray-50/95 backdrop-blur shadow-sm">Status</th>
                            <th className="px-4 py-2 text-right text-[10px] font-bold text-muted uppercase tracking-wider font-serif bg-gray-50/95 backdrop-blur shadow-sm">Price</th>
                            <th className="px-4 py-2 text-right text-[10px] font-bold text-muted uppercase tracking-wider font-serif bg-gray-50/95 backdrop-blur shadow-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {initialHouseboats.map((hb) => (
                            <HouseboatRow key={hb._id} hb={hb} onDelete={handleDeleteClick} />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden p-2 grid grid-cols-2 gap-2 content-start">
                {initialHouseboats.map((hb) => (
                    <HouseboatCard key={hb._id} hb={hb} onDelete={handleDeleteClick} />
                ))}
            </div>
        </div>
    );
}
