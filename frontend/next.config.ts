import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 暂时禁用 CSP 来解决开发环境的问题
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: [
  //             "default-src 'self'",
  //             "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-dynamic' blob: data:",
  //             "style-src 'self' 'unsafe-inline' data:",
  //             "img-src 'self' data: https: blob: *",
  //             "font-src 'self' data: *",
  //             "connect-src 'self' http://localhost:8080 ws://localhost:3000 http://127.0.0.1:8080 *",
  //             "frame-src 'self' *",
  //             "object-src 'none'",
  //             "base-uri 'self'",
  //             "form-action 'self'",
  //             "frame-ancestors 'self'",
  //             "worker-src 'self' blob: data:",
  //             "media-src 'self' blob: data: *",
  //             "manifest-src 'self'",
  //             "prefetch-src 'self'",
  //             "script-src-elem 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-dynamic' blob: data:",
  //             "script-src-attr 'unsafe-inline'"
  //           ].join('; ')
  //         }
  //       ]
  //     }
  //   ];
  // }
};

export default nextConfig;
