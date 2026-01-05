'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MasterService } from '@/services/master.service';
import { DynamicIcon } from '@/components/DynamicIcon';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';

export function MasterList({ items, type }: { items: any[], type: string }) {
    const router = useRouter();
    const { success, error } = useToast();
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (item: any) => {
        setDeleteTarget(item);
    };

    const confirmDelete = async () => {
        if (!deleteTarget?._id) return;
        setIsDeleting(true);
        try {
            await MasterService.delete(type, deleteTarget._id);
            success('Item deleted successfully');
            setDeleteTarget(null);
            router.refresh();
        } catch (err) {
            console.error(err);
            error('Failed to delete item');
        } finally {
            setIsDeleting(false);
        }
    };

    if (!items || items.length === 0) {
        return (
            <div className="p-16 text-center text-muted">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">📭</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-heading mb-1">No items found</h3>
                <p className="text-sm">Create your first item to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-320px)]">
            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title={`Delete ${type.slice(0, -1)}`} // Remove 's' roughly
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h4>
                    <p className="text-sm text-gray-500 mb-6">
                        You are about to delete <strong>{deleteTarget?.name || deleteTarget?.label}</strong>. This item will be removed from all associated houseboats.
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
                            {isDeleting ? 'Deleting...' : 'Delete Item'}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider font-serif sticky top-0 z-10 bg-gray-50/95 backdrop-blur shadow-sm">Name</th>
                            {type === 'badges' && <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider font-serif sticky top-0 z-10 bg-gray-50/95 backdrop-blur shadow-sm">Icon</th>}
                            <th className="px-6 py-4 text-right text-xs font-bold text-muted uppercase tracking-wider font-serif sticky top-0 z-10 bg-gray-50/95 backdrop-blur shadow-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {items.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-heading font-serif">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {item.name || item.label}
                                    </span>
                                    {item.category && <span className="ml-2 text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase tracking-wide">{item.category}</span>}
                                </td>
                                {type === 'badges' && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {item.icon && <span className="text-gray-500"><DynamicIcon name={item.icon} size={20} /></span>}
                                    </td>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDeleteClick(item)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
