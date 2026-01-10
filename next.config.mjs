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
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'house-boat-booking-admin-backend.onrender.com',
            },
            {
                protocol: 'https',
                hostname: 'houseboat-booking.s3.ap-south-1.amazonaws.com',
            },
        ],
    },
};

export default nextConfig;
