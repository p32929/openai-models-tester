// Handle unhandled promise rejections
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error);
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // onDemandEntries: {
  //   // period (in ms) where the server will keep pages in the buffer
  //   maxInactiveAge: 60 * 60 * 1000,
  //   // number of pages that should be kept simultaneously without being disposed
  //   pagesBufferLength: 5,
  // },
};

export default nextConfig;
