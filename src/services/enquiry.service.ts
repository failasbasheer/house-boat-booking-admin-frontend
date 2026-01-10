import { clientFetch } from './api';

export const EnquiryAPI = {
    getAll: async (filters: any) => {
        const query = new URLSearchParams(filters).toString();
        return clientFetch(`/enquiries?${query}`);
    },
    create: async (data: any) => {
        return clientFetch('/enquiries', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id: string, data: any) => {
        return clientFetch(`/enquiries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    delete: async (id: string) => {
        return clientFetch(`/enquiries/${id}`, {
            method: 'DELETE',
        });
    }
};
