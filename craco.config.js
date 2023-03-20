const { addBeforeLoader, loaderByName } = require('@craco/craco');
const webpack = require('webpack');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss')]
    }
  },
  webpack: {
    // though we don't use @ledgerhq, it is a dependency of a dependency, and has
    // caused problems. Seems to require React scripts 5.
    // see: https://github.com/solana-labs/wallet-adapter/issues/499
    plugins: {
      add: [
        new webpack.NormalModuleReplacementPlugin(
          /@ledgerhq\/devices\/hid-framing/,
          '@ledgerhq/devices/lib/hid-framing'
        ),
      ].concat(process.env.ANALYZE ? [new BundleAnalyzerPlugin()] : [])
    },
    configure: (webpackConfig) => {
      // take granular chunking https://github.com/vercel/next.js/issues/7631
      const FRAMEWORK_BUNDLES = [
        '@acala-network',
        '@polkadot',
        '@tensorsflow',
        'ag-grid-react',
        'ag-grid-community',
        'bn.js',
        'react',
        'react-dom',
        'react-router-dom',
        'scheduler',
        'prop-types',
        'ethers',
        'element-theme-default',
        'semantic-ui-css',
        'semantic-ui-react',
        'rxjs'
      ];

      const MANTA_BUNDLES = [
        'manta.js',
        'manta.js-kg-dev',
        'manta-wasm-wallet-api',
        'manta-polkawallet-bridge',
        'mantasbt.js'
      ];

      const singleLoadCacheGroups = ['element-react'].reduce(
        (groups, moduleName, index) => ({
          ...groups,
          [moduleName]: {
            test: new RegExp(`[\\/]node_modules[\\/]${moduleName}[\\/]`),
            name: `${moduleName}`,
            priority: 40,
            reuseExistingChunk:true
          }
        }),
        {}
      );

      webpackConfig.optimization.splitChunks.cacheGroups = {
        default: false,
        vendors: false,
        framework: {
          name: 'framework',
          test: new RegExp(
            `(?<!node_modules.*)[\\/]node_modules[\\/](${FRAMEWORK_BUNDLES.join(
              `|`
            )})[\\/]`
          ),
          priority: 60,
          enforce: true
        },
        manta: {
          name: 'manta',
          test: new RegExp(
            `(?<!node_modules.*)[\\/]node_modules[\\/](${MANTA_BUNDLES.join(
              `|`
            )})[\\/]`
          ),
          priority: 50,
          enforce: true
        },
        ...singleLoadCacheGroups,
        commons: {
          name: 'commons',
          minChunks: 10,
          priority: 20
        },
        shared: {
          name: false,
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true
        }
      };

      webpackConfig.module.rules.push(
        {
          test: /\.(js|ts)$/,
          loader: require.resolve('@open-wc/webpack-import-meta-loader')
        },
        {
          test: /\.svg$/,
          loader: require.resolve('@svgr/webpack')
        }
      );

      const wasmExtensionRegExp = /\.wasm$/;
      webpackConfig.resolve.extensions.push('.wasm');

      webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
            oneOf.exclude.push(wasmExtensionRegExp);
          }
        });
      });

      const wasmLoader = {
        test: /\.wasm$/,
        exclude: /node_modules/,
        loaders: ['wasm-loader']
      };

      addBeforeLoader(webpackConfig, loaderByName('file-loader'), wasmLoader);

      return webpackConfig;
    }
  }
};
