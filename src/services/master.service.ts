import { clientFetch } from './api';

export const MasterService = {
    // Generic list fetcher
    list: async (type: 'amenities' | 'features' | 'badges') => {
        return clientFetch(`/masters/${type}`);
    },

    create: async (type: string, data: any) => {
        return clientFetch(`/masters/${type}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (type: string, id: string, data: any) => {
        return clientFetch(`/masters/${type}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (type: string, id: string) => {
        return clientFetch(`/masters/${type}/${id}`, {
            method: 'DELETE'
        });
    }
};
