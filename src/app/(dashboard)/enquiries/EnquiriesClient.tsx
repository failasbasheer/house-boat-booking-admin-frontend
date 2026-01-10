"use client";

import React, { useEffect, useState } from 'react';
import { EnquiryAPI } from '@/services/enquiry.service';
import { Search, Download, Trash2, Phone, Mail, MessageSquare, FileSpreadsheet, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import * as XLSX from 'xlsx';

interface Enquiry {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    date: string;
    guests: string;
    category: string;
    status: 'new' | 'contacted' | 'booked' | 'lost';
    message?: string;
    createdAt: string;
}

export default function EnquiriesClient() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        category: ''
    });
    const [showExportMenu, setShowExportMenu] = useState(false);

    const { success, error } = useToast();

    const loadEnquiries = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await EnquiryAPI.getAll(filters) as Enquiry[];
            setEnquiries(data);
        } catch (err) {
            console.error(err);
            error('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    }, [filters, error]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            loadEnquiries();
        }, 500);
        return () => clearTimeout(debounce);
    }, [loadEnquiries]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const updated = await EnquiryAPI.update(id, { status: newStatus }) as Enquiry;
            setEnquiries(prev => prev.map(e => e._id === id ? updated : e));
            success('Status updated');
        } catch (err) {
            error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await EnquiryAPI.delete(id);
            setEnquiries(prev => prev.filter(e => e._id !== id));
            success('Enquiry deleted');
        } catch (err) {
            error('Failed to delete enquiry');
        }
    };

    const handleExport = (type: 'csv' | 'excel') => {
        if (enquiries.length === 0) return;

        const data = enquiries.map(e => ({
            Name: e.name,
            Phone: e.phone,
            Email: e.email || '',
            Date: new Date(e.date).toLocaleDateString(),
            Guests: e.guests,
            Category: e.category,
            Status: e.status,
            'Created At': new Date(e.createdAt).toLocaleString(),
            Message: e.message || ''
        }));

        if (type === 'excel') {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Enquiries");
            XLSX.writeFile(wb, `enquiries_${new Date().toISOString().split('T')[0]}.xlsx`);
        } else {
            const headers = Object.keys(data[0]);
            const rows = data.map(obj => Object.values(obj).map(v => typeof v === 'string' && v.includes(',') ? `"${v}"` : v)); // Basic escaping

            const csvContent = "data:text/csv;charset=utf-8,"
                + headers.join(",") + "\n"
                + rows.map(e => e.join(",")).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `enquiries_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        setShowExportMenu(false);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-serif text-primary">Enquiries</h1>
                    <p className="text-gray-500">Manage leads and customer requests</p>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download size={18} />
                        Export
                    </button>
                    {showExportMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                            <button
                                onClick={() => handleExport('csv')}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 font-medium border-b border-gray-50"
                            >
                                <FileText size={16} className="text-gray-400" />
                                Download CSV
                            </button>
                            <button
                                onClick={() => handleExport('excel')}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 font-medium"
                            >
                                <FileSpreadsheet size={16} className="text-green-600" />
                                Download Excel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search name, phone, email..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="py-2 px-3 border border-gray-200 rounded-lg focus:outline-none"
                >
                    <option value="">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="booked">Booked</option>
                    <option value="lost">Lost</option>
                </select>
                <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="py-2 px-3 border border-gray-200 rounded-lg focus:outline-none"
                >
                    <option value="">All Categories</option>
                    <option value="Luxury Houseboats">Luxury</option>
                    <option value="Premium Houseboats">Premium</option>
                    <option value="Deluxe Houseboats">Deluxe</option>
                    <option value="Kerala Package">Kerala Package</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Customer</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Details</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Category</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading enquiries...</td></tr>
                        ) : enquiries.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No enquiries found.</td></tr>
                        ) : (
                            enquiries.map((enq) => (
                                <tr key={enq._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{enq.name}</div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                            <Phone size={12} /> {enq.phone}
                                        </div>
                                        {enq.email && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                <Mail size={12} /> {enq.email}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <span className="font-medium">{enq.guests}</span> Guests
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Travel Date: {new Date(enq.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-100">
                                            {enq.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={enq.status}
                                            onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                                            className={`text-sm rounded-lg px-2 py-1 border-0 ring-1 ring-inset  cursor-pointer focus:ring-2
                                                ${enq.status === 'new' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : ''}
                                                ${enq.status === 'contacted' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' : ''}
                                                ${enq.status === 'booked' ? 'bg-green-50 text-green-700 ring-green-600/20' : ''}
                                                ${enq.status === 'lost' ? 'bg-gray-50 text-gray-600 ring-gray-500/10' : ''}
                                            `}
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="booked">Booked</option>
                                            <option value="lost">Lost</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(enq.createdAt).toLocaleDateString()}
                                        <div className="text-xs text-gray-400">
                                            {new Date(enq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(enq._id)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        {enq.message && (
                                            <div className="group relative inline-block ml-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                                                    <MessageSquare size={16} />
                                                </button>
                                                <div className="absolute right-0 w-64 p-3 bg-white shadow-xl border rounded-xl z-10 hidden group-hover:block text-sm text-gray-700">
                                                    {enq.message}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
