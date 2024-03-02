const runtimeCaching = require('next-pwa/cache');

const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
	runtimeCaching,
	disable: process.env.NODE_ENV !== 'production',
});

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lets-get-that-vocab.s3.us-west-2.amazonaws.com',
			},
		],
	},
};

module.exports = withPWA(nextConfig);
