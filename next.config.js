/** @type {import('next').NextConfig} */
require("dotenv").config({ path: `${process.env.ENVIRONMENT}` });
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            dimensions: false,
          },
        },
      ],
    });
    return config;
  },

  images: {
    domains: ["xnl-platform.s3.amazonaws.com", "collectibles.s3.amazonaws.com"],
  },

  reactStrictMode: true,
};
