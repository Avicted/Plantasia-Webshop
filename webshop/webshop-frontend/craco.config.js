// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
    babel: {
      plugins: [
        '@babel/plugin-proposal-nullish-coalescing-operator',
      ],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.js$/,
        include: /node_modules\/@tanstack\/virtual-core/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-nullish-coalescing-operator'],
          },
        },
      });
      return webpackConfig;
    },
  },
}