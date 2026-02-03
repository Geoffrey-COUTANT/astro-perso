module.exports = {
  webpack: {
    configure: (config) => {
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        /Failed to parse source map/,
        /ENOENT: no such file or directory.*\.js\.map/,
      ];
      return config;
    },
  },
};
