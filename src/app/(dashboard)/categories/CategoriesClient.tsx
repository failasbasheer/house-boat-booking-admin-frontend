'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CategoryAPI } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Category } from '@/types';
import { Pencil, Trash2, X, Eye, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Partial<Category> | undefined>(undefined);

    // Deletion State

    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const { success, error } = useToast();

    const loadCategories = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await CategoryAPI.getAll() as Category[];
            if (data && data.length > 0) {
                setCategories(data);
            } else {
                setCategories([]);
            }
        } catch (err) {
            console.error(err);
            error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    }, [error]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            setEditingCategory(undefined);
            setIsModalOpen(true);
        }
    }, [searchParams]);

    // loadCategories defined above


    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (category: Category) => {
        setDeleteTarget(category);
    };

    const confirmDelete = async () => {
        if (!deleteTarget?._id) return;
        setIsDeleting(true);
        try {
            await CategoryAPI.delete(deleteTarget._id);
            success('Category deleted');
            setDeleteTarget(null);
            loadCategories();
        } catch (err: any) {
            error(err.message || 'Failed to delete');
        } finally {
            setIsDeleting(false);
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(undefined);
        if (searchParams.get('action') === 'new') {
            router.replace('/categories');
        }
    };

    const handleSuccess = () => {
        handleCloseModal();
        loadCategories();
    };

    if (loading && !categories.length) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete Category"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h4>
                    <p className="text-sm text-gray-500 mb-6">
                        You are about to delete <strong>{deleteTarget?.display_name}</strong>. This action also affects any houseboats linked to this category.
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
                            {isDeleting ? 'Deleting...' : 'Delete Category'}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-heading">Categories Configuration</h1>
                    <p className="text-muted">Manage boat categories, pricing, and rich content.</p>
                </div>
                <button
                    onClick={() => { setEditingCategory(undefined); setIsModalOpen(true); }}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                >
                    + Add Category
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hidden md:block">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase font-serif">Slug</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase font-serif">Display Name</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-muted uppercase font-serif">Tagline</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-muted uppercase font-serif">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-muted uppercase font-serif">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <tr key={cat._id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono uppercase">{cat.slug || cat.id}</span>
                                </td>
                                <td className="px-4 py-2">
                                    <span className="font-medium text-gray-900">{cat.display_name}</span>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-500 max-w-xs truncate">
                                    {cat.tagline || '-'}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {cat.is_active ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-right space-x-2">
                                    <button
                                        onClick={() => router.push(`/categories/${cat._id}/preview`)}
                                        title="Preview Public Page"
                                        className="text-gray-500 hover:bg-gray-50 p-2 rounded transition-colors"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button onClick={() => handleEdit(cat)} title="Edit Category" className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"><Pencil size={16} /></button>
                                    <button onClick={() => handleDeleteClick(cat)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-8 text-gray-400">No categories found. Create one to get started.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden grid grid-cols-1 gap-4">
                {categories.map((cat) => (
                    <div key={cat._id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono uppercase">{cat.slug}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(cat)} className="text-blue-600 p-1"><Pencil size={16} /></button>
                                <button onClick={() => handleDeleteClick(cat)} className="text-red-500 p-1"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{cat.display_name}</h3>
                            <p className="text-sm text-gray-500">{cat.tagline}</p>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-mono font-medium">₹{cat.base_price?.toLocaleString()}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {cat.is_active ? 'Active' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold font-serif text-gray-900">
                                {editingCategory ? 'Edit Category' : 'New Category'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 bg-gray-50">
                            <CategoryForm
                                initialData={editingCategory}
                                onSuccess={handleSuccess}
                                onCancel={handleCloseModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
