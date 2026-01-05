/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5001/api/:path*', // Proxy to Backend
            },
            {
                source: '/uploads/:path*',
                destination: 'http://localhost:5001/uploads/:path*', // Proxy uploads to Backend
            },
        ];
    },
};

export default nextConfig;
