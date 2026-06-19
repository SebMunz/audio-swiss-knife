const isGithubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? "/audio-swiss-knife" : undefined,
  assetPrefix: isGithubPages ? "/audio-swiss-knife/" : undefined
};

export default nextConfig;
